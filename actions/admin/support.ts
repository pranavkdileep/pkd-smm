'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';

import { collections } from '@/lib/db';
import {
  SUPPORT_TICKET_CATEGORIES,
  SUPPORT_TICKET_PRIORITIES,
  type SupportTicket,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from '@/lib/database';
import { getSession } from '@/actions/auth/session';
import type { SupportMutationResult } from '@/actions/support/comments';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MESSAGE_MAX_LENGTH = 5000; // Mirrors the user-side limit in actions/support/comments.ts.

/** Ticket row for the admin support list, with the requester resolved. */
export interface AdminSupportTicketRow extends Record<string, unknown> {
  id: string;
  title: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  requesterUsername: string;
  requesterEmail: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  /** Who closed the ticket  null while open. */
  closedBy: 'user' | 'admin' | null;
}

export interface ListAdminSupportTicketsResult {
  tickets: AdminSupportTicketRow[];
  total: number;
  openCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminSupportCommentRow {
  id: string;
  authorType: 'user' | 'admin';
  /** Resolved author name  the customer's or the staff member's username. */
  authorName: string;
  message: string;
  createdAt: string;
}

export interface AdminSupportTicketDetailResult {
  ticket: AdminSupportTicketRow;
  comments: AdminSupportCommentRow[];
  totalComments: number;
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

/**
 * Builds the admin list filter. Search matches ticket titles and requester
 * usernames; status, category, and priority are exact matches.
 */
async function buildTicketFilter(input: {
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
}): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};

  if (input.status === 'open' || input.status === 'closed') {
    filter.status = input.status;
  }
  if (input.category && (SUPPORT_TICKET_CATEGORIES as readonly string[]).includes(input.category)) {
    filter.category = input.category;
  }
  if (input.priority && (SUPPORT_TICKET_PRIORITIES as readonly string[]).includes(input.priority)) {
    filter.priority = input.priority;
  }

  const search = (input.search ?? '').trim();
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    const matchingUsers = await collections.users
      .find({ username: pattern }, { projection: { id: 1 } })
      .toArray();
    filter.$or = [{ title: pattern }, { userId: { $in: matchingUsers.map((user) => user.id) } }];
  }

  return filter;
}

/** Resolves requester identity for a page of tickets in one query. */
async function attachRequesters(tickets: SupportTicket[]): Promise<AdminSupportTicketRow[]> {
  const userIds = [...new Set(tickets.map((ticket) => ticket.userId))];
  const users = userIds.length
    ? await collections.users
      .find({ id: { $in: userIds } }, { projection: { id: 1, username: 1, email: 1 } })
      .toArray()
    : [];
  const usersById = new Map(users.map((user) => [user.id, user]));

  return tickets.map((ticket) => {
    const requester = usersById.get(ticket.userId);
    return {
      id: ticket.id,
      title: ticket.title,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      requesterUsername: requester?.username ?? 'Deleted user',
      requesterEmail: requester?.email ?? '',
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      closedAt: ticket.closedAt ?? null,
      closedBy: ticket.closedBy ?? null,
    };
  });
}

/**
 * Lists all support tickets for the admin desk, most recently active first.
 * Returns an empty result when the session is not an admin.
 */
export async function listAdminSupportTickets(input: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
}): Promise<ListAdminSupportTicketsResult> {
  if (!(await isAdmin())) {
    return {
      tickets: [],
      total: 0,
      openCount: 0,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      totalPages: 1,
    };
  }

  const filter = await buildTicketFilter(input);
  const pageSize = clampPageSize(input.pageSize);

  const [total, openCount] = await Promise.all([
    collections.supportTickets.countDocuments(filter),
    collections.supportTickets.countDocuments({ ...filter, status: 'open' }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const tickets = await collections.supportTickets
    .find(filter, {
      sort: { updatedAt: -1, createdAt: -1 },
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  return {
    tickets: await attachRequesters(tickets),
    total,
    openCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Loads any ticket (no owner scoping on the admin side) plus a page of its
 * conversation, oldest first. Staff replies carry the staff member's username.
 * Returns null when the ticket does not exist.
 */
export async function getAdminSupportTicketDetail(
  ticketId: string,
  input: { page?: number; pageSize?: number }
): Promise<AdminSupportTicketDetailResult | null> {
  if (!(await isAdmin())) {
    return null;
  }

  const ticket = await collections.supportTickets.findOne({ id: ticketId });
  if (!ticket) {
    return null;
  }

  const filter = { ticketId };
  const pageSize = clampPageSize(input.pageSize);

  const totalComments = await collections.supportTicketComments.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalComments / pageSize));
  const page = clampPage(input.page, totalPages);

  const comments = await collections.supportTicketComments
    .find(filter, {
      sort: { createdAt: 1, id: 1 },
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  // Resolve staff usernames for admin replies in one query.
  const adminAuthorIds = [
    ...new Set(comments.filter((c) => c.authorType === 'admin').map((c) => c.authorId)),
  ];
  const admins = adminAuthorIds.length
    ? await collections.adminUsers
      .find({ id: { $in: adminAuthorIds } }, { projection: { id: 1, username: 1 } })
      .toArray()
    : [];
  const adminsById = new Map(admins.map((admin) => [admin.id, admin]));

  const [ticketRow] = await attachRequesters([ticket]);
  const requesterUsername = ticketRow.requesterUsername;

  return {
    ticket: ticketRow,
    comments: comments.map((comment) => ({
      id: comment.id,
      authorType: comment.authorType,
      authorName:
        comment.authorType === 'admin'
          ? adminsById.get(comment.authorId)?.username ?? 'Staff'
          : requesterUsername,
      message: comment.message,
      createdAt: comment.createdAt,
    })),
    totalComments,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Adds a staff reply to a ticket. Open tickets accept any number of comments;
 * closed tickets are locked for both sides.
 */
export async function addAdminSupportTicketComment(
  ticketId: string,
  message: string
): Promise<SupportMutationResult> {
  const session = await getSession();
  if (session?.role !== 'admin') {
    return { success: false, error: 'Admin session required.' };
  }

  const trimmed = (message ?? '').trim();
  if (!trimmed) {
    return { success: false, error: 'Write a message before sending.' };
  }
  if (trimmed.length > MESSAGE_MAX_LENGTH) {
    return { success: false, error: `Replies must be ${MESSAGE_MAX_LENGTH} characters or fewer.` };
  }

  const ticket = await collections.supportTickets.findOne({ id: ticketId });
  if (!ticket) {
    return { success: false, error: 'Ticket not found.' };
  }
  if (ticket.status === 'closed') {
    return { success: false, error: 'This ticket is closed and locked.' };
  }

  const now = new Date().toISOString();

  await collections.supportTicketComments.insertOne({
    id: randomUUID(),
    ticketId,
    authorType: 'admin',
    authorId: session.userId,
    message: trimmed,
    createdAt: now,
  });
  await collections.supportTickets.updateOne({ id: ticketId }, { $set: { updatedAt: now } });

  revalidatePath('/admin/support');
  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath('/user/support');
  revalidatePath(`/user/support/${ticketId}`);

  return { success: true };
}

/**
 * Closes a ticket as staff. Once closed, no further comments can be added by
 * either side. Closing an already-closed ticket is a no-op success.
 */
export async function closeAdminSupportTicket(ticketId: string): Promise<SupportMutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }

  const ticket = await collections.supportTickets.findOne({ id: ticketId });
  if (!ticket) {
    return { success: false, error: 'Ticket not found.' };
  }
  if (ticket.status === 'closed') {
    return { success: true };
  }

  const now = new Date().toISOString();
  await collections.supportTickets.updateOne(
    { id: ticketId },
    { $set: { status: 'closed', closedAt: now, closedBy: 'admin', updatedAt: now } }
  );

  revalidatePath('/admin/support');
  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath('/user/support');
  revalidatePath(`/user/support/${ticketId}`);

  return { success: true };
}

