'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Banner} from '@astryxdesign/core/Banner';
import {PasswordInput} from '@/app/components/forms/PasswordInput';
import Link from 'next/link';
import {siteConfig} from '@/lib/config';

import {useLogin} from './useLogin';

const SEARCH_PARAM_ERRORS: Record<string, string> = {
  unauthenticated: 'Please sign in to continue.',
  forbidden: 'This area is for admins only.',
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const {error, isPending, submit} = useLogin(SEARCH_PARAM_ERRORS[searchParams.get('error') ?? ''] ?? null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(identifier, password);
  }

  return (
    <Card padding={6} elevation="low" maxWidth={420}>
      <VStack gap={4}>
        <VStack gap={1} align="center">
          <Heading level={2}>Sign in</Heading>
          <Text color="secondary">Access your {siteConfig.name} account.</Text>
        </VStack>

        {error ? <Banner status="error" title={error} /> : null}

        <form onSubmit={handleSubmit}>
          <VStack gap={3}>
            <TextInput
              label="Username or email"
              value={identifier}
              onChange={setIdentifier}
              placeholder="you@example.com"
              htmlName="username"
              isRequired
            />
            <PasswordInput
              label="Password"
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
