import {LifeBuoy} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listSupportTickets} from '@/actions/support/list';
import {
  SUPPORT_PAGE_SIZES,
  SUPPORT_TICKET_CATEGORIES,
  type SupportTicketCategory,
  type SupportTicketStatus,
} from '@/lib/database';

import {SupportToolbar} from './SupportToolbar';
import {TicketsTable} from './TicketsTable';
import {UrlPagination} from '@/app/components/support/UrlPagination';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Support · ${siteConfig.name}`,
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

export default async function SupportPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (SUPPORT_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;
  const search = firstParam(params.q)?.trim() ?? '';
  const statusParam = firstParam(params.status) ?? '';
  const status = statusParam === 'open' || statusParam === 'closed' ? statusParam : '';
  const categoryParam = firstParam(params.category) ?? '';
  const category = (SUPPORT_TICKET_CATEGORIES as readonly string[]).includes(categoryParam)
    ? categoryParam
    : '';

  const result = await listSupportTickets({
    page,
    pageSize,
    q: search,
    status: (status || undefined) as SupportTicketStatus | undefined,
    category: (category || undefined) as SupportTicketCategory | undefined,
  });
  const isFiltered = Boolean(search || status || category);

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <HStack justify="between" vAlign="center" wrap="wrap" gap={3} width="100%">
        <VStack gap={1}>
          <Heading level={1}>Support</Heading>
          <Text color="secondary">
            {result.total === 0
              ? 'Open a ticket and the team will get back to you.'
              : `${result.total.toLocaleString()} ${result.total === 1 ? 'ticket' : 'tickets'} · most recent activity first.`}
          </Text>
        </VStack>
        <SupportToolbar search={search} status={status} category={category} />
      </HStack>

      {result.tickets.length === 0 ? (
        <EmptyState
          headingLevel={2}
          icon={<LifeBuoy size={28} className="text-secondary" aria-hidden="true" />}
          title={isFiltered ? 'No tickets match your filters' : 'No support tickets'}
          description={
            isFiltered
              ? 'Try a different search term or filter.'
              : 'When you open a ticket, it will appear here with its status and conversation.'
          }
        />
      ) : (
        <>
          <TicketsTable tickets={result.tickets} />
          {result.totalPages > 1 ? (
            <HStack justify="end" wrap="wrap">
              <UrlPagination
                label="Support tickets pagination"
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
