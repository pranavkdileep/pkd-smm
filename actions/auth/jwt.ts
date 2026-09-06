import {SignJWT, jwtVerify} from 'jose';

export type SessionRole = 'user' | 'admin';

export interface SessionPayload {
  userId: string;
  username: string;
  role: SessionRole;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export const SESSION_COOKIE = 'pkd_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Add it to .env.local');
}

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({username: payload.username, role: payload.role})
    .setProtectedHeader({alg: 'HS256'})
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const {payload} = await jwtVerify(token, secretKey);
    const {sub, username, role} = payload;
    if (
      typeof sub !== 'string' ||
      typeof username !== 'string' ||
      (role !== 'user' && role !== 'admin')
    ) {
      return null;
    }
    return {userId: sub, username, role};
  } catch {
    return null;
  }
}

export const EMAIL_VERIFICATION_MAX_AGE = 60 * 60 * 24; // 24 hours

export interface EmailVerificationPayload {
  userId: string;
  email: string;
}

const EMAIL_VERIFICATION_PURPOSE = 'email-verification';

/**
 * Signs the email-verification JWT stored on the user document. The
 * expiration travels inside the token itself, so no separate expiry field
 * is needed on the user.
 */
export async function signEmailVerificationToken(payload: EmailVerificationPayload): Promise<string> {
  return new SignJWT({email: payload.email, purpose: EMAIL_VERIFICATION_PURPOSE})
    .setProtectedHeader({alg: 'HS256'})
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${EMAIL_VERIFICATION_MAX_AGE}s`)
    .sign(secretKey);
}

export async function verifyEmailVerificationToken(token: string): Promise<EmailVerificationPayload | null> {
  try {
    const {payload} = await jwtVerify(token, secretKey);
    const {sub, email, purpose} = payload;
    if (typeof sub !== 'string' || typeof email !== 'string' || purpose !== EMAIL_VERIFICATION_PURPOSE) {
      return null;
    }
    return {userId: sub, email};
  } catch {
    return null;
  }
}
