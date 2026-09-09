import {ClipboardList} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listOrders} from '@/actions/users/orders';
import {ORDER_PAGE_SIZES, ORDER_STATUSES, type OrderStatus} from '@/lib/database';
import {ORDER_STATUS_LABELS} from '@/app/components/orders/orderMeta';

import {OrdersToolbar} from './OrdersToolbar';
import {OrdersTable} from './OrdersTable';
import {OrdersAutoRefresh} from './OrdersAutoRefresh';
import {UrlPagination} from '@/app/components/support/UrlPagination';

export const metadata = {
  title: 'Orders · PKD-SMM Panel',
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

export default async function OrdersPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (ORDER_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;
  const statusParam = firstParam(params.status);
  const status =
    statusParam && (ORDER_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as OrderStatus)
      : undefined;

  const result = await listOrders({page, pageSize, status});

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <HStack justify="between" vAlign="center" wrap="wrap" gap={3} width="100%">
        <VStack gap={1}>
          <Heading level={1}>Orders</Heading>
          <Text color="secondary">
            {status
              ? `${result.total.toLocaleString()} ${result.total === 1 ? 'order' : 'orders'} · ${ORDER_STATUS_LABELS[status]} only.`
              : result.total === 0
                ? 'Place an order from the services page to see it here.'
                : `${result.total.toLocaleString()} ${result.total === 1 ? 'order' : 'orders'} · newest first.`}
          </Text>
        </VStack>
        <OrdersToolbar status={status ?? ''} />
      </HStack>

      {result.orders.length === 0 ? (
        <EmptyState
          headingLevel={2}
          icon={<ClipboardList size={28} className="text-secondary" aria-hidden="true" />}
          title={status ? `No ${ORDER_STATUS_LABELS[status].toLowerCase()} orders` : 'No orders yet'}
          description={
            status
              ? 'Orders with this status will appear here when there are any.'
              : 'When you place an order, it will appear here with its status and delivery progress.'
          }
        />
      ) : (
        <>
          <OrdersAutoRefresh
            orders={result.orders}
            page={result.page}
            pageSize={result.pageSize}
            status={status}
            pageKey={`${result.page}-${result.pageSize}-${status ?? 'all'}`}
          />
          <OrdersTable
            orders={result.orders}
            rowIndexStart={(result.page - 1) * result.pageSize + 1}
            rowCount={result.total}
          />
          {result.totalPages > 1 ? (
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
          ) : null}
        </>
      )}
    </VStack>
  );
}
