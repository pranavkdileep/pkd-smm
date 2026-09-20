'use client';

import { Table, proportional, pixel, type TableColumn } from '@astryxdesign/core/Table';
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';

import type { AdminTransactionRow } from '@/actions/admin/transactions';
import type { TransactionType } from '@/lib/database';
import { formatAmount, formatDateTime } from '@/app/user/add-funds/format';
import { ticketRef } from '@/app/components/support/ticketMeta';

const TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  order: 'Order',
  refund: 'Refund',
  adjustment: 'Adjustment',
};

/** Read-only ledger rows  an audit trail has no row actions. */
export function AdminTransactionsTable({
  transactions,
  rowIndexStart,
  rowCount,
}: {
  transactions: AdminTransactionRow[];
  rowIndexStart: number;
  rowCount: number;
}) {
  const columns: TableColumn<AdminTransactionRow>[] = [
    {
      key: 'id',
      header: 'Transaction',
      width: proportional(1),
      renderCell: (tx) => (
        <VStack gap={0.5}>
          <Text size="sm" weight="medium">
            {ticketRef(tx.id)}
          </Text>
          <Text size="sm" color="secondary">
            {formatDateTime(tx.createdAt)}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'username',
      header: 'User',
      width: proportional(1),
      renderCell: (tx) => <Text size="sm">{tx.username}</Text>,
    },
    {
      key: 'type',
      header: 'Type',
      width: pixel(120),
      renderCell: (tx) => <Text size="sm">{TYPE_LABELS[tx.type]}</Text>,
    },
    {
      key: 'amount',
      header: 'Amount',
      width: pixel(120),
      align: 'end',
      renderCell: (tx) => (
        // Signed ledger convention: in (deposit/refund/adjustment+) positive,
        // out (order/withdrawal/adjustment−) negative.
        <Text size="sm" hasTabularNumbers>
          {tx.amount > 0 ? '+' : ''}
          {formatAmount(tx.amount)}
        </Text>
      ),
    },
    {
      key: 'note',
      header: 'Note',
      width: proportional(2),
      renderCell: (tx) => (
        <Text size="sm" color={tx.note ? undefined : 'secondary'}>
          {tx.note ?? ''}
        </Text>
      ),
    },
  ];

  return (
    <Table
      data={transactions}
      columns={columns}
      idKey="id"
      density="compact"
      hasHover
      textOverflow="truncate"
      rowIndexStart={rowIndexStart}
      rowCount={rowCount}
    />
  );
}
