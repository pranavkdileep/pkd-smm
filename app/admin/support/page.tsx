import {LifeBuoy} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listAdminSupportTickets} from '@/actions/admin/support';
import {
  SUPPORT_PAGE_SIZES,
  SUPPORT_TICKET_CATEGORIES,
  SUPPORT_TICKET_PRIORITIES,
} from '@/lib/database';
import {UrlPagination} from '@/app/components/support/UrlPagination';

import {AdminSupportToolbar} from './AdminSupportToolbar';
import {AdminTicketsTable} from './AdminTicketsTable';

export const metadata = {
  title: 'Support · PKD-SMM Admin',
};

type SearchParams = Promise<{[key: string]: string | string[] | undefined}>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : undefined;
}

export default async function AdminSupportPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const search = firstParam(params.q) ?? '';
  const status = firstParam(params.status) ?? '';
  const category = firstParam(params.category) ?? '';
  const priority = firstParam(params.priority) ?? '';
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (SUPPORT_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;

  const result = await listAdminSupportTickets({
    page,
    pageSize,
    search,
    status: status === 'open' || status === 'closed' ? status : undefined,
    category: (SUPPORT_TICKET_CATEGORIES as readonly string[]).includes(category)
      ? category
      : undefined,
    priority: (SUPPORT_TICKET_PRIORITIES as readonly string[]).includes(priority)
      ? priority
      : undefined,
  });

  const isFiltered = Boolean(
    search.trim() || (status === 'open' || status === 'closed') || category || priority
  );

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Support</Heading>
        <Text color="secondary">
          {result.total === 0
            ? 'Every support ticket across the panel, newest activity first.'
            : `${result.total.toLocaleString()} ${result.total === 1 ? 'ticket' : 'tickets'} · ${result.openCount.toLocaleString()} open · most recent activity first.`}
        </Text>
      </VStack>

      <AdminSupportToolbar
        initialSearch={search}
        initialStatus={status === 'open' || status === 'closed' ? status : ''}
        initialCategory={category}
        initialPriority={priority}
      />

      {result.tickets.length === 0 ? (
        <EmptyState
          headingLevel={2}
          icon={<LifeBuoy size={28} className="text-secondary" aria-hidden="true" />}
          title={isFiltered ? 'No tickets match your filters' : 'No support tickets yet'}
          description={
            isFiltered
              ? 'Try clearing a filter or searching for something else.'
              : 'Tickets opened by users will appear here.'
          }
        />
      ) : (
        <>
          <AdminTicketsTable tickets={result.tickets} />
          {result.totalPages > 1 ? (
            <HStack justify="end" wrap="wrap">
              <UrlPagination
                label="Admin support tickets pagination"
                page={result.page}
                pageSize={result.pageSize}
                total={result.total}
                totalPages={result.totalPages}
                pageSizes={SUPPORT_PAGE_SIZES}
              />
            </HStack>
          ) : null}
        </>
      )}
    </VStack>
  );
}
