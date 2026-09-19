import {redirect} from 'next/navigation';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
import {Divider} from '@astryxdesign/core/Divider';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Badge} from '@astryxdesign/core/Badge';
import type {Language} from '@/lib/database';

import {getUserDetails} from '@/actions/users/details';

import {ChangePasswordForm} from './ChangePasswordForm';
import {EmailVerification} from './EmailVerification';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Settings · ${siteConfig.name}`,
};

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  ar: 'Arabic',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  tr: 'Turkish',
  ur: 'Urdu',
};

function formatDate(iso: string | null): string {
  if (!iso) {
    return 'Not recorded';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

export default async function SettingsPage() {
  const user = await getUserDetails();

  if (!user) {
    redirect('/login?error=unauthenticated');
  }

  return (
    // Settings archetype per Astryx: two-column sections (heading column +
    // content column) separated by dividers — no cards, one containment layer.
    <VStack gap={8} className="w-full pt-6 px-6 pb-10">
      <VStack gap={1}>
        <Heading level={1}>Settings</Heading>
        <Text color="secondary">
          Your account details, email verification, and password — all in one place.
        </Text>
      </VStack>

      <Grid gap={10} columns={{minWidth: 320}}>
        <VStack gap={1}>
          <Heading level={2}>Account</Heading>
          <Text size="sm" color="secondary">How your profile looks on the panel.</Text>
        </VStack>
        <MetadataList>
          <MetadataListItem label="Username">{user.username}</MetadataListItem>
          <MetadataListItem label="Email">
            <HStack gap={2} vAlign="center">
              <Text>{user.email}</Text>
              {user.emailVerified ? (
                <Badge variant="success" label="Verified" />
              ) : (
                <Badge variant="warning" label="Unverified" />
              )}
            </HStack>
          </MetadataListItem>
          <MetadataListItem label="Balance">₹{user.balance.toFixed(2)}</MetadataListItem>
          <MetadataListItem label="Language">{LANGUAGE_LABELS[user.language]}</MetadataListItem>
          <MetadataListItem label="Member since">{formatDate(user.createdAt)}</MetadataListItem>
        </MetadataList>
      </Grid>

      <Divider />

      <Grid gap={10} columns={{minWidth: 320}}>
        <VStack gap={1}>
          <Heading level={2}>Email verification</Heading>
          <Text size="sm" color="secondary">
            Verified accounts can recover access and receive order updates.
          </Text>
        </VStack>
        {user.emailVerified ? (
          <HStack gap={2} vAlign="center" width="100%">
            <Badge variant="success" label="Verified" />
            <Text color="secondary">Your email is confirmed. Nothing more to do here.</Text>
          </HStack>
        ) : (
          <EmailVerification email={user.email} />
        )}
      </Grid>

      <Divider />

      <Grid gap={10} columns={{minWidth: 320}}>
        <VStack gap={1}>
          <Heading level={2}>Password</Heading>
          <Text size="sm" color="secondary">
            Choose something you don’t use anywhere else.
          </Text>
        </VStack>
        <ChangePasswordForm />
      </Grid>
    </VStack>
  );
}
