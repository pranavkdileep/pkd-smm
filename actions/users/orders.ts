'use server';

import {randomUUID} from 'node:crypto';
import {start} from 'workflow/api';
import {getCurrentUser} from '@/actions/auth/session';
import {collections} from '@/lib/db';
import type {Order, Transaction} from '@/lib/database';
import {processOrderUpstream} from '@/workflows/order-upstream';

export interface CreateOrderInput {
  serviceId: string;
  quantity: number;
  /** Values for the order-form fields declared on the service (slug -> value). */
  inputs?: Record<string, string>;
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

/**
 * Server action to place a new order: validates the order form, atomically
 * debits the user's balance, records the order (pending) and an 'order'
 * transaction, then enqueues the upstream fulfillment workflow.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {success: false, error: 'You must be signed in to place an order.'};
  }
  if (user.status === 'banned') {
    return {success: false, error: 'Your account is suspended.'};
  }

  const {serviceId, quantity} = input;
  if (typeof serviceId !== 'string' || !serviceId.trim()) {
    return {success: false, error: 'Please choose a service.'};
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return {success: false, error: 'Quantity must be a whole number of 1 or more.'};
  }

  const service = await collections.services.findOne({id: serviceId, status: 'active'});
  if (!service) {
    return {success: false, error: 'This service is not available.'};
  }
  if (quantity < service.minOrder || quantity > service.maxOrder) {
    return {
      success: false,
      error: `Quantity must be between ${service.minOrder.toLocaleString()} and ${service.maxOrder.toLocaleString()}.`,
    };
  }

  // Keep only the fields the service declares — client-supplied extras are
  // dropped, every declared field is required and trimmed.
  const inputs: Record<string, string> = {};
  for (const [key, label] of Object.entries(service.inputs ?? {})) {
    const value = input.inputs?.[key];
    if (typeof value !== 'string' || !value.trim()) {
      return {success: false, error: `Please fill in the "${label}" field.`};
    }
    inputs[key] = value.trim();
  }

  // Service price is per 1K; rounded up to the paisa so tiny orders never bill 0.
  const totalPrice = Math.ceil((service.price * quantity) / 10) / 100;

  // Atomic debit — the balance guard makes concurrent orders fail cleanly
  // instead of double-spending.
  const debited = await collections.users.findOneAndUpdate(
    {id: user.id, balance: {$gte: totalPrice}},
    {$inc: {balance: -totalPrice}}
  );
  if (!debited) {
    return {success: false, error: 'Insufficient balance. Please add funds first.'};
  }

  const orderId = randomUUID();
  const now = new Date().toISOString();
  const order: Order = {
    id: orderId,
    userId: user.id,
    serviceId: service.id,
    quantity,
    totalPrice,
    status: 'pending',
    inputs,
    createdAt: now,
    updatedAt: now,
  };
  const transaction: Transaction = {
    id: randomUUID(),
    userId: user.id,
    type: 'order',
    // Negative so the ledger sums to the balance: deposits/refunds in, orders out.
    amount: -totalPrice,
    createdAt: now,
  };

  // ponytail: debit + inserts are not one Mongo transaction; a crash in between
  // can debit balance without an order. Reconcile manually, or wrap in a
  // session/transaction when money paths demand it.
  await collections.orders.insertOne(order);
  await collections.transactions.insertOne(transaction);

  // Forwards the order to its upstream provider in the background — it flips
  // the order to processing or auto-refunds the balance on failure.
  await start(processOrderUpstream, [orderId]);

  return {success: true, orderId};
}
