import { callUpstreamOrderApi, type UpstreamOrderResult } from '@/lib/upstream-order-api-call';

/**
 * Forwards a pending order to its upstream provider. Runs as a workflow step
 * (full Node runtime, auto-retry on throw). Upstream/network errors are
 * swallowed by callUpstreamOrderApi and turned into auto-refunds, so retries
 * only fire on infrastructure failures  the pending guard in that function
 * keeps a retry from double-submitting.
 */
export async function submitOrderToUpstream(orderId: string): Promise<UpstreamOrderResult> {
  'use step';

  return callUpstreamOrderApi(orderId);
}
