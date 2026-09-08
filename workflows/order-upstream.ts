import {submitOrderToUpstream} from './order-upstream-steps';

/**
 * Order fulfillment pipeline, enqueued by the createOrder server action once
 * the order is paid for and pending. The step either marks the order
 * processing (with its upstreamOrderId) or auto-refunds the user's balance
 * on failure.
 */
export async function processOrderUpstream(orderId: string) {
  'use workflow';

  const result = await submitOrderToUpstream(orderId);
  return {orderId, success: result.success, status: result.status};
}
