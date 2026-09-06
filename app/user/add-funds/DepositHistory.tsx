'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Wallet} from 'lucide-react';

import {Table, proportional, pixel, type TableColumn} from '@astryxdesign/core/Table';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Button} from '@astryxdesign/core/Button';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {checkDepositStatus} from '@/actions/deposits/status';
import type {Deposit, DepositStatus} from '@/lib/database';

import {formatAmount, formatDateTime} from './format';

const STATUS_META: Record<
  DepositStatus,
  {variant: 'success' | 'warning' | 'error' | 'neutral'; label: string; isPulsing?: boolean}
> = {
  completed: {variant: 'success', label: 'Completed'},
  pending: {variant: 'warning', label: 'Pending', isPulsing: true},
  failed: {variant: 'error', label: 'Failed'},
  cancelled: {variant: 'neutral', label: 'Cancelled'},
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

/**
 * Dense deposit history table. Pending rows expose a manual "Check status"
 * action that re-verifies against the gateway via status.ts.
 */
export function DepositHistory({deposits}: {deposits: Deposit[]}) {
  const router = useRouter();
  const [checkingId, setCheckingId] = useState<string | null>(null);

  async function handleCheck(depositId: string) {
    setCheckingId(depositId);
    await checkDepositStatus(depositId);
    setCheckingId(null);
    // History rows and the top-bar balance reflect the latest status.
    router.refresh();
  }

  if (deposits.length === 0) {
    return (
      <EmptyState
        icon={<Wallet size={28} className="text-secondary" aria-hidden="true" />}
        title="No deposits yet"
        description="Your top-up history will appear here after your first deposit."
      />
    );
  }

  const rows: DepositRow[] = deposits.map((deposit) => ({
    id: deposit.id,
    date: formatDateTime(deposit.createdAt),
    amount: formatAmount(deposit.amount, deposit.currency),
    gateway: GATEWAY_LABELS[deposit.gateway] ?? deposit.gateway,
    status: deposit.status,
  }));

  const columns: TableColumn<DepositRow>[] = [
    {key: 'date', header: 'Date', width: proportional(1)},
    {key: 'id', header: 'Deposit ID', width: proportional(2)},
    {key: 'amount', header: 'Amount', width: proportional(1)},
    {key: 'gateway', header: 'Gateway', width: proportional(1)},
    {
      key: 'status',
      header: 'Status',
      width: proportional(1),
      renderCell: (row) => {
        const meta = STATUS_META[row.status];
        return (
          <StatusDot
            variant={meta.variant}
            label={meta.label}
            isPulsing={meta.isPulsing}
          />
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
    />
  );
}
