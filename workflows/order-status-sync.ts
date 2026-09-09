import {syncOrderStatuses} from './order-status-sync-steps';

/**
 * Refreshes live orders (pending/processing) against upstream status APIs.
 * Enqueued by the refreshOrderStatuses server action when the orders page
 * loads with trackable orders on the current page.
 */
export async function refreshOrderStatusUpstream(orderIds: string[]) {
  'use workflow';

  const result = await syncOrderStatuses(orderIds);
  return {orderIds, synced: result.synced};
}
