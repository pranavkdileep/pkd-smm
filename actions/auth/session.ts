import {cookies} from 'next/headers';
import {collections} from '@/lib/db';
import type {User} from '@/lib/database';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from './jwt';

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session || session.role !== 'user') {
    return null;
  }
  const user = await collections.users.findOne({id: session.userId});
  return user ?? null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
