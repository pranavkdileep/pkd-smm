'use server';

import {getCurrentUser} from '@/actions/auth/session';
import {collections} from '@/lib/db';
import type {Deposit, Transaction} from '@/lib/database';
import {verifyAndProcessDeposit, type VerifyDepositResult} from '@/lib/payments';

export interface DepositStatusResponse {
  success: boolean;
  status: string;
  depositId?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  error?: string;
  message?: string;
  alreadyProcessed?: boolean;
}

/**
 * Server action to check the status of a specific deposit order.
 * Since no webhook is used, this server action calls Dodo Payments API
 * directly to check the payment status and credit the balance if succeeded.
 */
export async function checkDepositStatus(depositId: string): Promise<DepositStatusResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      status: 'unauthorized',
      error: 'You must be signed in to check deposit status.',
    };
  }

  if (!depositId || typeof depositId !== 'string') {
    return {
      success: false,
      status: 'invalid_id',
      error: 'A valid deposit ID is required.',
    };
  }

  const result: VerifyDepositResult = await verifyAndProcessDeposit({
    depositId,
    expectedUserId: user.id,
  });

  return {
    success: result.success,
    status: result.status,
    depositId: result.deposit?.id ?? depositId,
    amount: result.amount ?? result.deposit?.amount,
    currency: result.currency ?? result.deposit?.currency,
    transactionId: result.transactionId ?? result.deposit?.transactionId,
    error: result.error,
    message: result.message,
    alreadyProcessed: result.alreadyProcessed,
  };
}

export interface DepositPageInput {
  /** 1-based page number. Out-of-range values are clamped. */
  page?: number;
  /** Items per page (1–100). */
  pageSize?: number;
}

export interface DepositsPage {
  items: Deposit[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 10;

/**
 * Server action to retrieve a paginated page of deposits for the signed-in
 * user, newest first. The total count is returned alongside the items so the
 * UI can render pagination controls without a second round-trip.
 */
export async function getUserDepositsPage(
  input: DepositPageInput = {}
): Promise<DepositsPage> {
  const empty: DepositsPage = {
    items: [],
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  };

  const user = await getCurrentUser();
  if (!user) {
    return empty;
  }

  const pageSize = Math.min(Math.max(1, input.pageSize ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const totalItems = await collections.deposits.countDocuments({userId: user.id});
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalItems === 0) {
    return {...empty, pageSize};
  }

  // Clamp the requested page into the valid range (1..totalPages).
  const page = Math.min(Math.max(1, input.page ?? 1), totalPages);
  const docs = await collections.deposits
    .find({userId: user.id})
    .sort({createdAt: -1})
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return {
    items: docs.map((doc) => ({
      id: doc.id,
      userId: doc.userId,
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      gateway: doc.gateway,
      gatewayTransactionId: doc.gatewayTransactionId,
      sessionId: doc.sessionId,
      transactionId: doc.transactionId,
      checkoutUrl: doc.checkoutUrl,
      errorMessage: doc.errorMessage,
      createdAt: doc.createdAt,
      completedAt: doc.completedAt,
    })),
    page,
    pageSize,
    totalItems,
    totalPages,
  };
}

/**
 * Server action to retrieve recent transactions for the signed-in user.
 */
export async function getUserTransactions(limit = 20): Promise<Transaction[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const safeLimit = Math.min(Math.max(1, limit), 100);
  const items = await collections.transactions
    .find({userId: user.id})
    .sort({createdAt: -1})
    .limit(safeLimit)
    .toArray();

  return items.map((doc) => ({
    id: doc.id,
    userId: doc.userId,
    type: doc.type,
    amount: doc.amount,
    createdAt: doc.createdAt,
  }));
}
