'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, Wallet } from 'lucide-react';

import { Table, useTablePagination, proportional, pixel, type TableColumn } from '@astryxdesign/core/Table';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { IconButton } from '@astryxdesign/core/IconButton';
import { useClipboard } from '@astryxdesign/core/hooks';
import { Button } from '@astryxdesign/core/Button';
import { EmptyState } from '@astryxdesign/core/EmptyState';

import { checkDepositStatus, getUserDepositsPage, type DepositsPage } from '@/actions/deposits/status';
import type { Deposit, DepositStatus } from '@/lib/database';

import { formatAmount, formatDateTime } from './format';

const STATUS_META: Record<
  DepositStatus,
  { variant: 'success' | 'warning' | 'error' | 'neutral'; label: string; isPulsing?: boolean }
> = {
  completed: { variant: 'success', label: 'Completed' },
  pending: { variant: 'warning', label: 'Pending', isPulsing: true },
  failed: { variant: 'error', label: 'Failed' },
  cancelled: { variant: 'neutral', label: 'Cancelled' },
};

const GATEWAY_LABELS: Record<string, string> = {
  dodopayments: 'Dodo Payments',
};

interface DepositRow extends Record<string, unknown> {
  id: string;
  date: string;
  amount: string;
  gateway: string;
  status: DepositStatus;
}

interface DepositHistoryProps {
  /** Page 1 of the history, fetched on the server for the first render. */
  initialPage: DepositsPage;
}

/** Truncated id + copy affordance  one hook instance per row for its own copied state. */
function DepositIdCell({ id }: { id: string }) {
  const { copy, isCopied } = useClipboard({ announce: 'Deposit ID copied' });
  const shortId = `${id.slice(0, 8)}…`;
  return (
    <HStack gap={1.5} vAlign="center">
      <Text size="sm" hasTabularNumbers>
        {shortId}
      </Text>
      <IconButton
        label={isCopied ? 'Copied' : 'Copy full deposit ID'}
        tooltip={isCopied ? 'Copied' : 'Copy full ID'}
        icon={isCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        variant="ghost"
        size="sm"
        onClick={() => void copy(id)}
      />
    </HStack>
  );
}

/**
 * Dense paginated deposit history. The server owns the data (status.ts
 * returns one page plus the total count); this component owns the current
 * page and fetches new pages through the server action. Pending rows expose
 * a manual "Check status" action that re-verifies against the gateway.
 */
export function DepositHistory({ initialPage }: DepositHistoryProps) {
  const router = useRouter();
  const [pageData, setPageData] = useState<DepositsPage>(initialPage);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  // Guards against out-of-order responses when pages are clicked quickly.
  const requestSeqRef = useRef(0);

  const fetchPage = useCallback(
    async (page: number) => {
      const seq = ++requestSeqRef.current;
      const result = await getUserDepositsPage({ page, pageSize: pageData.pageSize });
      if (seq !== requestSeqRef.current) {
        return; // A newer request superseded this one.
      }
      setPageData(result);
    },
    [pageData.pageSize]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== pageData.page) {
        void fetchPage(page);
      }
    },
    [pageData.page, fetchPage]
  );

  const paginationPlugin = useTablePagination<DepositRow>({
    page: pageData.page,
    onPageChange: handlePageChange,
    totalItems: pageData.totalItems,
    pageSize: pageData.pageSize,
  });

  async function handleCheck(depositId: string) {
    setCheckingId(depositId);
    await checkDepositStatus(depositId);
    setCheckingId(null);
    // Refresh the rows on the current page, plus the top-bar balance.
    await fetchPage(pageData.page);
    router.refresh();
  }

  const { items: deposits } = pageData;

  if (deposits.length === 0) {
    return (
      <EmptyState
        icon={<Wallet size={28} className="text-secondary" aria-hidden="true" />}
        title="No deposits yet"
        description="Your top-up history will appear here after your first deposit."
      />
    );
  }

  const rows: DepositRow[] = deposits.map((deposit: Deposit) => ({
    id: deposit.id,
    date: formatDateTime(deposit.createdAt),
    amount: formatAmount(deposit.amount, deposit.currency),
    gateway: GATEWAY_LABELS[deposit.gateway] ?? deposit.gateway,
    status: deposit.status,
  }));

  const columns: TableColumn<DepositRow>[] = [
    { key: 'date', header: 'Date', width: proportional(1) },
    {
      key: 'id',
      header: 'Deposit ID',
      width: proportional(1),
      renderCell: (row) => <DepositIdCell id={row.id} />,
    },
    { key: 'amount', header: 'Amount', width: proportional(1) },
    { key: 'gateway', header: 'Gateway', width: proportional(1) },
    {
      key: 'status',
      header: 'Status',
      width: pixel(140),
      renderCell: (row) => {
        const meta = STATUS_META[row.status];
        // StatusDot's label is screen-reader-only  always pair with visible text.
        return (
          <HStack gap={2} vAlign="center">
            <StatusDot
              variant={meta.variant}
              label={meta.label}
              isPulsing={meta.isPulsing}
            />
            <Text size="sm">{meta.label}</Text>
          </HStack>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      width: pixel(140),
      renderCell: (row) =>
        row.status === 'pending' ? (
          <Button
            size="sm"
            variant="secondary"
            label="Check status"
            isLoading={checkingId === row.id}
            onClick={() => void handleCheck(row.id)}
          />
        ) : null,
    },
  ];

  return (
    <Table
      data={rows}
      columns={columns}
      idKey="id"
      density="compact"
      dividers="rows"
      textOverflow="truncate"
      plugins={{ pagination: paginationPlugin }}
      // Windowed view: aria indices reflect position across all pages.
      rowIndexStart={(pageData.page - 1) * pageData.pageSize + 1}
      rowCount={pageData.totalItems}
    />
  );
}
