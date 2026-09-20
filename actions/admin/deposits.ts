'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';

import { collections } from '@/lib/db';
import { DEPOSIT_STATUSES, type Deposit, type DepositStatus, type Transaction } from '@/lib/database';
import { getSession } from '@/actions/auth/session';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/** Deposit row for the admin list, with the owner's username resolved. */
export interface AdminDepositRow extends Record<string, unknown> {
  id: string;
  username: string;
  amount: number;
  currency: string;
  status: DepositStatus;
  gateway: string;
  sessionId: string | null;
  gatewayTransactionId: string | null;
  checkoutUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface ListAdminDepositsResult {
  deposits: AdminDepositRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type MutationResult = { success: true } | { success: false; error: string };

async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === 'admin';
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clampPageSize(value: number | undefined): number {
  if (!Number.isFinite(value) || (value ?? 0) < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(value as number, MAX_PAGE_SIZE);
}

function clampPage(value: number | undefined, totalPages: number): number {
  if (!Number.isFinite(value) || (value ?? 1) < 1) {
    return 1;
  }
  return Math.min(value as number, totalPages);
}

/** Filter by status plus a search that matches deposit ids or usernames. */
async function buildFilter(input: {
  search?: string;
  status?: string;
}): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};

  if (input.status && (DEPOSIT_STATUSES as readonly string[]).includes(input.status)) {
    filter.status = input.status;
  }

  const search = (input.search ?? '').trim();
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    const matchingUsers = await collections.users
      .find({ username: pattern }, { projection: { id: 1 } })
      .toArray();
    filter.$or = [
      { id: pattern },
      { gatewayTransactionId: pattern },
      { userId: { $in: matchingUsers.map((user) => user.id) } },
    ];
  }

  return filter;
}

function toRows(deposits: Deposit[], usernameById: Map<string, string>): AdminDepositRow[] {
  return deposits.map((deposit) => ({
    id: deposit.id,
    username: usernameById.get(deposit.userId) ?? 'Deleted user',
    amount: deposit.amount,
    currency: deposit.currency,
    status: deposit.status,
    gateway: deposit.gateway,
    sessionId: deposit.sessionId ?? null,
    gatewayTransactionId: deposit.gatewayTransactionId ?? null,
    checkoutUrl: deposit.checkoutUrl ?? null,
    errorMessage: deposit.errorMessage ?? null,
    createdAt: deposit.createdAt,
    completedAt: deposit.completedAt ?? null,
  }));
}

/** Lists all deposits across users, newest first. Empty result for non-admins. */
export async function listAdminDeposits(input: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<ListAdminDepositsResult> {
  if (!(await isAdmin())) {
    return { deposits: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 1 };
  }

  const filter = await buildFilter(input);
  const pageSize = clampPageSize(input.pageSize);

  const total = await collections.deposits.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const deposits = await collections.deposits
    .find(filter, {
      sort: { createdAt: -1, id: -1 },
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  const userIds = [...new Set(deposits.map((deposit) => deposit.userId))];
  const users = userIds.length
    ? await collections.users.find({ id: { $in: userIds } }, { projection: { id: 1, username: 1 } }).toArray()
    : [];
  const usernameById = new Map(users.map((user) => [user.id, user.username]));

  return { deposits: toRows(deposits, usernameById), total, page, pageSize, totalPages };
}

/**
 * Manually approves a deposit  the support-case path for payments verified
 * outside the gateway. Marks it completed, credits the balance, and writes the
 * 'deposit' ledger entry. The atomic status guard prevents double-crediting.
 */
export async function approveAdminDeposit(depositId: string): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }

  const transactionId = randomUUID();
  const completedAt = new Date().toISOString();

  const approved = await collections.deposits.findOneAndUpdate(
    { id: depositId, status: { $ne: 'completed' } },
    { $set: { status: 'completed', transactionId, completedAt } },
  );
  if (!approved) {
    return { success: false, error: 'Deposit not found or already completed.' };
  }

  // ponytail: deposit update + credit are not one Mongo transaction; a crash
  // between them can strand a completed deposit without credit. Reconcile
  // manually, or wrap in a session/transaction when money paths demand it.
  const transaction: Transaction = {
    id: transactionId,
    userId: approved.userId,
    type: 'deposit',
    amount: approved.amount,
    note: 'Manual admin approval',
    createdAt: completedAt,
  };
  await collections.transactions.insertOne(transaction);
  await collections.users.updateOne({ id: approved.userId }, { $inc: { balance: approved.amount } });

  revalidatePath('/admin/deposits');
  return { success: true };
}
