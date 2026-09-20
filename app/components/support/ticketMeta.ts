import type { SupportTicketCategory, SupportTicketPriority } from '@/lib/database';

/** Display labels for ticket categories. */
export const CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  order: 'Order',
  payment: 'Payment',
  refund: 'Refund',
  account: 'Account',
  technical: 'Technical',
  other: 'Other',
};

/** Token colors per category  one hue per category keeps the list scannable. */
export const CATEGORY_TOKEN_COLORS: Record<
  SupportTicketCategory,
  'blue' | 'teal' | 'orange' | 'purple' | 'cyan' | 'gray'
> = {
  order: 'blue',
  payment: 'teal',
  refund: 'orange',
  account: 'purple',
  technical: 'cyan',
  other: 'gray',
};

export const PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_TOKEN_COLORS: Record<SupportTicketPriority, 'gray' | 'yellow' | 'red'> = {
  low: 'gray',
  medium: 'yellow',
  high: 'red',
};

/** Short, human-friendly reference for a ticket id. */
export function ticketRef(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

function isValidDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

/** "Sep 7, 2026"  for list columns and header meta. */
export function formatTicketDate(value: string): string {
  if (!isValidDate(value)) {
    return '';
  }
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** "Sep 7, 2026, 2:30 PM"  for conversation timestamps. */
export function formatCommentTimestamp(value: string): string {
  if (!isValidDate(value)) {
    return '';
  }
  return new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
