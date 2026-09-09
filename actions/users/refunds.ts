'use server';

import {listOrders, type ListOrdersResult} from '@/actions/users/orders';

/**
 * Lists the signed-in user's refunded orders — the refund ledger with service
 * context (the transactions collection has no order link). Pagination and
 * auth live in listOrders.
 */
export async function listRefunds(input: {
  page?: number;
  pageSize?: number;
}): Promise<ListOrdersResult> {
  return listOrders({...input, status: 'refunded'});
}
