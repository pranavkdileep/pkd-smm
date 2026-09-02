import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Badge} from '@astryxdesign/core/Badge';

import {getSession} from '@/actions/auth/session';
import {LogoutButton} from './LogoutButton';

export const metadata = {
  title: 'Admin · PKD-SMM Panel',
};

export default async function AdminPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-body">
      <section aria-label="Admin area" className="py-16 md:py-24">
        <VStack maxWidth={720} gap={6} className="mx-auto w-full px-6">
          <HStack justify="between" vAlign="center" wrap="wrap">
            <VStack gap={2} align="start">
              <Badge variant="blue" label="Demo admin area" />
              <Heading level={1}>
                Hello Admin{session ? `, ${session.username}` : ''}
              </Heading>
              <Text color="secondary">
                You are signed in with an administrator session. This page is protected by
                middleware — only valid admin JWT cookies get through.
              </Text>
            </VStack>
            <LogoutButton />
          </HStack>
        </VStack>
      </section>
    </main>
  );
}
