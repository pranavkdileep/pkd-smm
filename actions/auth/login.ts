'use server';

import {collections} from '@/lib/db';
import {verifyPassword} from './password';
import {createSession} from './session';

interface LoginInput {
  username: string;
  password: string;
}

export async function loginUser(input: LoginInput): Promise<{success: true} | {success: false; error: string}> {
  const identifier = input.username.trim();
  const user = await collections.users.findOne({
    $or: [{username: identifier}, {email: identifier.toLowerCase()}],
  });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    return {success: false, error: 'Invalid credentials.'};
  }

  await createSession({userId: user.id, username: user.username, role: 'user'});
  return {success: true};
}

export async function loginAdmin(input: LoginInput): Promise<{success: true} | {success: false; error: string}> {
  const username = input.username.trim();
  const admin = await collections.adminUsers.findOne({username});

  if (!admin || !(await verifyPassword(input.password, admin.passwordHash))) {
    return {success: false, error: 'Invalid admin credentials.'};
  }

  await createSession({userId: admin.id, username: admin.username, role: 'admin'});
  return {success: true};
}
