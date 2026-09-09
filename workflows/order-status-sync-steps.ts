import {collections} from '@/lib/db';
import {updateOrderStatus} from '@/lib/update-order-status';

/**
 * Syncs the given orders against their upstream providers. Runs as a workflow
 * step (full Node runtime, auto-retry on throw).
 */
export async function syncOrderStatuses(orderIds: string[]): Promise<{synced: number}> {
  'use step';

  if (orderIds.length === 0) {
    return {synced: 0};
  }
  const orders = await collections.orders.find({id: {$in: orderIds}}).toArray();
  await updateOrderStatus(orders);
  return {synced: orders.length};
}
