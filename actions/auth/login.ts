'use server';

import {randomUUID} from 'node:crypto';
import {headers} from 'next/headers';

import {collections} from '@/lib/db';
import {verifyPassword} from './password';
import {createSession} from './session';
import type {SessionRole} from './jwt';

interface LoginInput {
  username: string;
  password: string;
}

export type LoginResult =
  | {success: true; role: SessionRole}
  | {success: false; error: string};

/**
 * Unified login. The role (user vs admin) is detected automatically on the
 * server: the admin collection is checked first, then the user collection.
 * The client never needs to pick a role.
 */
export async function login(input: LoginInput): Promise<LoginResult> {
  const identifier = input.username.trim();

  const admin = await collections.adminUsers.findOne({username: identifier});
  if (admin && (await verifyPassword(input.password, admin.passwordHash))) {
    await createSession({userId: admin.id, username: admin.username, role: 'admin'});
    return {success: true, role: 'admin'};
  }

  const user = await collections.users.findOne({
    $or: [{username: identifier}, {email: identifier.toLowerCase()}],
  });
  if (user && (await verifyPassword(input.password, user.passwordHash))) {
    await createSession({userId: user.id, username: user.username, role: 'user'});

    // ponytail: login_events grows unbounded — add a TTL index (e.g. 90 days)
    // when the collection gets large.
    const headerList = await headers();
    await collections.loginEvents.insertOne({
      id: randomUUID(),
      userId: user.id,
      ip: headerList.get('x-forwarded-for')?.split(',')[0].trim() || undefined,
      userAgent: headerList.get('user-agent') || undefined,
      createdAt: new Date().toISOString(),
    });
    return {success: true, role: 'user'};
  }

  return {success: false, error: 'Invalid credentials.'};
}
