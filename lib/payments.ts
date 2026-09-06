import {randomUUID} from 'node:crypto';
import type {Currency, Payment, CheckoutSessionStatus} from 'dodopayments/resources';
import {collections} from '@/lib/db';
import type {Deposit, DepositStatus, Transaction} from '@/lib/database';
import {
  getAppBaseUrl,
  getDefaultCurrency,
  getDefaultProductId,
  getDodoPaymentsClient,
} from '@/lib/dodopayments';

export interface CreateDepositParams {
  userId: string;
  userEmail: string;
  userName?: string;
  amount: number;
  currency?: Currency | string;
  customReturnUrl?: string;
}

export interface CreateDepositResult {
  success: boolean;
  depositId?: string;
  sessionId?: string;
  checkoutUrl?: string;
  error?: string;
}

export interface VerifyDepositParams {
  depositId?: string | null;
  sessionId?: string | null;
  paymentId?: string | null;
  expectedUserId?: string | null;
}

export interface VerifyDepositResult {
  success: boolean;
  status: DepositStatus | 'not_found';
  message?: string;
  error?: string;
  deposit?: Deposit;
  amount?: number;
  currency?: string;
  transactionId?: string;
  alreadyProcessed?: boolean;
}

/**
 * Creates a Dodo Payments checkout session for adding funds to user balance
 * and persists the initial pending deposit in the database.
 */
export async function createDepositSession(params: CreateDepositParams): Promise<CreateDepositResult> {
  const {
    userId,
    userEmail,
    userName,
    amount,
    currency = getDefaultCurrency(),
    customReturnUrl,
  } = params;

  if (!Number.isFinite(amount) || amount <= 0) {
    return {success: false, error: 'Deposit amount must be greater than zero.'};
  }

  // Minimum deposit check (e.g. ₹1.00)
  if (amount < 1) {
    return {success: false, error: 'Minimum deposit amount is ₹1.00.'};
  }

  const depositId = randomUUID();
  const productId = getDefaultProductId();
  const dodo = getDodoPaymentsClient();

  const baseUrl = getAppBaseUrl();
  const returnUrl =
    customReturnUrl ||
    `${baseUrl}/api/payments/redirect?deposit_id=${depositId}&session_id={CHECKOUT_SESSION_ID}`;

  // Amount in smallest currency unit (cents / paise)
  const amountInSmallestUnit = Math.round(amount * 100);

  try {
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          amount: amountInSmallestUnit,
        },
      ],
      billing_currency: currency as Currency,
      customer: {
        email: userEmail,
        name: userName || userEmail.split('@')[0],
      },
      return_url: returnUrl,
      metadata: {
        depositId,
        userId,
        amount: amount.toString(),
        currency,
      },
      feature_flags: {
        redirect_immediately: true,
      },
    });

    const now = new Date().toISOString();
    const deposit: Deposit = {
      id: depositId,
      userId,
      amount,
      currency,
      status: 'pending',
      gateway: 'dodopayments',
      sessionId: session.session_id,
      checkoutUrl: session.checkout_url ?? undefined,
      createdAt: now,
    };

    await collections.deposits.insertOne(deposit);

    return {
      success: true,
      depositId,
      sessionId: session.session_id,
      checkoutUrl: session.checkout_url ?? undefined,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to initiate payment session with Dodo Payments.',
    };
  }
}

/**
 * Verifies the status of a deposit against Dodo Payments API and updates
 * the deposit status, transaction history, and user balance accordingly.
 *
 * Implements atomic updates to prevent double-crediting if called concurrently.
 */
export async function verifyAndProcessDeposit(params: VerifyDepositParams): Promise<VerifyDepositResult> {
  const {depositId, sessionId, paymentId, expectedUserId} = params;

  // 1. Locate deposit record in database
  let deposit: Deposit | null = null;
  if (depositId) {
    deposit = await collections.deposits.findOne({id: depositId});
  }
  if (!deposit && sessionId) {
    deposit = await collections.deposits.findOne({sessionId});
  }
  if (!deposit && paymentId) {
    deposit = await collections.deposits.findOne({gatewayTransactionId: paymentId});
  }

  // 2. Fallback: query Dodo API by paymentId or sessionId to find metadata if deposit record not yet matched
  const dodo = getDodoPaymentsClient();
  let dodoPayment: Payment | null = null;
  let dodoSession: CheckoutSessionStatus | null = null;

  if (!deposit) {
    try {
      if (paymentId) {
        dodoPayment = await dodo.payments.retrieve(paymentId);
        const metaDepositId = dodoPayment?.metadata?.depositId as string | undefined;
        if (metaDepositId) {
          deposit = await collections.deposits.findOne({id: metaDepositId});
        }
      } else if (sessionId) {
        dodoSession = await dodo.checkoutSessions.retrieve(sessionId);
        if (dodoSession.payment_id) {
          dodoPayment = await dodo.payments.retrieve(dodoSession.payment_id);
          const metaDepositId = dodoPayment?.metadata?.depositId as string | undefined;
          if (metaDepositId) {
            deposit = await collections.deposits.findOne({id: metaDepositId});
          }
        }
      }
    } catch {
      // Ignore retrieve error at lookup phase
    }
  }

  if (!deposit) {
    return {
      success: false,
      status: 'not_found',
      error: 'Deposit record could not be found.',
    };
  }

  // Check ownership if expectedUserId is supplied
  if (expectedUserId && deposit.userId !== expectedUserId) {
    return {
      success: false,
      status: 'not_found',
      error: 'Unauthorized access to this deposit.',
    };
  }

  // If already completed, do not credit again
  if (deposit.status === 'completed') {
    return {
      success: true,
      status: 'completed',
      deposit,
      amount: deposit.amount,
      currency: deposit.currency,
      transactionId: deposit.transactionId,
      alreadyProcessed: true,
    };
  }

  // 3. Fetch latest status from Dodo Payments
  const targetPaymentId = paymentId || deposit.gatewayTransactionId;
  const targetSessionId = sessionId || deposit.sessionId;

  try {
    if (targetPaymentId) {
      dodoPayment ??= await dodo.payments.retrieve(targetPaymentId);
    } else if (targetSessionId) {
      dodoSession ??= await dodo.checkoutSessions.retrieve(targetSessionId);
      if (dodoSession?.payment_id) {
        dodoPayment = await dodo.payments.retrieve(dodoSession.payment_id);
      } else if (dodoSession?.payment_status === 'succeeded' && dodoSession?.payment_id) {
        dodoPayment = await dodo.payments.retrieve(dodoSession.payment_id);
      }
    }
  } catch (err: unknown) {
    return {
      success: false,
      status: deposit.status,
      error: err instanceof Error ? err.message : 'Failed to query payment status from Dodo Payments.',
      deposit,
    };
  }

  // If no payment was created yet on the session
  if (!dodoPayment) {
    return {
      success: false,
      status: 'pending',
      message: 'Payment has not been completed yet.',
      deposit,
    };
  }

  const paymentStatus = dodoPayment.status;

  // 4. Handle Succeeded Payment
  if (paymentStatus === 'succeeded') {
    const totalAmountInSmallestUnit = dodoPayment.total_amount;
    const creditedAmount = totalAmountInSmallestUnit
      ? totalAmountInSmallestUnit / 100
      : deposit.amount;
    const resolvedCurrency = dodoPayment.currency || deposit.currency;
    const resolvedPaymentId = dodoPayment.payment_id || targetPaymentId || '';

    const transactionId = randomUUID();
    const completedAt = new Date().toISOString();

    // Atomic update to ensure single execution
    const updated = await collections.deposits.findOneAndUpdate(
      {
        id: deposit.id,
        status: {$ne: 'completed'},
      },
      {
        $set: {
          status: 'completed',
          amount: creditedAmount,
          currency: resolvedCurrency,
          gatewayTransactionId: resolvedPaymentId,
          transactionId,
          completedAt,
        },
      },
      {returnDocument: 'after'}
    );

    if (updated) {
      // Record transaction
      const transaction: Transaction = {
        id: transactionId,
        userId: deposit.userId,
        type: 'deposit',
        amount: creditedAmount,
        createdAt: completedAt,
      };
      await collections.transactions.insertOne(transaction);

      // Increment user balance
      await collections.users.updateOne(
        {id: deposit.userId},
        {$inc: {balance: creditedAmount}}
      );

      return {
        success: true,
        status: 'completed',
        deposit: updated,
        amount: creditedAmount,
        currency: resolvedCurrency,
        transactionId,
        alreadyProcessed: false,
      };
    } else {
      // Concurrently updated by another process
      const current = await collections.deposits.findOne({id: deposit.id});
      return {
        success: true,
        status: 'completed',
        deposit: current ?? deposit,
        amount: current?.amount ?? creditedAmount,
        currency: current?.currency ?? resolvedCurrency,
        transactionId: current?.transactionId ?? transactionId,
        alreadyProcessed: true,
      };
    }
  }

  // 5. Handle Failed Payment
  if (paymentStatus === 'failed') {
    const errorMsg = dodoPayment.error_message || 'Payment was unsuccessful.';
    await collections.deposits.updateOne(
      {id: deposit.id, status: 'pending'},
      {
        $set: {
          status: 'failed',
          errorMessage: errorMsg,
          gatewayTransactionId: dodoPayment.payment_id || targetPaymentId,
        },
      }
    );
    return {
      success: false,
      status: 'failed',
      error: errorMsg,
      deposit: {...deposit, status: 'failed', errorMessage: errorMsg},
    };
  }

  // 6. Handle Cancelled Payment
  if (paymentStatus === 'cancelled') {
    await collections.deposits.updateOne(
      {id: deposit.id, status: 'pending'},
      {
        $set: {
          status: 'cancelled',
          errorMessage: 'Payment was cancelled by the user.',
          gatewayTransactionId: dodoPayment.payment_id || targetPaymentId,
        },
      }
    );
    return {
      success: false,
      status: 'cancelled',
      error: 'Payment was cancelled.',
      deposit: {...deposit, status: 'cancelled'},
    };
  }

  // 7. Otherwise still processing / pending
  return {
    success: false,
    status: 'pending',
    message: 'Payment is currently processing.',
    deposit,
  };
}
