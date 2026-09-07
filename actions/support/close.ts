'use server';

import {revalidatePath} from 'next/cache';

import {collections} from '@/lib/db';
import {getCurrentUser} from '@/actions/auth/session';
import type {SupportMutationResult} from './comments';

/**
 * Closes one of the signed-in user's own tickets. Once closed, no further
 * comments can be added (by user or admin). Closing an already-closed ticket
 * is a no-op success so the UI stays race-safe.
 */
export async function closeSupportTicket(ticketId: string): Promise<SupportMutationResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {success: false, error: 'You must be signed in.'};
  }

  const ticket = await collections.supportTickets.findOne({id: ticketId, userId: user.id});
  if (!ticket) {
    return {success: false, error: 'Ticket not found.'};
  }
  if (ticket.status === 'closed') {
    return {success: true};
  }

  const now = new Date().toISOString();
  await collections.supportTickets.updateOne(
    {id: ticketId},
    {$set: {status: 'closed', closedAt: now, closedBy: 'user', updatedAt: now}}
  );

  revalidatePath('/user/support');
  revalidatePath(`/user/support/${ticketId}`);

  return {success: true};
}
