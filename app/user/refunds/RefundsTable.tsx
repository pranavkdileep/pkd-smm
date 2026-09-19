'use client';

import {
  Table,
  proportional,
  pixel,
  type TableColumn,
} from '@astryxdesign/core/Table';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';

import type {OrderRow} from '@/actions/users/orders';
import {formatAmount} from '@/app/user/add-funds/format';
import {formatTicketDate, ticketRef} from '@/app/components/support/ticketMeta';

/** Dense refund rows — every row is the same status, so no state column. */
export function RefundsTable({
  refunds,
  rowIndexStart,
  rowCount,
}: {
  refunds: OrderRow[];
  rowIndexStart: number;
  rowCount: number;
}) {
  const columns: TableColumn<OrderRow>[] = [
    {
      key: 'id',
      header: 'Order',
      width: proportional(1),
      renderCell: (refund) => (
        <VStack gap={0.5}>
          <Text size="sm" weight="medium">
            {ticketRef(refund.id)}
          </Text>
          <Text size="sm" color="secondary">
            Placed {formatTicketDate(refund.createdAt)}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'serviceName',
      header: 'Service',
      width: proportional(2),
      renderCell: (refund) => <Text size="sm">{refund.serviceName}</Text>,
    },
    {
      key: 'totalPrice',
      header: 'Amount refunded',
      width: pixel(150),
      align: 'end',
      renderCell: (refund) => (
        <Text size="sm" hasTabularNumbers>
          {formatAmount(refund.totalPrice)}
        </Text>
      ),
    },
    {
      key: 'refundedAt',
      header: 'Refunded',
      width: pixel(150),
      // Plain date: a refund timestamp is not an error state, so no StatusDot.
      renderCell: (refund) => (
        <Text size="sm" color="secondary">
          {formatTicketDate(refund.updatedAt)}
        </Text>
      ),
    },
  ];

  return (
    <Table
      data={refunds}
      columns={columns}
      idKey="id"
      density="compact"
      dividers="rows"
      textOverflow="truncate"
      rowIndexStart={rowIndexStart}
      rowCount={rowCount}
    />
  );
}
