'use client';

import {useState} from 'react';
import Link from 'next/link';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Banner} from '@astryxdesign/core/Banner';
import {PasswordInput} from '@/app/components/forms/PasswordInput';
import {siteConfig} from '@/lib/config';

import {signupUser} from '@/actions/auth/signup';

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      const result = await signupUser({username, email, password});
      if (!result.success) {
        setError(result.error);
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
          <Heading level={2}>Account created</Heading>
          <Banner
            status="success"
            title={`Welcome to ${siteConfig.name}`}
            description={`Your account ${username} is ready and you are signed in. We sent a verification email to ${email} — please confirm your address.`}
          />
        </VStack>
      </Card>
    );
  }

  return (
    <Card padding={6} elevation="low" maxWidth={420}>
      <VStack gap={4}>
        <VStack gap={1} align="center">
          <Heading level={2}>Create your free account</Heading>
          <Text color="secondary">No contracts, no minimum deposits.</Text>
        </VStack>

        {error ? <Banner status="error" title={error} /> : null}

        <form onSubmit={handleSubmit}>
          <VStack gap={3}>
            <TextInput
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="yourbrand"
              htmlName="username"
              isRequired
            />
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              htmlName="email"
              isRequired
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
              htmlName="password"
              isRequired
            />
            <Button
              label={isPending ? 'Creating account…' : 'Create free account'}
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
            Already have an account?
          </Text>
          <Link href="/login" className="text-sm font-medium text-blue-vivid hover:underline">
            Sign in
          </Link>
        </HStack>
      </VStack>
    </Card>
  );
}
