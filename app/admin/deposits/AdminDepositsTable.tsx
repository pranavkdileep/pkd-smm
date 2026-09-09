'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {
  Table,
  proportional,
  pixel,
  useTableRowExpansion,
  type TableColumn,
} from '@astryxdesign/core/Table';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Button} from '@astryxdesign/core/Button';
import {Banner} from '@astryxdesign/core/Banner';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';

import {approveAdminDeposit, type AdminDepositRow} from '@/actions/admin/deposits';
import type {DepositStatus} from '@/lib/database';
import {formatAmount, formatDateTime} from '@/app/user/add-funds/format';
import {ticketRef} from '@/app/components/support/ticketMeta';

const STATUS_META: Record<
  DepositStatus,
  {variant: 'success' | 'warning' | 'error' | 'neutral'; label: string}
> = {
  completed: {variant: 'success', label: 'Completed'},
  pending: {variant: 'warning', label: 'Pending'},
  failed: {variant: 'error', label: 'Failed'},
  cancelled: {variant: 'neutral', label: 'Cancelled'},
};

function DetailRow({label, value}: {label: string; value: string}) {
  return (
    <HStack gap={2} vAlign="start">
      <Text size="sm" color="secondary" className="w-44 shrink-0">
        {label}
      </Text>
      <Text size="sm" className="break-all">
        {value}
      </Text>
    </HStack>
  );
}

/** Expanded panel: everything needed to inspect a failed/pending deposit. */
function DepositDetails({deposit}: {deposit: AdminDepositRow}) {
  return (
    <VStack gap={2} width="100%">
      {deposit.errorMessage ? (
        <Banner status="error" title={deposit.errorMessage} />
      ) : null}
      <DetailRow label="Deposit ID" value={deposit.id} />
      <DetailRow label="Gateway" value={deposit.gateway} />
      {deposit.sessionId ? <DetailRow label="Session ID" value={deposit.sessionId} /> : null}
      {deposit.gatewayTransactionId ? (
        <DetailRow label="Gateway reference" value={deposit.gatewayTransactionId} />
      ) : null}
      {deposit.checkoutUrl ? <DetailRow label="Checkout URL" value={deposit.checkoutUrl} /> : null}
      <DetailRow label="Created" value={formatDateTime(deposit.createdAt)} />
      {deposit.completedAt ? (
        <DetailRow label="Completed" value={formatDateTime(deposit.completedAt)} />
      ) : null}
    </VStack>
  );
}

/** Approve button + confirm — only for deposits not yet completed. */
function ApproveAction({
  deposit,
  onError,
}: {
  deposit: AdminDepositRow;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isApproving, startTransition] = useTransition();

  if (deposit.status === 'completed') {
    return null;
  }

  function handleApprove() {
    onError(null);
    startTransition(async () => {
      const result = await approveAdminDeposit(deposit.id);
      setIsConfirmOpen(false);
      if (!result.success) {
        onError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <Button
        label="Approve"
        variant="secondary"
        size="sm"
        isDisabled={isApproving}
        onClick={() => setIsConfirmOpen(true)}
      />
      <AlertDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Approve this deposit?"
        description={`${formatAmount(deposit.amount, deposit.currency)} will be credited to ${deposit.username}'s balance without gateway verification. Only do this when the payment is confirmed externally.`}
        actionLabel="Approve + credit"
        isActionLoading={isApproving}
        onAction={handleApprove}
      />
    </>
  );
}

export function AdminDepositsTable({
  deposits,
  rowIndexStart,
  rowCount,
}: {
  deposits: AdminDepositRow[];
  rowIndexStart: number;
  rowCount: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const expansion = useTableRowExpansion<AdminDepositRow>({
    expandedKeys,
    onToggle: (key) => {
      setExpandedKeys((previous) => {
        const next = new Set(previous);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    getRowKey: (deposit) => deposit.id,
    renderExpanded: (deposit) => <DepositDetails deposit={deposit} />,
  });

  const columns: TableColumn<AdminDepositRow>[] = [
    {
      key: 'id',
      header: 'Deposit',
      width: proportional(1),
      renderCell: (deposit) => (
        <VStack gap={0.5}>
          <Text size="sm" weight="medium">
            {ticketRef(deposit.id)}
          </Text>
          <Text size="sm" color="secondary">
            {formatDateTime(deposit.createdAt)}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'username',
      header: 'User',
      width: proportional(1),
      renderCell: (deposit) => <Text size="sm">{deposit.username}</Text>,
    },
    {
      key: 'amount',
      header: 'Amount',
      width: pixel(110),
      align: 'end',
      renderCell: (deposit) => (
        <Text size="sm" hasTabularNumbers>
          {formatAmount(deposit.amount, deposit.currency)}
        </Text>
      ),
    },
    {
      key: 'gateway',
      header: 'Gateway',
      width: pixel(130),
      renderCell: (deposit) => (
        <Text size="sm" color="secondary">
          {deposit.gateway}
        </Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(130),
      renderCell: (deposit) => {
        const meta = STATUS_META[deposit.status];
        return (
          <HStack gap={2} vAlign="center">
            <StatusDot variant={meta.variant} label={meta.label} />
            <Text size="sm">{meta.label}</Text>
          </HStack>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: pixel(110),
      align: 'end',
      resizable: false,
      renderCell: (deposit) => (
        <HStack justify="end">
          <ApproveAction deposit={deposit} onError={setError} />
        </HStack>
      ),
    },
  ];

  return (
    <>
      {error ? <Banner status="error" title={error} /> : null}
      <Table
        data={deposits}
        columns={columns}
        idKey="id"
        density="compact"
        hasHover
        textOverflow="truncate"
        plugins={{expansion}}
        rowIndexStart={rowIndexStart}
        rowCount={rowCount}
      />
    </>
  );
}
