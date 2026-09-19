import Link from 'next/link';
import {notFound} from 'next/navigation';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Grid} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';

import {collections} from '@/lib/db';
import {formatAmount, formatDateTime} from '@/app/user/add-funds/format';
import {ticketRef} from '@/app/components/support/ticketMeta';
import {ORDER_STATUS_DOT, ORDER_STATUS_LABELS} from '@/app/components/orders/orderMeta';
import {SectionPagination} from './SectionPagination';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `User detail · ${siteConfig.adminName}`,
};

const SECTION_PAGE_SIZE = 10;

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

function clampPage(page: number, total: number): {page: number; totalPages: number; skip: number} {
  const totalPages = Math.max(1, Math.ceil(total / SECTION_PAGE_SIZE));
  const clamped = Math.min(page, totalPages);
  return {page: clamped, totalPages, skip: (clamped - 1) * SECTION_PAGE_SIZE};
}

function SectionCard({
  title,
  count,
  viewAllHref,
  empty,
  children,
}: {
  title: string;
  count: number;
  viewAllHref?: string;
  empty: string;
  children?: React.ReactNode;
}) {
  return (
    <Card padding={5} elevation="low">
      <VStack gap={3}>
        <HStack justify="between" vAlign="center" width="100%">
          <Text weight="semibold">
            {title} · {count.toLocaleString()}
          </Text>
          {viewAllHref ? (
            <Link href={viewAllHref} className="text-sm text-accent">
              View all
            </Link>
          ) : null}
        </HStack>
        {count === 0 ? <Text size="sm" color="secondary">{empty}</Text> : children}
      </VStack>
    </Card>
  );
}

function Row({left, right}: {left: React.ReactNode; right: React.ReactNode}) {
  return (
    <HStack justify="between" vAlign="center" width="100%" gap={2}>
      {left}
      {right}
    </HStack>
  );
}

type SearchParams = Promise<{[key: string]: string | string[] | undefined}>;

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{id: string}>;
  searchParams: SearchParams;
}) {
  const {id} = await params;
  const query = await searchParams;
  const user = await collections.users.findOne({id});
  if (!user) {
    notFound();
  }

  const scoping = {userId: user.id};

  // Counts first — each section's page param clamps against its own total.
  const [orderCount, depositCount, ticketCount, loginCount] = await Promise.all([
    collections.orders.countDocuments(scoping),
    collections.deposits.countDocuments(scoping),
    collections.supportTickets.countDocuments(scoping),
    collections.loginEvents.countDocuments(scoping),
  ]);

  const ordersPage = clampPage(parsePage(query.opage), orderCount);
  const depositsPage = clampPage(parsePage(query.dpage), depositCount);
  const ticketsPage = clampPage(parsePage(query.tpage), ticketCount);
  const loginsPage = clampPage(parsePage(query.lpage), loginCount);

  const pageWindow = (skip: number) => ({
    sort: {createdAt: -1 as const},
    skip,
    limit: SECTION_PAGE_SIZE,
  });

  const [orders, deposits, tickets, logins] = await Promise.all([
    collections.orders.find(scoping, pageWindow(ordersPage.skip)).toArray(),
    collections.deposits.find(scoping, pageWindow(depositsPage.skip)).toArray(),
    // Tickets sort by activity, matching the global support list.
    collections.supportTickets
      .find(scoping, {...pageWindow(ticketsPage.skip), sort: {updatedAt: -1 as const}})
      .toArray(),
    collections.loginEvents.find(scoping, pageWindow(loginsPage.skip)).toArray(),
  ]);

  const serviceIds = [...new Set(orders.map((order) => order.serviceId))];
  const services = serviceIds.length
    ? await collections.services.find({id: {$in: serviceIds}}, {projection: {id: 1, name: 1}}).toArray()
    : [];
  const serviceNameById = new Map(services.map((service) => [service.id, service.name]));

  // Username search on the global lists doubles as the per-user filter.
  const q = encodeURIComponent(user.username);

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>{user.username}</Heading>
        <Text color="secondary">{user.email}</Text>
      </VStack>

      <Card padding={5} elevation="low">
        <HStack gap={6} wrap="wrap" vAlign="center">
          <VStack gap={1}>
            <Text size="sm" color="secondary">Balance</Text>
            <Text size="lg" weight="semibold" hasTabularNumbers>
              {formatAmount(user.balance ?? 0)}
            </Text>
          </VStack>
          <VStack gap={1}>
            <Text size="sm" color="secondary">Status</Text>
            <StatusDot
              variant={(user.status ?? 'active') === 'active' ? 'success' : 'error'}
              label={(user.status ?? 'active') === 'active' ? 'Active' : 'Banned'}
            />
          </VStack>
          <VStack gap={1}>
            <Text size="sm" color="secondary">Language</Text>
            <Text size="sm">{user.language}</Text>
          </VStack>
          <VStack gap={1}>
            <Text size="sm" color="secondary">Joined</Text>
            <Text size="sm">{user.createdAt ? formatDateTime(user.createdAt) : '—'}</Text>
          </VStack>
        </HStack>
      </Card>

      <Grid gap={4} columns={{minWidth: 320}}>
        <SectionCard
          title="Orders"
          count={orderCount}
          viewAllHref={`/admin/orders?q=${q}`}
          empty="No orders yet."
        >
          {orders.map((order) => (
            <Row
              key={order.id}
              left={
                <VStack gap={0.5}>
                  <Text size="sm">{serviceNameById.get(order.serviceId) ?? 'Unknown service'}</Text>
                  <Text size="sm" color="secondary">
                    {ticketRef(order.id)} · {formatDateTime(order.createdAt)}
                  </Text>
                </VStack>
              }
              right={
                <HStack gap={2} vAlign="center">
                  <Text size="sm" hasTabularNumbers>{formatAmount(order.totalPrice)}</Text>
                  <StatusDot
                    variant={ORDER_STATUS_DOT[order.status]}
                    label={ORDER_STATUS_LABELS[order.status]}
                  />
                </HStack>
              }
            />
          ))}
          {orderCount > 0 ? (
            <HStack justify="end" width="100%">
              <SectionPagination
                param="opage"
                label="User orders pagination"
                page={ordersPage.page}
                pageSize={SECTION_PAGE_SIZE}
                total={orderCount}
                totalPages={ordersPage.totalPages}
              />
            </HStack>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Deposits"
          count={depositCount}
          viewAllHref={`/admin/deposits?q=${q}`}
          empty="No deposits yet."
        >
          {deposits.map((deposit) => (
            <Row
              key={deposit.id}
              left={
                <Text size="sm" color="secondary">
                  {ticketRef(deposit.id)} · {formatDateTime(deposit.createdAt)}
                </Text>
              }
              right={
                <Text size="sm" hasTabularNumbers>
                  {formatAmount(deposit.amount, deposit.currency)} · {deposit.status}
                </Text>
              }
            />
          ))}
          {depositCount > 0 ? (
            <HStack justify="end" width="100%">
              <SectionPagination
                param="dpage"
                label="User deposits pagination"
                page={depositsPage.page}
                pageSize={SECTION_PAGE_SIZE}
                total={depositCount}
                totalPages={depositsPage.totalPages}
              />
            </HStack>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Support tickets"
          count={ticketCount}
          viewAllHref={`/admin/support?q=${q}`}
          empty="No tickets yet."
        >
          {tickets.map((ticket) => (
            <Row
              key={ticket.id}
              left={
                <Text size="sm">{ticket.title}</Text>
              }
              right={
                <Text size="sm" color="secondary">
                  {ticket.status} · {formatDateTime(ticket.updatedAt)}
                </Text>
              }
            />
          ))}
          {ticketCount > 0 ? (
            <HStack justify="end" width="100%">
              <SectionPagination
                param="tpage"
                label="User tickets pagination"
                page={ticketsPage.page}
                pageSize={SECTION_PAGE_SIZE}
                total={ticketCount}
                totalPages={ticketsPage.totalPages}
              />
            </HStack>
          ) : null}
        </SectionCard>

        <SectionCard title="Login history" count={loginCount} empty="No logins recorded yet.">
          {logins.map((event) => (
            <Row
              key={event.id}
              left={<Text size="sm">{formatDateTime(event.createdAt)}</Text>}
              right={
                <Text size="sm" color="secondary">
                  {event.ip ?? 'unknown ip'}
                </Text>
              }
            />
          ))}
          {loginCount > 0 ? (
            <HStack justify="end" width="100%">
              <SectionPagination
                param="lpage"
                label="User logins pagination"
                page={loginsPage.page}
                pageSize={SECTION_PAGE_SIZE}
                total={loginCount}
                totalPages={loginsPage.totalPages}
              />
            </HStack>
          ) : null}
        </SectionCard>
      </Grid>
    </VStack>
  );
}
