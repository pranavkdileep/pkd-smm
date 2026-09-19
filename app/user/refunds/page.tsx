import {RotateCcw} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listRefunds} from '@/actions/users/refunds';
import {ORDER_PAGE_SIZES} from '@/lib/database';

import {RefundsTable} from './RefundsTable';
import {UrlPagination} from '@/app/components/support/UrlPagination';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Refunds · ${siteConfig.name}`,
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

export default async function RefundsPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (ORDER_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;

  const result = await listRefunds({page, pageSize});

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <HStack justify="between" vAlign="center" wrap="wrap" gap={3} width="100%">
        <VStack gap={1}>
          <Heading level={1}>Refunds</Heading>
          <Text color="secondary">
            {result.total === 0
              ? 'Cancelled orders are refunded to your balance automatically.'
              : `${result.total.toLocaleString()} ${result.total === 1 ? 'refund' : 'refunds'} · credited back to your balance.`}
          </Text>
        </VStack>
      </HStack>

      {result.orders.length === 0 ? (
        <EmptyState
          headingLevel={2}
          icon={<RotateCcw size={28} className="text-secondary" aria-hidden="true" />}
          title="No refunds yet"
          description="When an order is cancelled, its full amount is returned to your balance and listed here."
        />
      ) : (
        <>
          <RefundsTable
            refunds={result.orders}
            rowIndexStart={(result.page - 1) * result.pageSize + 1}
            rowCount={result.total}
          />
          {result.totalPages > 1 ? (
            <HStack justify="end" wrap="wrap">
              <UrlPagination
                label="Refunds pagination"
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
