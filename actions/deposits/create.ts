'use server';

import {getCurrentUser} from '@/actions/auth/session';
import {createDepositSession, type CreateDepositResult} from '@/lib/payments';

export interface CreateDepositActionInput {
  amount: number;
  currency?: string;
  returnUrl?: string;
}

/**
 * Server action to initiate a deposit order with Dodo Payments.
 * Authenticates the user, creates a checkout session, records a pending deposit,
 * and returns the checkout URL for the user to complete payment.
 */
export async function createDepositOrder(
  input: CreateDepositActionInput
): Promise<CreateDepositResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to add funds.',
    };
  }

  if (user.status === 'banned') {
    return {
      success: false,
      error: 'Your account is suspended.',
    };
  }

  const {amount, currency, returnUrl} = input;

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return {
      success: false,
      error: 'Please enter a valid deposit amount.',
    };
  }

  if (amount < 1) {
    return {
      success: false,
      error: 'Minimum deposit amount is ₹1.00.',
    };
  }

  if (amount > 50000) {
    return {
      success: false,
      error: 'Deposit amount exceeds the single transaction limit (₹50,000.00).',
    };
  }

  return createDepositSession({
    userId: user.id,
    userEmail: user.email,
    userName: user.username,
    amount,
    currency,
    customReturnUrl: returnUrl,
  });
}
