'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

import {login} from '@/actions/auth/login';

/**
 * Shared submit flow for every sign-in form (login page, hero card):
 * call the unified login action, route admins to /admin and users to /user.
 */
export function useLogin(initialError: string | null = null) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, setIsPending] = useState(false);

  async function submit(identifier: string, password: string) {
    setError(null);
    setIsPending(true);
    try {
      const result = await login({username: identifier, password});

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(result.role === 'admin' ? '/admin' : '/user');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  return {error, isPending, submit};
}
