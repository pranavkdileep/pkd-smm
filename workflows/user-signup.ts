import {
  generateEmailVerificationToken,
  sendVerificationEmail,
  storeEmailVerificationToken,
  type SignupUser,
} from './user-signup-steps';

/**
 * Post-signup email-verification pipeline.
 *
 * The user document itself is created synchronously by the signup server
 * action (so duplicate username/email errors are immediate). This workflow
 * then runs in the background:
 *   1. generates a JWT email-verification token (expiry lives in the token),
 *   2. persists it on the user document,
 *   3. sends the verification email (mock sender for now).
 */
export async function handleUserSignup(user: SignupUser) {
  'use workflow';

  const emailVerificationToken = await generateEmailVerificationToken(user);
  await storeEmailVerificationToken(user.id, emailVerificationToken);
  await sendVerificationEmail(user, emailVerificationToken);

  return {userId: user.id, status: 'verification_email_sent' as const};
}
