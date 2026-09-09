'use server';

import {collections} from '@/lib/db';
import {TransactionTypes, type Transaction, type TransactionType} from '@/lib/database';
import {getSession} from '@/actions/auth/session';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/** Transaction row for the admin ledger, with the owner's username resolved. */
export interface AdminTransactionRow extends Record<string, unknown> {
  id: string;
  username: string;
  type: TransactionType;
  amount: number;
  note: string | null;
  createdAt: string;
}

export interface ListAdminTransactionsResult {
  transactions: AdminTransactionRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

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

/** Filter by type plus a search that matches transaction ids or usernames. */
async function buildFilter(input: {
  search?: string;
  type?: string;
}): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};

  if (input.type && (TransactionTypes as readonly string[]).includes(input.type)) {
    filter.type = input.type;
  }

  const search = (input.search ?? '').trim();
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    const matchingUsers = await collections.users
      .find({username: pattern}, {projection: {id: 1}})
      .toArray();
    filter.$or = [{id: pattern}, {userId: {$in: matchingUsers.map((user) => user.id)}}];
  }

  return filter;
}

/**
 * Lists the full financial ledger across users, newest first — the admin
 * audit trail. Searching a username narrows it to that user's ledger.
 * Empty result for non-admins.
 */
export async function listAdminTransactions(input: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
}): Promise<ListAdminTransactionsResult> {
  if (!(await isAdmin())) {
    return {transactions: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 1};
  }

  const filter = await buildFilter(input);
  const pageSize = clampPageSize(input.pageSize);

  const total = await collections.transactions.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const transactions = await collections.transactions
    .find(filter, {
      sort: {createdAt: -1, id: -1},
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  const userIds = [...new Set(transactions.map((tx) => tx.userId))];
  const users = userIds.length
    ? await collections.users.find({id: {$in: userIds}}, {projection: {id: 1, username: 1}}).toArray()
    : [];
  const usernameById = new Map(users.map((user) => [user.id, user.username]));

  return {
    transactions: transactions.map((tx: Transaction) => ({
      id: tx.id,
      username: usernameById.get(tx.userId) ?? 'Deleted user',
      type: tx.type,
      amount: tx.amount,
      note: tx.note ?? null,
      createdAt: tx.createdAt,
    })),
    total,
    page,
    pageSize,
    totalPages,
  };
}
