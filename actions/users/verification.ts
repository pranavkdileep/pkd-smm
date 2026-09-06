'use server';

import {start} from 'workflow/api';
import {getCurrentUser} from '@/actions/auth/session';
import {handleUserSignup} from '@/workflows/user-signup';

export type ResendVerificationResult = {success: true} | {success: false; error: string};

/**
 * Re-sends the email-verification message to the signed-in user's address.
 *
 * Reuses the signup verification pipeline: a fresh 24h JWT token is generated
 * (its expiry lives inside the token) and stored on the user document —
 * which replaces any previous token and invalidates old links — then the
 * email is sent in the background via the workflow runtime.
 *
 * Every request verifies the session JWT before enqueuing the workflow.
 */
export async function resendEmailVerification(): Promise<ResendVerificationResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {success: false, error: 'Sign-in required.'};
  }

  if (user.emailVerified) {
    return {success: false, error: 'Your email is already verified.'};
  }

  // Same pipeline as signup: generate token → store on user → send email.
  // `start` enqueues the run and returns immediately, so the action never
  // blocks on the email provider.
  await start(handleUserSignup, [{id: user.id, username: user.username, email: user.email}]);

  return {success: true};
}
