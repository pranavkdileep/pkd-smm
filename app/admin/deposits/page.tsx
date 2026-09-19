import {Wallet} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listAdminDeposits} from '@/actions/admin/deposits';
import {DEPOSIT_PAGE_SIZES, DEPOSIT_STATUSES} from '@/lib/database';
import {UrlPagination} from '@/app/components/support/UrlPagination';

import {AdminDepositsToolbar} from './AdminDepositsToolbar';
import {AdminDepositsTable} from './AdminDepositsTable';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Deposits · ${siteConfig.adminName}`,
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

export default async function AdminDepositsPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const search = firstParam(params.q) ?? '';
  const statusParam = firstParam(params.status) ?? '';
  const status = (DEPOSIT_STATUSES as readonly string[]).includes(statusParam) ? statusParam : '';
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (DEPOSIT_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;

  const result = await listAdminDeposits({page, pageSize, search, status: status || undefined});
  const isFiltered = Boolean(search.trim() || status);

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Deposits</Heading>
        <Text color="secondary">
          {result.total.toLocaleString()} {result.total === 1 ? 'deposit' : 'deposits'}
          {isFiltered ? ' matching the current filters.' : ' across all users.'}
        </Text>
      </VStack>

      <AdminDepositsToolbar initialSearch={search} initialStatus={status} />

      {result.deposits.length === 0 ? (
        <EmptyState
          icon={<Wallet size={28} />}
          title={isFiltered ? 'No deposits match your filters' : 'No deposits yet'}
          description={
            isFiltered
              ? 'Try a different username, deposit id, or status.'
              : 'Deposits will appear here as soon as users add funds.'
          }
        />
      ) : (
        <>
          <AdminDepositsTable
            deposits={result.deposits}
            rowIndexStart={(result.page - 1) * result.pageSize + 1}
            rowCount={result.total}
          />
          <HStack justify="end" wrap="wrap">
            <UrlPagination
              label="Deposits pagination"
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
              totalPages={result.totalPages}
              pageSizes={DEPOSIT_PAGE_SIZES}
            />
          </HStack>
        </>
      )}
    </VStack>
  );
}
