import {ClipboardList} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listAdminOrders} from '@/actions/admin/orders';
import {ORDER_PAGE_SIZES, ORDER_STATUSES} from '@/lib/database';
import {UrlPagination} from '@/app/components/support/UrlPagination';

import {AdminOrdersToolbar} from './AdminOrdersToolbar';
import {AdminOrdersTable} from './AdminOrdersTable';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Orders · ${siteConfig.adminName}`,
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

export default async function AdminOrdersPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const search = firstParam(params.q) ?? '';
  const statusParam = firstParam(params.status) ?? '';
  const status = (ORDER_STATUSES as readonly string[]).includes(statusParam) ? statusParam : '';
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (ORDER_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;

  const result = await listAdminOrders({page, pageSize, search, status: status || undefined});
  const isFiltered = Boolean(search.trim() || status);

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Orders</Heading>
        <Text color="secondary">
          {result.total.toLocaleString()} {result.total === 1 ? 'order' : 'orders'}
          {isFiltered ? ' matching the current filters.' : ' across all users.'}
        </Text>
      </VStack>

      <AdminOrdersToolbar initialSearch={search} initialStatus={status} />

      {result.orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={28} />}
          title={isFiltered ? 'No orders match your filters' : 'No orders yet'}
          description={
            isFiltered
              ? 'Try a different username, order id, or status.'
              : 'Orders will appear here as soon as users place them.'
          }
        />
      ) : (
        <>
          <AdminOrdersTable
            orders={result.orders}
            rowIndexStart={(result.page - 1) * result.pageSize + 1}
            rowCount={result.total}
          />
          <HStack justify="end" wrap="wrap">
            <UrlPagination
              label="Orders pagination"
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
              totalPages={result.totalPages}
              pageSizes={ORDER_PAGE_SIZES}
            />
          </HStack>
        </>
      )}
    </VStack>
  );
}
