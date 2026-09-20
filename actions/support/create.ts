'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';

import { collections } from '@/lib/db';
import {
  SUPPORT_TICKET_CATEGORIES,
  SUPPORT_TICKET_PRIORITIES,
  type SupportTicketCategory,
  type SupportTicketPriority,
} from '@/lib/database';
import { getCurrentUser } from '@/actions/auth/session';

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 120;
const MESSAGE_MAX_LENGTH = 5000;

export interface CreateSupportTicketResult {
  success: boolean;
  /** Set on success  the new ticket's id, for redirecting to its conversation. */
  ticketId?: string;
  error?: string;
}

/**
 * Opens a new support ticket: creates the ticket record and its first comment
 * (the opening message) in one go.
 *
 * Banned users may still open tickets  support is the channel they would use
 * to appeal a suspension, so it stays reachable.
 */
export async function createSupportTicket(input: {
  title: string;
  category: string;
  priority: string;
  message: string;
}): Promise<CreateSupportTicketResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'You must be signed in to open a support ticket.' };
  }

  const title = (input.title ?? '').trim();
  const message = (input.message ?? '').trim();

  if (title.length < TITLE_MIN_LENGTH) {
    return { success: false, error: `Give your ticket a title of at least ${TITLE_MIN_LENGTH} characters.` };
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return { success: false, error: `Titles must be ${TITLE_MAX_LENGTH} characters or fewer.` };
  }
  if (!(SUPPORT_TICKET_CATEGORIES as readonly string[]).includes(input.category)) {
    return { success: false, error: 'Choose a valid category.' };
  }
  if (!(SUPPORT_TICKET_PRIORITIES as readonly string[]).includes(input.priority)) {
    return { success: false, error: 'Choose a valid priority.' };
  }
  if (!message) {
    return { success: false, error: 'Describe the issue in the message box.' };
  }
  if (message.length > MESSAGE_MAX_LENGTH) {
    return { success: false, error: `Messages must be ${MESSAGE_MAX_LENGTH} characters or fewer.` };
  }

  const category = input.category as SupportTicketCategory;
  const priority = input.priority as SupportTicketPriority;
  const now = new Date().toISOString();
  const ticketId = randomUUID();

  await collections.supportTickets.insertOne({
    id: ticketId,
    userId: user.id,
    title,
    category,
    priority,
    status: 'open',
    createdAt: now,
    updatedAt: now,
  });

  await collections.supportTicketComments.insertOne({
    id: randomUUID(),
    ticketId,
    authorType: 'user',
    authorId: user.id,
    message,
    createdAt: now,
  });

  revalidatePath('/user/support');

  return { success: true, ticketId };
}
