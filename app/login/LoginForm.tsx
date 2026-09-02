'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {TextInput} from '@astryxdesign/core/TextInput';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {Banner} from '@astryxdesign/core/Banner';
import Link from 'next/link';

import {loginAdmin, loginUser} from '@/actions/auth/login';

const SEARCH_PARAM_ERRORS: Record<string, string> = {
  unauthenticated: 'Please sign in to continue.',
  forbidden: 'This area is for admins only.',
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(SEARCH_PARAM_ERRORS[searchParams.get('error') ?? ''] ?? null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsPending(true);
    try {
      const result =
        role === 'admin'
          ? await loginAdmin({username: identifier, password})
          : await loginUser({username: identifier, password});

      if (!result.success) {
        setError(result.error);
        return;
      }

      if (role === 'admin') {
        router.push('/admin');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  if (success) {
    return (
      <Card padding={6} elevation="low" maxWidth={420}>
        <VStack gap={4} align="center">
          <Heading level={2}>Signed in</Heading>
          <Banner status="success" title="Login successful" description={`Welcome back, ${identifier}. Your dashboard is coming soon.`} />
          <Text size="sm" color="secondary">
            You are signed in as a regular user.
          </Text>
        </VStack>
      </Card>
    );
  }

  return (
    <Card padding={6} elevation="low" maxWidth={420}>
      <VStack gap={4}>
        <VStack gap={1} align="center">
          <Heading level={2}>{role === 'admin' ? 'Admin sign in' : 'Sign in'}</Heading>
          <Text color="secondary">
            {role === 'admin'
              ? 'Restricted access for panel administrators.'
              : 'Access your PKD-SMM Panel account.'}
          </Text>
        </VStack>

        <SegmentedControl
          label="Account type"
          value={role}
          onChange={(value) => {
            setRole(value as 'user' | 'admin');
            setError(null);
          }}
          layout="fill"
        >
          <SegmentedControlItem value="user" label="User" />
          <SegmentedControlItem value="admin" label="Admin" />
        </SegmentedControl>

        {error ? <Banner status="error" title={error} /> : null}

        <form onSubmit={handleSubmit}>
          <VStack gap={3}>
            <TextInput
              label={role === 'admin' ? 'Username' : 'Username or email'}
              value={identifier}
              onChange={setIdentifier}
              placeholder={role === 'admin' ? 'admin username' : 'you@example.com'}
              htmlName="username"
              isRequired
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              htmlName="password"
              isRequired
            />
            <Button
              label={isPending ? 'Signing in…' : 'Sign in'}
              variant="primary"
              width="100%"
              type="submit"
              isDisabled={isPending}
              isLoading={isPending}
            />
          </VStack>
        </form>

        <HStack gap={1} justify="center">
          <Text size="sm" color="secondary">
            New here?
          </Text>
          <Link href="/signup" className="text-sm font-medium text-blue-vivid hover:underline">
            Create a free account
          </Link>
        </HStack>
      </VStack>
    </Card>
  );
}
