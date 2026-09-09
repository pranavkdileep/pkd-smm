'use client';

import {
  Table,
  proportional,
  pixel,
  type TableColumn,
} from '@astryxdesign/core/Table';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';

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
      renderCell: (refund) => (
        <HStack gap={2} vAlign="center">
          <StatusDot variant="error" label="Refunded" />
          <Text size="sm" color="secondary">
            {formatTicketDate(refund.updatedAt)}
          </Text>
        </HStack>
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
