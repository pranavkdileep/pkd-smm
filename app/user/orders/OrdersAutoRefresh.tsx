'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';

import {listOrders, refreshOrderStatuses, type OrderRow} from '@/actions/users/orders';
import type {OrderStatus} from '@/lib/database';

interface Tracked {
  id: string;
  status: OrderStatus;
  remaining: number;
  updatedAt: string;
}

/**
 * After the orders page loads, syncs this page's live orders (pending /
 * processing) upstream, shows an updating bar, and polls the page until a
 * tracked order changes — then refreshes. Terminal orders are ignored.
 * Remounts per page via `pageKey`, so page changes re-run it.
 */
export function OrdersAutoRefresh({
  orders,
  page,
  pageSize,
  status,
  search,
  pageKey,
}: {
  orders: OrderRow[];
  page: number;
  pageSize: number;
  status?: OrderStatus;
  search?: string;
  pageKey: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  // One sync per page view: router.refresh() after a change re-renders with
  // the same pageKey, so this guard stops a refresh → resync loop.
  const ranForKey = useRef<string | null>(null);

  const tracked: Tracked[] = orders
    .filter((order) => order.status === 'pending' || order.status === 'processing')
    .map((order) => ({
      id: order.id,
      status: order.status,
      remaining: order.remaining,
      updatedAt: order.updatedAt,
    }));

  useEffect(() => {
    if (tracked.length === 0 || ranForKey.current === pageKey) {
      return;
    }
    ranForKey.current = pageKey;
    let cancelled = false;
    // ponytail: 10 polls x 3s = 30s ceiling; upstream syncs slower than that
    // surface on next visit or page change instead of polling forever.
    let polls = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const before = new Map(tracked.map((order) => [order.id, order]));

    async function poll() {
      polls += 1;
      try {
        const fresh = await listOrders({page, pageSize, status, q: search});
        const changed = fresh.orders.some((order) => {
          const prev = before.get(order.id);
          return (
            prev !== undefined &&
            (prev.status !== order.status ||
              prev.remaining !== order.remaining ||
              prev.updatedAt !== order.updatedAt)
          );
        });
        if (changed && !cancelled) {
          clearInterval(timer);
          setUpdating(false);
          router.refresh();
          return;
        }
      } catch {
        // Transient read failure; keep polling until the ceiling.
      }
      if (polls >= 10 && !cancelled) {
        clearInterval(timer);
        setUpdating(false);
      }
    }

    async function run() {
      setUpdating(true);
      try {
        await refreshOrderStatuses(tracked.map((order) => order.id));
      } catch {
        // Trigger failed; still poll in case the sync ran anyway.
      }
      if (cancelled) {
        return;
      }
      timer = setInterval(poll, 3000);
    }

    run();
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  if (!updating) {
    return null;
  }
  return (
    <VStack gap={1} width="100%">
      <Text size="sm" color="secondary">
        Updating order statuses…
      </Text>
      <ProgressBar label="Updating order statuses" isLabelHidden isIndeterminate />
    </VStack>
  );
}
