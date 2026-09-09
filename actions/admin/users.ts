'use server';

import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';

import {collections} from '@/lib/db';
import type {Transaction, User, UserStatus} from '@/lib/database';
import {getSession} from '@/actions/auth/session';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/** Sanitized user row sent to the admin UI — never contains the password hash. */
export interface AdminUserRow extends Record<string, unknown> {
  id: string;
  username: string;
  email: string;
  language: string;
  status: UserStatus;
  balance: number;
  createdAt: string | null;
}

export interface ListUsersResult {
  users: AdminUserRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type MutationResult = {success: true} | {success: false; error: string};

async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === 'admin';
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFilter(search: string): Record<string, unknown> {
  const trimmed = search.trim();
  if (!trimmed) {
    return {};
  }
  const pattern = new RegExp(escapeRegex(trimmed), 'i');
  return {$or: [{username: pattern}, {email: pattern}]};
}

function clampPage(value: number | undefined, totalPages: number): number {
  if (!Number.isFinite(value) || (value ?? 1) < 1) {
    return 1;
  }
  return Math.min(value as number, totalPages);
}

function clampPageSize(value: number | undefined): number {
  if (!Number.isFinite(value) || (value ?? 0) < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(value as number, MAX_PAGE_SIZE);
}

function toRow(user: User): AdminUserRow {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    language: user.language,
    status: user.status ?? 'active',
    balance: user.balance ?? 0,
    createdAt: user.createdAt ?? null,
  };
}

export async function listUsers(input: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ListUsersResult> {
  const filter = buildFilter(input.search ?? '');
  const pageSize = clampPageSize(input.pageSize);

  const total = await collections.users.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const users = await collections.users
    .find(filter, {
      sort: {createdAt: -1, username: 1},
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  return {
    users: users.map(toRow),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function setUserStatus(userId: string, status: UserStatus): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Admin session required.'};
  }
  if (status !== 'active' && status !== 'banned') {
    return {success: false, error: 'Invalid status.'};
  }

  const result = await collections.users.updateOne({id: userId}, {$set: {status}});
  if (result.matchedCount === 0) {
    return {success: false, error: 'User not found.'};
  }

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  return {success: true};
}

const REASON_MAX_LENGTH = 200;

/**
 * Manually credits (positive amount) or debits (negative amount) a user's
 * balance, recording an 'adjustment' transaction with the admin's reason.
 * Debits are atomic — the balance guard makes an overdraw fail cleanly.
 */
export async function adjustUserBalance(
  userId: string,
  amount: number,
  reason: string,
): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Admin session required.'};
  }

  // Round to the paisa, same convention as order pricing.
  const rounded = Math.round(amount * 100) / 100;
  if (!Number.isFinite(rounded) || rounded === 0) {
    return {success: false, error: 'Enter a non-zero amount.'};
  }
  const note = (reason ?? '').trim();
  if (!note) {
    return {success: false, error: 'A reason is required.'};
  }
  if (note.length > REASON_MAX_LENGTH) {
    return {success: false, error: `Reason must be ${REASON_MAX_LENGTH} characters or fewer.`};
  }

  const updated = await collections.users.findOneAndUpdate(
    rounded < 0 ? {id: userId, balance: {$gte: -rounded}} : {id: userId},
    {$inc: {balance: rounded}},
  );
  if (!updated) {
    return {
      success: false,
      error:
        rounded < 0
          ? 'User not found or balance is too low for this debit.'
          : 'User not found.',
    };
  }

  // ponytail: balance update + ledger insert are not one Mongo transaction; a
  // crash between them can move balance without a ledger line. Reconcile
  // manually, or wrap in a session/transaction when money paths demand it.
  const transaction: Transaction = {
    id: randomUUID(),
    userId,
    type: 'adjustment',
    amount: rounded,
    note,
    createdAt: new Date().toISOString(),
  };
  await collections.transactions.insertOne(transaction);

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  return {success: true};
}

export async function deleteUser(userId: string): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Admin session required.'};
  }

  const result = await collections.users.deleteOne({id: userId});
  if (result.deletedCount === 0) {
    return {success: false, error: 'User not found.'};
  }

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  return {success: true};
}