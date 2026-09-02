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
