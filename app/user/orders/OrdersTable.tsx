'use client';

import {useState} from 'react';
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
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Button} from '@astryxdesign/core/Button';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';
import {Banner} from '@astryxdesign/core/Banner';

import type {OrderRow} from '@/actions/users/orders';
import {requestOrderCancel, requestOrderRefill} from '@/actions/users/orders';
import {formatAmount} from '@/app/user/add-funds/format';
import {formatTicketDate, ticketRef} from '@/app/components/support/ticketMeta';
import {ORDER_STATUS_DOT, ORDER_STATUS_LABELS} from '@/app/components/orders/orderMeta';

/** ProgressBar variants keyed by order status. */
const PROGRESS_VARIANT: Record<
  OrderRow['status'],
  'accent' | 'success' | 'neutral'
> = {
  pending: 'accent',
  processing: 'accent',
  completed: 'success',
  cancelled: 'neutral',
  refunded: 'neutral',
};

function isBarDisabled(status: OrderRow['status']): boolean {
  return status === 'cancelled' || status === 'refunded';
}

/** Compact bar + counts: delivery = quantity − remaining. */
function DeliveryCell({order}: {order: OrderRow}) {
  // Terminal financial states have no meaningful delivery progress.
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return (
      <Text size="sm" color="secondary">
        —
      </Text>
    );
  }
  const delivered = Math.max(0, order.quantity - order.remaining);
  return (
    <VStack gap={1} width="100%">
      <ProgressBar
        label={`Delivery progress for order ${ticketRef(order.id)}`}
        isLabelHidden
        value={delivered}
        max={order.quantity}
        variant={PROGRESS_VARIANT[order.status]}
        isIndeterminate={order.status === 'pending'}
        isDisabled={isBarDisabled(order.status)}
      />
      <Text size="sm" color="secondary" hasTabularNumbers>
        {order.status === 'pending'
          ? 'Waiting to start'
          : `${delivered.toLocaleString()} / ${order.quantity.toLocaleString()} delivered`}
      </Text>
    </VStack>
  );
}

/** Full-width panel revealed by the row's chevron: the order-form inputs. */
function OrderDetails({order}: {order: OrderRow}) {
  return (
    <VStack gap={2} width="100%">
      <Text size="sm" weight="semibold">
        Order inputs
      </Text>
      {order.inputs.length === 0 ? (
        <Text size="sm" color="secondary">
          No inputs were recorded for this order.
        </Text>
      ) : (
        order.inputs.map((input) => (
          <HStack key={`${input.label}-${input.value}`} gap={2} vAlign="start">
            <Text size="sm" color="secondary" className="w-40 shrink-0">
              {input.label}
            </Text>
            <Text size="sm" className="break-all">
              {input.value}
            </Text>
          </HStack>
        ))
      )}
    </VStack>
  );
}

/** Live statuses that support refill/cancel — terminal orders show no actions. */
function isLiveActionStatus(status: OrderRow['status']): boolean {
  return status === 'pending' || status === 'processing';
}

/** Per-row Refill/Cancel buttons, gated on service flags + live status. */
function OrderActions({order}: {order: OrderRow}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const showRefill = order.serviceRefill && isLiveActionStatus(order.status);
  const showCancel = order.serviceCancel && isLiveActionStatus(order.status);
  if (!showRefill && !showCancel) {
    return null;
  }

  async function handleRefill() {
    setError(null);
    const result = await requestOrderRefill(order.id);
    if (!result.success) {
      setError(result.error ?? 'Refill request failed.');
      return;
    }
    router.refresh();
  }

  async function handleCancel() {
    setIsCancelling(true);
    const result = await requestOrderCancel(order.id);
    setIsCancelling(false);
    if (!result.success) {
      setIsConfirmOpen(false);
      setError(result.error ?? 'Cancel request failed.');
      return;
    }
    setIsConfirmOpen(false);
    router.refresh();
  }

  return (
    <HStack gap={2} vAlign="center" wrap="wrap">
      {error ? <Banner status="error" title={error} /> : null}
      {showRefill ? (
        <Button label="Refill" variant="secondary" size="sm" clickAction={handleRefill} />
      ) : null}
      {showCancel ? (
        <Button
          label="Cancel"
          variant="destructive"
          size="sm"
          onClick={() => setIsConfirmOpen(true)}
        />
      ) : null}
      <AlertDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Cancel this order?"
        description="The remaining delivery will be stopped. This can't be undone."
        actionLabel="Cancel order"
        isActionLoading={isCancelling}
        onAction={() => {
          void handleCancel();
        }}
      />
    </HStack>
  );
}

/**
 * Dense order rows with a chevron that expands each row into its order-form
 * inputs. The delivery bar reads quantity vs remaining for the live states.
 */
export function OrdersTable({
  orders,
  rowIndexStart,
  rowCount,
}: {
  orders: OrderRow[];
  rowIndexStart: number;
  rowCount: number;
}) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const expansion = useTableRowExpansion<OrderRow>({
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
    getRowKey: (order) => order.id,
    renderExpanded: (order) => <OrderDetails order={order} />,
  });

  const columns: TableColumn<OrderRow>[] = [
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
      key: 'serviceName',
      header: 'Service',
      width: proportional(2),
      renderCell: (order) => <Text size="sm">{order.serviceName}</Text>,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      width: pixel(90),
      align: 'end',
      renderCell: (order) => (
        <Text size="sm" hasTabularNumbers>
          {order.quantity.toLocaleString()}
        </Text>
      ),
    },
    {
      key: 'delivery',
      header: 'Delivery',
      width: pixel(180),
      renderCell: (order) => <DeliveryCell order={order} />,
    },
    {
      key: 'totalPrice',
      header: 'Total',
      width: pixel(110),
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
    // Omit the column entirely when no row on this page has a live action —
    // an empty "Actions" header with blank cells is clutter.
    ...(orders.some(
      (order) =>
        (order.serviceRefill || order.serviceCancel) && isLiveActionStatus(order.status)
    )
      ? [
          {
            key: 'actions',
            header: 'Actions',
            width: pixel(190),
            renderCell: (order: OrderRow) => <OrderActions order={order} />,
          } satisfies TableColumn<OrderRow>,
        ]
      : []),
  ];

  return (
    <Table
      data={orders}
      columns={columns}
      idKey="id"
      density="compact"
      hasHover
      textOverflow="truncate"
      plugins={{expansion}}
      rowIndexStart={rowIndexStart}
      rowCount={rowCount}
    />
  );
}
