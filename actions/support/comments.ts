'use server';

import {randomUUID} from 'node:crypto';
import {revalidatePath} from 'next/cache';

import {collections} from '@/lib/db';
import {getCurrentUser} from '@/actions/auth/session';

const MESSAGE_MAX_LENGTH = 5000;

export type SupportMutationResult = {success: true} | {success: false; error: string};

/**
 * Adds the signed-in user's reply to one of their own tickets.
 * Open tickets accept any number of comments; closed tickets are locked.
 */
export async function addSupportTicketComment(
  ticketId: string,
  message: string
): Promise<SupportMutationResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {success: false, error: 'You must be signed in to reply.'};
  }

  const trimmed = (message ?? '').trim();
  if (!trimmed) {
    return {success: false, error: 'Write a message before sending.'};
  }
  if (trimmed.length > MESSAGE_MAX_LENGTH) {
    return {success: false, error: `Replies must be ${MESSAGE_MAX_LENGTH} characters or fewer.`};
  }

  const ticket = await collections.supportTickets.findOne({id: ticketId, userId: user.id});
  if (!ticket) {
    return {success: false, error: 'Ticket not found.'};
  }
  if (ticket.status === 'closed') {
    return {success: false, error: 'This ticket is closed. Open a new ticket if you still need help.'};
  }

  const now = new Date().toISOString();

  await collections.supportTicketComments.insertOne({
    id: randomUUID(),
    ticketId,
    authorType: 'user',
    authorId: user.id,
    message: trimmed,
    createdAt: now,
  });
  await collections.supportTickets.updateOne({id: ticketId}, {$set: {updatedAt: now}});

  revalidatePath('/user/support');
  revalidatePath(`/user/support/${ticketId}`);

  return {success: true};
}
