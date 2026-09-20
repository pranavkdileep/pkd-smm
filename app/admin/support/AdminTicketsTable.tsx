'use client';

import Link from 'next/link';
import { Table, proportional, pixel, type TableColumn } from '@astryxdesign/core/Table';
import { HStack } from '@astryxdesign/core/HStack';
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Token } from '@astryxdesign/core/Token';

import type { AdminSupportTicketRow } from '@/actions/admin/support';
import {
  CATEGORY_LABELS,
  CATEGORY_TOKEN_COLORS,
  PRIORITY_LABELS,
  PRIORITY_TOKEN_COLORS,
  formatTicketDate,
  ticketRef,
} from '@/app/components/support/ticketMeta';

/**
 * Dense admin ticket rows  title links into the conversation, the requester
 * is resolved inline, and category/priority read as tokens, status as a dot.
 */
export function AdminTicketsTable({ tickets }: { tickets: AdminSupportTicketRow[] }) {
  const columns: TableColumn<AdminSupportTicketRow>[] = [
    {
      key: 'title',
      header: 'Ticket',
      width: proportional(2),
      renderCell: (ticket) => (
        <VStack gap={0.5}>
          <Link
            href={`/admin/support/${ticket.id}`}
            className="text-sm font-medium text-primary hover:text-blue-vivid"
          >
            {ticket.title}
          </Link>
          <Text size="sm" color="secondary">
            {ticketRef(ticket.id)}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'requester',
      header: 'Requester',
      width: proportional(1),
      renderCell: (ticket) => (
        <VStack gap={0.5}>
          <Text weight="semibold">{ticket.requesterUsername}</Text>
          <Text size="sm" color="secondary">
            {ticket.requesterEmail}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: pixel(110),
      renderCell: (ticket) => (
        <Token
          label={CATEGORY_LABELS[ticket.category] ?? ticket.category}
          color={CATEGORY_TOKEN_COLORS[ticket.category] ?? 'gray'}
          size="sm"
        />
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      width: pixel(100),
      renderCell: (ticket) => (
        <Token
          label={PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
          color={PRIORITY_TOKEN_COLORS[ticket.priority] ?? 'gray'}
          size="sm"
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(110),
      renderCell: (ticket) => (
        <HStack gap={2} vAlign="center">
          <StatusDot
            variant={ticket.status === 'open' ? 'accent' : 'neutral'}
            label={ticket.status === 'open' ? 'Open' : 'Closed'}
          />
          <Text size="sm">{ticket.status === 'open' ? 'Open' : 'Closed'}</Text>
        </HStack>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      width: pixel(130),
      renderCell: (ticket) => (
        <Text size="sm" color="secondary">
          {formatTicketDate(ticket.updatedAt)}
        </Text>
      ),
    },
  ];

  return (
    <Table
      data={tickets}
      columns={columns}
      idKey="id"
      density="compact"
      hasHover
      textOverflow="truncate"
    />
  );
}
