'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {Table, proportional, pixel, type TableColumn} from '@astryxdesign/core/Table';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Button} from '@astryxdesign/core/Button';
import {Selector} from '@astryxdesign/core/Selector';
import {Banner} from '@astryxdesign/core/Banner';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';

import {
  cancelAndRefundOrder,
  setAdminOrderStatus,
  syncAdminOrderStatus,
  type AdminOrderRow,
} from '@/actions/admin/orders';
import {ORDER_STATUSES, type OrderStatus} from '@/lib/database';
import {formatAmount} from '@/app/user/add-funds/format';
import {formatTicketDate, ticketRef} from '@/app/components/support/ticketMeta';
import {ORDER_STATUS_DOT, ORDER_STATUS_LABELS} from '@/app/components/orders/orderMeta';

// 'refunded' is excluded on purpose — refunding must credit the balance, which
// only the Cancel + refund action (refundOrder) does.
const OVERRIDE_OPTIONS = ORDER_STATUSES.filter((status) => status !== 'refunded').map(
  (value) => ({value, label: ORDER_STATUS_LABELS[value]}),
);

function isLive(status: OrderStatus): boolean {
  return status === 'pending' || status === 'processing';
}

/** Per-row actions: status override, upstream re-sync, cancel + refund. */
function OrderActions({order, onError}: {order: AdminOrderRow; onError: (e: string | null) => void}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  function run(action: () => Promise<{success: boolean; error?: string}>) {
    onError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        onError(result.error ?? 'Action failed.');
        return;
      }
      router.refresh();
    });
  }

  async function handleCancelRefund() {
    setIsCancelling(true);
    onError(null);
    const result = await cancelAndRefundOrder(order.id);
    setIsCancelling(false);
    setIsConfirmOpen(false);
    if (!result.success) {
      onError(result.error ?? 'Cancel failed.');
      return;
    }
    router.refresh();
  }

  return (
    <HStack gap={2} vAlign="center" wrap="wrap">
      <Selector
        label={`Set status for order ${ticketRef(order.id)}`}
        isLabelHidden
        options={OVERRIDE_OPTIONS}
        value={order.status === 'refunded' ? '' : order.status}
        onChange={(next) => {
          if (next && next !== order.status) {
            run(() => setAdminOrderStatus(order.id, next as OrderStatus));
          }
        }}
        width={130}
        isDisabled={isPending}
      />
      {order.upstreamOrderId && isLive(order.status) ? (
        <Button
          label="Sync"
          variant="secondary"
          size="sm"
          isDisabled={isPending}
          onClick={() => run(() => syncAdminOrderStatus(order.id))}
        />
      ) : null}
      {isLive(order.status) ? (
        <Button
          label="Cancel + refund"
          variant="destructive"
          size="sm"
          isDisabled={isPending}
          onClick={() => setIsConfirmOpen(true)}
        />
      ) : null}
      <AlertDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Cancel and refund this order?"
        description={`Upstream cancellation is attempted, then ${formatAmount(order.totalPrice)} is credited back to ${order.username}'s balance. This can't be undone.`}
        actionLabel="Cancel + refund"
        isActionLoading={isCancelling}
        onAction={() => {
          void handleCancelRefund();
        }}
      />
    </HStack>
  );
}

export function AdminOrdersTable({
  orders,
  rowIndexStart,
  rowCount,
}: {
  orders: AdminOrderRow[];
  rowIndexStart: number;
  rowCount: number;
}) {
  const [error, setError] = useState<string | null>(null);

  const columns: TableColumn<AdminOrderRow>[] = [
    {
      key: 'id',
      header: 'Order',
      width: proportional(1),
      renderCell: (order) => (
        <VStack gap={0.5}>
          <Text size="sm" weight="medium">
            {ticketRef(order.id)}
          </Text>
          <Text size="sm" color="secondary">
            {formatTicketDate(order.createdAt)}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'username',
      header: 'User',
      width: proportional(1),
      renderCell: (order) => <Text size="sm">{order.username}</Text>,
    },
    {
      key: 'serviceName',
      header: 'Service',
      width: proportional(2),
      renderCell: (order) => <Text size="sm">{order.serviceName}</Text>,
    },
    {
      key: 'quantity',
      header: 'Qty / left',
      width: pixel(110),
      align: 'end',
      renderCell: (order) => (
        <Text size="sm" hasTabularNumbers>
          {order.quantity.toLocaleString()} / {order.remaining.toLocaleString()}
        </Text>
      ),
    },
    {
      key: 'totalPrice',
      header: 'Total',
      width: pixel(100),
      align: 'end',
      renderCell: (order) => (
        <Text size="sm" hasTabularNumbers>
          {formatAmount(order.totalPrice)}
        </Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(130),
      renderCell: (order) => (
        <HStack gap={2} vAlign="center">
          <StatusDot
            variant={ORDER_STATUS_DOT[order.status]}
            label={ORDER_STATUS_LABELS[order.status]}
          />
          <Text size="sm">{ORDER_STATUS_LABELS[order.status]}</Text>
        </HStack>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: pixel(320),
      renderCell: (order) => <OrderActions order={order} onError={setError} />,
    },
  ];

  return (
    <>
      {error ? <Banner status="error" title={error} /> : null}
      <Table
        data={orders}
        columns={columns}
        idKey="id"
        density="compact"
        hasHover
        textOverflow="truncate"
        rowIndexStart={rowIndexStart}
        rowCount={rowCount}
      />
    </>
  );
}
