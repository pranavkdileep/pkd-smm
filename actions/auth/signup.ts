'use server';

import {randomUUID} from 'node:crypto';
import {start} from 'workflow/api';
import {collections} from '@/lib/db';
import {handleUserSignup} from '@/workflows/user-signup';
import {hashPassword} from './password';
import {createSession} from './session';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export async function signupUser(input: SignupInput): Promise<{success: true} | {success: false; error: string}> {
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!USERNAME_PATTERN.test(username)) {
    return {success: false, error: 'Username must be 3-30 characters (letters, numbers, underscore).'};
  }
  if (!EMAIL_PATTERN.test(email)) {
    return {success: false, error: 'Please enter a valid email address.'};
  }
  if (password.length < 8) {
    return {success: false, error: 'Password must be at least 8 characters.'};
  }

  const existing = await collections.users.findOne({
    $or: [{username}, {email}],
  });
  if (existing) {
    return {
      success: false,
      error: existing.username === username ? 'Username is already taken.' : 'Email is already registered.',
    };
  }

  const passwordHash = await hashPassword(password);
  const userId = randomUUID();
  await collections.users.insertOne({
    id: userId,
    username,
    email,
    emailVerified: false,
    passwordHash,
    balance: 0,
    language: 'en',
    status: 'active',
    createdAt: new Date().toISOString(),
  });

  // Kick off the email-verification pipeline in the background. `start`
  // enqueues the workflow run and returns immediately, so it never blocks
  // signup or the session cookie below.
  await start(handleUserSignup, [{id: userId, username, email}]);

  await createSession({userId, username, role: 'user'});
  return {success: true};
}
