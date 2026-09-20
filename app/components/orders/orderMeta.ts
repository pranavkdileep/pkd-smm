import type { OrderStatus } from '@/lib/database';

/** Display labels for order statuses. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

/** StatusDot variants per status  shape comes from the adjacent label text. */
export const ORDER_STATUS_DOT: Record<
  OrderStatus,
  'success' | 'warning' | 'error' | 'accent' | 'neutral'
> = {
  pending: 'warning',
  processing: 'accent',
  completed: 'success',
  cancelled: 'neutral',
  // Refunds are financial settlements, not operational failures  amber, not red.
  refunded: 'warning',
};
