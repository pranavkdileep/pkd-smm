'use server';

import { revalidatePath } from 'next/cache';

import { collections } from '@/lib/db';
import {
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
  type Service,
} from '@/lib/database';
import { getSession } from '@/actions/auth/session';
import { refundOrder } from '@/lib/upstream-order-api-call';
import { updateOrderStatus } from '@/lib/update-order-status';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/** Order row for the admin list, with user and service names resolved. */
export interface AdminOrderRow extends Record<string, unknown> {
  id: string;
  upstreamOrderId: string | null;
  username: string;
  serviceName: string;
  quantity: number;
  remaining: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminOrdersResult {
  orders: AdminOrderRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type MutationResult = { success: true } | { success: false; error: string };

async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === 'admin';
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

/** Filter by status plus a search that matches order ids or usernames. */
async function buildFilter(input: {
  search?: string;
  status?: string;
}): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};

  if (input.status && (ORDER_STATUSES as readonly string[]).includes(input.status)) {
    filter.status = input.status;
  }

  const search = (input.search ?? '').trim();
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    const matchingUsers = await collections.users
      .find({ username: pattern }, { projection: { id: 1 } })
      .toArray();
    filter.$or = [{ id: pattern }, { userId: { $in: matchingUsers.map((user) => user.id) } }];
  }

  return filter;
}

/** Resolves usernames and service names for a page of orders in two queries. */
async function toRows(orders: Order[]): Promise<AdminOrderRow[]> {
  const userIds = [...new Set(orders.map((order) => order.userId))];
  const serviceIds = [...new Set(orders.map((order) => order.serviceId))];

  const [users, services] = await Promise.all([
    userIds.length
      ? collections.users.find({ id: { $in: userIds } }, { projection: { id: 1, username: 1 } }).toArray()
      : Promise.resolve([]),
    serviceIds.length
      ? collections.services.find({ id: { $in: serviceIds } }).toArray()
      : Promise.resolve([] as Service[]),
  ]);
  const usernameById = new Map(users.map((user) => [user.id, user.username]));
  const serviceById = new Map(services.map((service) => [service.id, service]));

  return orders.map((order) => ({
    id: order.id,
    upstreamOrderId: order.upstreamOrderId ?? null,
    username: usernameById.get(order.userId) ?? 'Deleted user',
    serviceName: serviceById.get(order.serviceId)?.name ?? 'Unknown service',
    quantity: order.quantity,
    remaining: order.remaining ?? order.quantity,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
}

/** Lists all orders across users, newest first. Empty result for non-admins. */
export async function listAdminOrders(input: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<ListAdminOrdersResult> {
  if (!(await isAdmin())) {
    return { orders: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 1 };
  }

  const filter = await buildFilter(input);
  const pageSize = clampPageSize(input.pageSize);

  const total = await collections.orders.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const orders = await collections.orders
    .find(filter, {
      sort: { createdAt: -1, id: -1 },
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  return { orders: await toRows(orders), total, page, pageSize, totalPages };
}

/**
 * Manual status override. Never touches the balance  'refunded' is excluded
 * because that transition must credit the user, which only cancelAndRefundOrder
 * (via refundOrder) does.
 */
export async function setAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }
  if (!ORDER_STATUSES.includes(status) || status === 'refunded') {
    return { success: false, error: 'Invalid status. Use Cancel + refund to refund an order.' };
  }

  const result = await collections.orders.updateOne(
    { id: orderId },
    { $set: { status, updatedAt: new Date().toISOString() } },
  );
  if (result.matchedCount === 0) {
    return { success: false, error: 'Order not found.' };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

/**
 * Cancels a live order and refunds its full price to the user's balance.
 * Best-effort upstream cancel first (so the provider stops billing/delivering),
 * then refundOrder  which guards against double credit.
 */
export async function cancelAndRefundOrder(orderId: string): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }

  const order = await collections.orders.findOne({ id: orderId });
  if (!order) {
    return { success: false, error: 'Order not found.' };
  }
  if (order.status !== 'pending' && order.status !== 'processing') {
    return { success: false, error: 'Only pending or processing orders can be cancelled.' };
  }

  // ponytail: upstream cancel failure is ignored  the local refund is the
  // guarantee; a stuck upstream order gets caught by the next status sync.
  if (order.upstreamOrderId) {
    const service = await collections.services.findOne({ id: order.serviceId });
    const provider = service
      ? await collections.upstreamProviders.findOne({ id: service.upstreamId })
      : null;
    if (provider?.apiUrl && provider?.apiKey) {
      try {
        await fetch(provider.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            key: provider.apiKey,
            action: 'cancel',
            orders: order.upstreamOrderId,
          }).toString(),
        });
      } catch {
        // See ponytail note above.
      }
    }
  }

  const refunded = await refundOrder(order);
  if (!refunded) {
    return { success: false, error: 'Order was already refunded.' };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

/** Re-syncs one order against its upstream provider's status API. */
export async function syncAdminOrderStatus(orderId: string): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }

  const order = await collections.orders.findOne({ id: orderId });
  if (!order) {
    return { success: false, error: 'Order not found.' };
  }
  if (!order.upstreamOrderId) {
    return { success: false, error: 'This order has not been sent upstream yet.' };
  }

  await updateOrderStatus([order]);

  revalidatePath('/admin/orders');
  return { success: true };
}
