'use server';

import {collections} from '@/lib/db';
import type {
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from '@/lib/database';
import {getCurrentUser} from '@/actions/auth/session';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/** Sanitized ticket row for the user support UI — never exposes the owner id. */
export interface SupportTicketRow extends Record<string, unknown> {
  id: string;
  title: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  /** ISO date string, or null while the ticket is open. */
  closedAt: string | null;
}

export interface ListSupportTicketsResult {
  tickets: SupportTicketRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupportCommentRow {
  id: string;
  authorType: 'user' | 'admin';
  message: string;
  createdAt: string;
}

export interface SupportTicketDetailResult {
  ticket: SupportTicketRow;
  comments: SupportCommentRow[];
  totalComments: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

function toTicketRow(ticket: SupportTicket): SupportTicketRow {
  return {
    id: ticket.id,
    title: ticket.title,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    closedAt: ticket.closedAt ?? null,
  };
}

/**
 * Lists the signed-in user's support tickets, most recently active first.
 * Returns an empty result when unauthenticated (the layout redirects to /login).
 */
export async function listSupportTickets(input: {
  page?: number;
  pageSize?: number;
}): Promise<ListSupportTicketsResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {tickets: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 1};
  }

  const filter = {userId: user.id};
  const pageSize = clampPageSize(input.pageSize);

  const total = await collections.supportTickets.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const tickets = await collections.supportTickets
    .find(filter, {
      sort: {updatedAt: -1, createdAt: -1},
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  return {
    tickets: tickets.map(toTicketRow),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Loads one of the signed-in user's tickets plus a page of its conversation.
 * Comments are ordered oldest first so the thread reads top to bottom.
 * Returns null when the ticket does not exist or belongs to another user.
 */
export async function getSupportTicketDetail(
  ticketId: string,
  input: {page?: number; pageSize?: number}
): Promise<SupportTicketDetailResult | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const ticket = await collections.supportTickets.findOne({id: ticketId, userId: user.id});
  if (!ticket) {
    return null;
  }

  const filter = {ticketId};
  const pageSize = clampPageSize(input.pageSize);

  const totalComments = await collections.supportTicketComments.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalComments / pageSize));
  const page = clampPage(input.page, totalPages);

  const comments = await collections.supportTicketComments
    .find(filter, {
      sort: {createdAt: 1, id: 1},
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  return {
    ticket: toTicketRow(ticket),
    comments: comments.map((comment) => ({
      id: comment.id,
      authorType: comment.authorType,
      message: comment.message,
      createdAt: comment.createdAt,
    })),
    totalComments,
    page,
    pageSize,
    totalPages,
  };
}
