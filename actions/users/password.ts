'use server';

import {collections} from '@/lib/db';
import {getCurrentUser} from '@/actions/auth/session';
import {hashPassword, verifyPassword} from '@/actions/auth/password';

export type ChangePasswordResult = {success: true} | {success: false; error: string};

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

const MIN_PASSWORD_LENGTH = 8; // Matches the signup rule.

/**
 * Changes the signed-in user's password using the current password as proof
 * of ownership — no email/reset-token flow involved.
 *
 * Every request verifies the session JWT before touching the database.
 */
export async function changePassword(input: ChangePasswordInput): Promise<ChangePasswordResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {success: false, error: 'Sign-in required.'};
  }

  const {currentPassword, newPassword} = input;

  if (!currentPassword) {
    return {success: false, error: 'Enter your current password.'};
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {success: false, error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`};
  }

  // The current password is the only proof of ownership — verify it against
  // the stored scrypt hash before accepting the new one.
  const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isCurrentValid) {
    return {success: false, error: 'Incorrect current password.'};
  }

  if (currentPassword === newPassword) {
    return {success: false, error: 'New password must be different from your current password.'};
  }

  const passwordHash = await hashPassword(newPassword);
  const result = await collections.users.updateOne({id: user.id}, {$set: {passwordHash}});
  if (result.matchedCount === 0) {
    return {success: false, error: 'Account not found.'};
  }

  return {success: true};
}
