'use client';

import {useState} from 'react';
import Link from 'next/link';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {TextInput} from '@astryxdesign/core/TextInput';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';

import {STATS} from './content';

/** Compact sign-in card shown in the hero (presentational until auth ships). */
export function HeroSignInCard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <Card padding={4} elevation="low" maxWidth={460}>
      <VStack gap={3}>
        <Heading level={2}>Account Access</Heading>

        <Grid columns={2} gap={2}>
          <HStack gap={1.5} vAlign="center" className="rounded-md bg-blue-subtle px-3 py-2">
            <HStack width={2} height={2} className="rounded-full bg-success" />
            <Text size="xsm" weight="semibold" color="primary">
              Orders via public links
            </Text>
          </HStack>
          <HStack gap={1.5} vAlign="center" className="rounded-md bg-blue-subtle px-3 py-2">
            <HStack width={2} height={2} className="rounded-full bg-success" />
            <Text size="xsm" weight="semibold" color="primary">
              No passwords required
            </Text>
          </HStack>
        </Grid>

        <form action="/login">
          <VStack gap={2}>
            <TextInput
              label="Username or email"
              value={username}
              onChange={setUsername}
              placeholder="you@example.com"
              htmlName="username"
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              htmlName="password"
            />

            <HStack gap={3} vAlign="center" justify="between">
              <CheckboxInput
                label="Remember me"
                value={remember}
                onChange={setRemember}
                htmlName="remember"
              />
              <Link
                href="/login"
                className="text-xs font-medium text-blue-vivid hover:underline"
              >
                Forgot password?
              </Link>
            </HStack>

            <Button
              label="Sign in"
              variant="primary"
              width="100%"
              type="submit"
            />
          </VStack>
        </form>

        <Link
          href="/signup"
          className="rounded-md border border-blue-ring bg-surface py-2.5 text-center text-xs font-semibold text-primary hover:border-strong"
        >
          New here? Create a free account
        </Link>

        <Divider />

        <Grid columns={3} gap={2}>
          {STATS.slice(0, 3).map((stat) => (
            <VStack key={stat.label} align="start" gap={0.5} className="rounded-md bg-body px-3 py-2.5">
              <Text weight="bold">{stat.value}</Text>
              <Text size="xsm" color="secondary">
                {stat.label}
              </Text>
            </VStack>
          ))}
        </Grid>
      </VStack>
    </Card>
  );
}
