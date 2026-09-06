import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';

import {collections} from '@/lib/db';
import {getSession} from '@/actions/auth/session';
import {StatGrid} from './StatGrid';

export const metadata = {
  title: 'Dashboard · PKD-SMM Admin',
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  const [totalUsers, bannedUsers, totalServices] = await Promise.all([
    collections.users.countDocuments({}),
    collections.users.countDocuments({status: 'banned'}),
    collections.services.countDocuments({}),
  ]);

  return (
    <VStack gap={6} className="w-full pt-6">
      <VStack gap={1}>
        <Heading level={1}>Dashboard</Heading>
        <Text color="secondary">
          Welcome back{session ? `, ${session.username}` : ''}. Here is the current state of the panel.
        </Text>
      </VStack>

      <StatGrid
        stats={[
          {iconKey: 'users', label: 'Total users', value: totalUsers},
          {iconKey: 'services', label: 'Total services', value: totalServices},
          {iconKey: 'banned', label: 'Banned users', value: bannedUsers},
        ]}
      />

      <HStack gap={2} vAlign="center">
        <StatusDot variant="success" label="Panel status: operational" />
        <Text size="sm" color="secondary">Panel operational — middleware is protecting admin routes.</Text>
      </HStack>
    </VStack>
  );
}
