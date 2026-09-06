import {collections} from '@/lib/db';
import {signEmailVerificationToken} from '@/actions/auth/jwt';
import {sendEmail} from '@/lib/email';

/** Serializable subset of the user document the signup workflow needs. */
export interface SignupUser {
  id: string;
  username: string;
  email: string;
}

export async function generateEmailVerificationToken(user: SignupUser): Promise<string> {
  'use step';

  // The expiry (24h) is baked into the JWT itself.
  return signEmailVerificationToken({userId: user.id, email: user.email});
}

export async function storeEmailVerificationToken(userId: string, token: string): Promise<void> {
  'use step';

  await collections.users.updateOne({id: userId}, {$set: {emailVerificationToken: token}});
}

export async function sendVerificationEmail(user: SignupUser, token: string): Promise<void> {
  'use step';

  // Steps run outside a request, so the app URL comes from the environment.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const verificationUrl = `${appUrl}/api/verify-email?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: user.email,
    subject: 'Verify your PKD-SMM Panel account',
    body: [
      `Hi ${user.username},`,
      '',
      'Welcome to PKD-SMM Panel! Verify your email address by opening the link below:',
      '',
      verificationUrl,
      '',
      'Or use this token directly:',
      token,
      '',
      'This link expires in 24 hours.',
    ].join('\n'),
  });
}
