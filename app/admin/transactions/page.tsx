import {Receipt} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listAdminTransactions} from '@/actions/admin/transactions';
import {TRANSACTION_PAGE_SIZES, TransactionTypes} from '@/lib/database';
import {UrlPagination} from '@/app/components/support/UrlPagination';

import {AdminTransactionsToolbar} from './AdminTransactionsToolbar';
import {AdminTransactionsTable} from './AdminTransactionsTable';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Transactions · ${siteConfig.adminName}`,
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

export default async function AdminTransactionsPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const search = firstParam(params.q) ?? '';
  const typeParam = firstParam(params.type) ?? '';
  const type = (TransactionTypes as readonly string[]).includes(typeParam) ? typeParam : '';
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (TRANSACTION_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;

  const result = await listAdminTransactions({page, pageSize, search, type: type || undefined});
  const isFiltered = Boolean(search.trim() || type);

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Transactions</Heading>
        <Text color="secondary">
          {result.total.toLocaleString()} {result.total === 1 ? 'entry' : 'entries'}
          {isFiltered ? ' matching the current filters.' : ' in the ledger.'}
        </Text>
      </VStack>

      <AdminTransactionsToolbar initialSearch={search} initialType={type} />

      {result.transactions.length === 0 ? (
        <EmptyState
          icon={<Receipt size={28} />}
          title={isFiltered ? 'No transactions match your filters' : 'No transactions yet'}
          description={
            isFiltered
              ? 'Try a different username, transaction id, or type.'
              : 'Deposits, orders, refunds, and adjustments will appear here.'
          }
        />
      ) : (
        <>
          <AdminTransactionsTable
            transactions={result.transactions}
            rowIndexStart={(result.page - 1) * result.pageSize + 1}
            rowCount={result.total}
          />
          <HStack justify="end" wrap="wrap">
            <UrlPagination
              label="Transactions pagination"
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
              totalPages={result.totalPages}
              pageSizes={TRANSACTION_PAGE_SIZES}
            />
          </HStack>
        </>
      )}
    </VStack>
  );
}
