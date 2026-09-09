import {collections} from '@/lib/db';
import type {Order, UpstreamProvider} from '@/lib/database';
import {refundOrder} from '@/lib/upstream-order-api-call';

interface UpstreamStatusEntry {
  status?: string;
  remains?: string;
  error?: string;
}

/**
 * Sync orders against the upstream status API (`action=status`).
 * Takes up to 100 orders per upstream call; orders are grouped by provider,
 * so a larger mixed list just means more calls.
 *
 * Only terminal upstream states are handled: Completed -> completed,
 * Canceled -> refunded (with credit). Other statuses only refresh `remaining`.
 */
export async function updateOrderStatus(orders: Order[]): Promise<void> {
  const trackable = orders.filter((order) => order.upstreamOrderId);
  if (trackable.length === 0) {
    return;
  }

  const services = await collections.services
    .find({id: {$in: [...new Set(trackable.map((order) => order.serviceId))]}})
    .toArray();
  const upstreamByService = new Map(services.map((s) => [s.id, s.upstreamId]));

  const providers = await collections.upstreamProviders
    .find({id: {$in: [...new Set(services.map((s) => s.upstreamId))]}})
    .toArray();
  const providerById = new Map(providers.map((p) => [p.id, p]));

  const groups = new Map<string, Order[]>();
  for (const order of trackable) {
    const upstreamId = upstreamByService.get(order.serviceId);
    if (!upstreamId || !providerById.has(upstreamId)) {
      continue;
    }
    const group = groups.get(upstreamId) ?? [];
    group.push(order);
    groups.set(upstreamId, group);
  }

  for (const [providerId, groupOrders] of groups) {
    const provider = providerById.get(providerId);
    if (!provider?.apiUrl || !provider?.apiKey) {
      continue;
    }
    for (let i = 0; i < groupOrders.length; i += 100) {
      await syncChunk(provider, groupOrders.slice(i, i + 100));
    }
  }
}

async function syncChunk(provider: UpstreamProvider, orders: Order[]): Promise<void> {
  const params = new URLSearchParams({
    key: provider.apiKey,
    action: 'status',
    order: orders.map((order) => order.upstreamOrderId as string).join(','),
  });

  let data: Record<string, UpstreamStatusEntry> | null;
  try {
    const res = await fetch(`${provider.apiUrl}?${params.toString()}`, {
      method: 'POST',
      body: '',
    });
    data = await res.json().catch(() => null);
  } catch {
    return; // Transient failure; leave orders untouched so the next run retries.
  }
  if (!data) {
    return;
  }

  for (const order of orders) {
    const entry = data[order.upstreamOrderId as string];
    if (!entry || entry.error) {
      continue;
    }

    if (entry.status === 'Canceled') {
      await refundOrder(order);
      continue;
    }

    const set: Partial<Order> = {updatedAt: new Date().toISOString()};
    const remains = Number(entry.remains);
    if (Number.isFinite(remains)) {
      set.remaining = remains;
    }
    if (entry.status === 'Completed') {
      set.status = 'completed';
    }
    await collections.orders.updateOne({id: order.id}, {$set: set});
  }
}

export default updateOrderStatus;
