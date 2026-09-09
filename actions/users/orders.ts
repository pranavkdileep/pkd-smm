'use server';

import {randomUUID} from 'node:crypto';
import {start} from 'workflow/api';
import {getCurrentUser} from '@/actions/auth/session';
import {collections} from '@/lib/db';
import type {Order, OrderStatus, Service, Transaction} from '@/lib/database';
import {ORDER_STATUSES} from '@/lib/database';
import {processOrderUpstream} from '@/workflows/order-upstream';
import {refreshOrderStatusUpstream} from '@/workflows/order-status-sync';

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
    // Remaining is refreshed by the order status-sync workflow.
    remaining: quantity,
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

/**
 * Triggers an upstream status sync for the given orders. Only the caller's
 * own pending/processing orders are enqueued — completed, cancelled and
 * refunded orders are never touched. Returns the live order ids accepted.
 */
export async function refreshOrderStatuses(orderIds: string[]): Promise<{
  started: boolean;
  orderIds: string[];
}> {
  const user = await getCurrentUser();
  if (!user || !Array.isArray(orderIds) || orderIds.length === 0) {
    return {started: false, orderIds: []};
  }
  const ids = [...new Set(orderIds.filter((id) => typeof id === 'string' && id))].slice(0, 100);
  if (ids.length === 0) {
    return {started: false, orderIds: []};
  }
  const live = await collections.orders
    .find({id: {$in: ids}, userId: user.id, status: {$in: ['pending', 'processing']}})
    .toArray();
  if (live.length === 0) {
    return {started: false, orderIds: []};
  }
  const liveIds = live.map((order) => order.id);
  await start(refreshOrderStatusUpstream, [liveIds]);
  return {started: true, orderIds: liveIds};
}

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/**
 * POSTs one action call to an upstream panel API (form-urlencoded).
 * Success is HTTP 200 with no `error` field — response shapes vary by action.
 */
async function callUpstreamAction(
  provider: {apiUrl: string; apiKey: string},
  params: Record<string, string>,
): Promise<{success: boolean; error?: string}> {
  try {
    const res = await fetch(provider.apiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({key: provider.apiKey, ...params}).toString(),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.error) {
      return {
        success: false,
        error: data?.error ? String(data.error) : `Upstream request failed (HTTP ${res.status}).`,
      };
    }
    return {success: true};
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error calling upstream API.',
    };
  }
}

interface OrderActionTarget {
  upstreamOrderId: string;
  provider: {apiUrl: string; apiKey: string};
}

/** Guards shared by refill/cancel: own order, live status, service flag, submitted upstream. */
async function loadOrderActionTarget(
  orderId: unknown,
  flag: 'refill' | 'cancel',
): Promise<{target?: OrderActionTarget; error?: string}> {
  const user = await getCurrentUser();
  if (!user) {
    return {error: 'You must be signed in.'};
  }
  if (typeof orderId !== 'string' || !orderId) {
    return {error: 'Invalid order.'};
  }
  const order = await collections.orders.findOne({id: orderId, userId: user.id});
  if (!order) {
    return {error: 'Order not found.'};
  }
  if (order.status !== 'pending' && order.status !== 'processing') {
    return {error: 'Only pending or processing orders support this action.'};
  }
  const service = await collections.services.findOne({id: order.serviceId});
  if (!service?.[flag]) {
    return {
      error:
        flag === 'refill'
          ? 'Refills are not available for this service.'
          : 'Cancellation is not available for this service.',
    };
  }
  if (!order.upstreamOrderId) {
    return {error: 'This order has not been sent upstream yet.'};
  }
  const provider = await collections.upstreamProviders.findOne({id: service.upstreamId});
  if (!provider?.apiUrl || !provider?.apiKey) {
    return {error: 'Upstream provider not configured.'};
  }
  return {target: {upstreamOrderId: order.upstreamOrderId, provider}};
}

/** Asks upstream to refill a live order (`action=refill&order=<upstream id>`). */
export async function requestOrderRefill(orderId: string): Promise<{success: boolean; error?: string}> {
  const {target, error} = await loadOrderActionTarget(orderId, 'refill');
  if (!target) {
    return {success: false, error};
  }
  // ponytail: no local state change — a refill only tops up upstream; progress
  // surfaces via the existing status-sync on next page load.
  return callUpstreamAction(target.provider, {action: 'refill', order: target.upstreamOrderId});
}

/** Asks upstream to cancel a live order (`action=cancel&orders=<upstream id>`). */
export async function requestOrderCancel(orderId: string): Promise<{success: boolean; error?: string}> {
  const {target, error} = await loadOrderActionTarget(orderId, 'cancel');
  if (!target) {
    return {success: false, error};
  }
  // ponytail: local status untouched — an upstream Canceled flows to refunded
  // via updateOrderStatus on the next sync; mark locally only if cancel
  // latency ever matters.
  return callUpstreamAction(target.provider, {action: 'cancel', orders: target.upstreamOrderId});
}

/** Sanitized order row for the user dashboard — no upstream ids, no userId. */
export interface OrderRow extends Record<string, unknown> {
  id: string;
  /** Service display name; 'Unknown service' if the service was deleted. */
  serviceName: string;
  quantity: number;
  remaining: number;
  totalPrice: number;
  status: OrderStatus;
  /** Raw service flag — the table combines it with a live-status check. */
  serviceRefill: boolean;
  /** Raw service flag — the table combines it with a live-status check. */
  serviceCancel: boolean;
  /** Order-form fields as the user filled them, with display labels. */
  inputs: {label: string; value: string}[];
  createdAt: string;
  updatedAt: string;
}

export interface ListOrdersResult {
  orders: OrderRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function clampPageSize(value: number | undefined): number {
  if (!Number.isFinite(value) || (value ?? 0) < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(value as number, MAX_PAGE_SIZE);
}

function clampPage(value: number | undefined, totalPages: number): number {
  if (!Number.isFinite(value) || (value ?? 1) < 1) {
    return 1;
  }
  return Math.min(value as number, totalPages);
}

/**
 * Lists the signed-in user's orders, newest first, with pagination and an
 * optional status filter. Returns an empty result when unauthenticated (the
 * layout redirects to /login). An unknown status matches nothing, so a stale
 * client filter shows an empty page instead of leaking other users' orders.
 */
export async function listOrders(input: {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}): Promise<ListOrdersResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {orders: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 1};
  }

  // ponytail: status is validated against ORDER_STATUSES via the TS type, but
  // server actions accept any runtime payload — reject unknowns at runtime too.
  const filter: Record<string, unknown> = {userId: user.id};
  if (input.status !== undefined) {
    if (!ORDER_STATUSES.includes(input.status)) {
      return {orders: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 1};
    }
    filter.status = input.status;
  }

  const pageSize = clampPageSize(input.pageSize);
  const total = await collections.orders.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const orders = await collections.orders
    .find(filter, {
      sort: {createdAt: -1, id: -1},
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  // One query for the page's service names instead of a $lookup per row.
  const serviceIds = [...new Set(orders.map((order) => order.serviceId))];
  const services = serviceIds.length
    ? await collections.services.find({id: {$in: serviceIds}}).toArray()
    : ([] as Service[]);
  const serviceById = new Map(services.map((service) => [service.id, service]));

  return {
    orders: orders.map((order) => {
      const service = serviceById.get(order.serviceId);
      // Slug -> display label, straight from the service's form declaration.
      const inputs = Object.entries(order.inputs ?? {}).map(([slug, value]) => ({
        label: service?.inputs?.[slug] ?? slug,
        value,
      }));
      return {
        id: order.id,
        serviceName: service?.name ?? 'Unknown service',
        quantity: order.quantity,
        // ponytail: ?? guards legacy docs created before `remaining` was seeded.
        remaining: order.remaining ?? order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        serviceRefill: service?.refill === true,
        serviceCancel: service?.cancel === true,
        inputs,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    }),
    total,
    page,
    pageSize,
    totalPages,
  };
}
