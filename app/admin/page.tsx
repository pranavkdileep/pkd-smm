import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Grid} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';

import {collections} from '@/lib/db';
import {ORDER_STATUSES} from '@/lib/database';
import {getSession} from '@/actions/auth/session';
import {formatAmount} from '@/app/user/add-funds/format';
import {ORDER_STATUS_DOT, ORDER_STATUS_LABELS} from '@/app/components/orders/orderMeta';
import {StatGrid} from './StatGrid';

export const metadata = {
  title: 'Dashboard · PKD-SMM Admin',
};

export default async function AdminDashboardPage() {
  const session = await getSession();

  // ponytail: "today" is the server's local day boundary — add a panel
  // timezone setting if the team operates in another zone.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const [
    totalUsers,
    bannedUsers,
    totalServices,
    revenueAgg,
    ordersByStatusAgg,
    pendingDepositsAgg,
    topSpendersAgg,
  ] = await Promise.all([
    collections.users.countDocuments({}),
    collections.users.countDocuments({status: 'banned'}),
    collections.services.countDocuments({}),
    // Revenue = order spend from the ledger. Order amounts are stored negative,
    // hence the negation.
    collections.transactions
      .aggregate<{total: number; today: number}>([
        {$match: {type: 'order'}},
        {
          $group: {
            _id: null,
            total: {$sum: '$amount'},
            today: {$sum: {$cond: [{$gte: ['$createdAt', todayIso]}, '$amount', 0]}},
          },
        },
      ])
      .toArray(),
    collections.orders
      .aggregate<{_id: string; count: number}>([
        {$group: {_id: '$status', count: {$sum: 1}}},
      ])
      .toArray(),
    // ponytail: sums amounts across currencies — fine while the panel runs
    // single-currency; group by currency if multi-currency deposits ever ship.
    collections.deposits
      .aggregate<{count: number; total: number}>([
        {$match: {status: 'pending'}},
        {$group: {_id: null, count: {$sum: 1}, total: {$sum: '$amount'}}},
      ])
      .toArray(),
    // Top 5 users by lifetime order spend (most negative sums first).
    collections.transactions
      .aggregate<{_id: string; spent: number}>([
        {$match: {type: 'order'}},
        {$group: {_id: '$userId', spent: {$sum: '$amount'}}},
        {$sort: {spent: 1}},
        {$limit: 5},
      ])
      .toArray(),
  ]);

  const revenue = revenueAgg[0] ?? {total: 0, today: 0};
  const pendingDeposits = pendingDepositsAgg[0] ?? {count: 0, total: 0};

  const ordersByStatus = new Map(ordersByStatusAgg.map((row) => [row._id, row.count]));

  const topUserIds = topSpendersAgg.map((row) => row._id);
  const topUsers = topUserIds.length
    ? await collections.users
        .find({id: {$in: topUserIds}}, {projection: {id: 1, username: 1}})
        .toArray()
    : [];
  const usernameById = new Map(topUsers.map((user) => [user.id, user.username]));

  return (
    <VStack gap={6} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Dashboard</Heading>
        <Text color="secondary">
          Welcome back{session ? `, ${session.username}` : ''}. Here is the current state of the panel.
        </Text>
      </VStack>

      <StatGrid
        stats={[
          {iconKey: 'revenue', label: 'Revenue today', value: formatAmount(-revenue.today)},
          {iconKey: 'revenueTotal', label: 'Total revenue', value: formatAmount(-revenue.total)},
          {
            iconKey: 'deposits',
            label: `Pending deposits · ${pendingDeposits.count.toLocaleString()}`,
            value: formatAmount(pendingDeposits.total),
          },
          {iconKey: 'users', label: 'Total users', value: totalUsers.toLocaleString()},
          {iconKey: 'services', label: 'Total services', value: totalServices.toLocaleString()},
          {iconKey: 'banned', label: 'Banned users', value: bannedUsers.toLocaleString()},
        ]}
      />

      <Grid gap={4} columns={{minWidth: 320}}>
        <Card padding={5} elevation="low">
          <VStack gap={3}>
            <Text weight="semibold">Orders by status</Text>
            {ORDER_STATUSES.map((status) => (
              <HStack key={status} justify="between" vAlign="center" width="100%">
                <HStack gap={2} vAlign="center">
                  <StatusDot variant={ORDER_STATUS_DOT[status]} label={ORDER_STATUS_LABELS[status]} />
                  <Text size="sm">{ORDER_STATUS_LABELS[status]}</Text>
                </HStack>
                <Text size="sm" weight="semibold" hasTabularNumbers>
                  {(ordersByStatus.get(status) ?? 0).toLocaleString()}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Card>

        <Card padding={5} elevation="low">
          <VStack gap={3}>
            <Text weight="semibold">Top users by spend</Text>
            {topSpendersAgg.length === 0 ? (
              <Text size="sm" color="secondary">
                No orders placed yet.
              </Text>
            ) : (
              topSpendersAgg.map((row, index) => (
                <HStack key={row._id} justify="between" vAlign="center" width="100%">
                  <Text size="sm">
                    {index + 1}. {usernameById.get(row._id) ?? 'Deleted user'}
                  </Text>
                  <Text size="sm" weight="semibold" hasTabularNumbers>
                    {formatAmount(-row.spent)}
                  </Text>
                </HStack>
              ))
            )}
          </VStack>
        </Card>
      </Grid>

      <HStack gap={2} vAlign="center">
        <StatusDot variant="success" label="Panel status: operational" />
        <Text size="sm" color="secondary">Panel operational — middleware is protecting admin routes.</Text>
      </HStack>
    </VStack>
  );
}
