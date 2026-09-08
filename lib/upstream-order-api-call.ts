import {randomUUID} from 'node:crypto';
import {collections} from '@/lib/db';
import type {Order, Transaction} from '@/lib/database';

export interface UpstreamOrderResult {
  success: boolean;
  status: 'processing' | 'refunded';
  upstreamOrderId?: string;
  error?: string;
}

export async function callUpstreamOrderApi(
  orderOrId: Order | string,
  inputs?: Record<string, unknown>,
): Promise<UpstreamOrderResult> {
  const order =
    typeof orderOrId === 'string'
      ? await collections.orders.findOne({id: orderOrId})
      : orderOrId;

  if (!order) {
    return {success: false, status: 'refunded', error: 'Order not found.'};
  }

  const markRefunded = async (error: string): Promise<UpstreamOrderResult> => {
    const updatedAt = new Date().toISOString();
    // Guard on status prevents double-crediting if this runs twice for the same order.
    const refunded = await collections.orders.findOneAndUpdate(
      {id: order.id, status: {$ne: 'refunded'}},
      {$set: {status: 'refunded', updatedAt}},
    );

    if (refunded) {
      // ponytail: order update + credit are not one transaction; a crash between
      // them can strand a refunded order without credit. Reconcile manually, or
      // wrap in a Mongo session/transaction when money paths demand it.
      const transaction: Transaction = {
        id: randomUUID(),
        userId: order.userId,
        type: 'refund',
        amount: order.totalPrice,
        createdAt: updatedAt,
      };
      await collections.transactions.insertOne(transaction);
      await collections.users.updateOne(
        {id: order.userId},
        {$inc: {balance: order.totalPrice}},
      );
    }

    order.status = 'refunded';
    order.updatedAt = updatedAt;
    return {success: false, status: 'refunded', error};
  };

  const service = await collections.services.findOne({id: order.serviceId});
  if (!service) {
    return markRefunded('Service not found.');
  }

  const provider = await collections.upstreamProviders.findOne({id: service.upstreamId});
  if (!provider?.apiUrl || !provider?.apiKey) {
    return markRefunded('Upstream provider not configured.');
  }

  const mergedInputs: Record<string, unknown> = {
    ...(order.inputs ?? {}),
    ...(inputs ?? {}),
  };

  const params = new URLSearchParams({
    key: provider.apiKey,
    action: 'add',
    service: service.upstreamServiceId,
    quantity: String(order.quantity),
  });

  const orderRecord = order as unknown as Record<string, unknown>;
  const link = mergedInputs.link ?? orderRecord.link;
  if (link != null) {
    params.set('link', String(link));
  }

  const comments = mergedInputs.comments ?? orderRecord.comments;
  if (comments != null) {
    params.set('comments', Array.isArray(comments) ? comments.join('\n') : String(comments));
  }

  for (const [key, value] of Object.entries(mergedInputs)) {
    if (!params.has(key) && value != null) {
      params.set(key, Array.isArray(value) ? value.join('\n') : String(value));
    }
  }

  try {
    const res = await fetch(provider.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.order != null) {
      const upstreamOrderId = String(data.order);
      const updatedAt = new Date().toISOString();
      await collections.orders.updateOne(
        {id: order.id},
        {$set: {upstreamOrderId, status: 'processing', updatedAt}},
      );
      order.upstreamOrderId = upstreamOrderId;
      order.status = 'processing';
      order.updatedAt = updatedAt;

      return {
        success: true,
        status: 'processing',
        upstreamOrderId,
      };
    }

    const errorMsg =
      (data && (data.error || data.message)) ||
      `Upstream request failed (HTTP ${res.status}).`;

    return markRefunded(String(errorMsg));
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error calling upstream API.';
    return markRefunded(errorMsg);
  }
}

export const callUpstreamOrder = callUpstreamOrderApi;
export default callUpstreamOrderApi;
