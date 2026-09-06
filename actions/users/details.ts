'use server';

import type {Language, UserStatus} from '@/lib/database';
import {getCurrentUser} from '@/actions/auth/session';

/**
 * Sanitized account details for the settings UI.
 * Never contains the password hash or verification/reset tokens.
 */
export interface UserDetails {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  balance: number;
  language: Language;
  status: UserStatus;
  createdAt: string | null;
}

/**
 * Returns the signed-in user's account details.
 *
 * Every request verifies the session JWT (via `getCurrentUser`, which checks
 * the token signature, the `user` role, and that the user still exists).
 * Returns `null` when unauthenticated so callers can redirect to /login.
 */
export async function getUserDetails(): Promise<UserDetails | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    balance: user.balance,
    language: user.language,
    status: user.status ?? 'active',
    createdAt: user.createdAt ?? null,
  };
}
