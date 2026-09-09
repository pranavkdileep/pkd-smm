'use client';

import {useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Selector} from '@astryxdesign/core/Selector';

import {ORDER_STATUSES} from '@/lib/database';
import {ORDER_STATUS_LABELS} from '@/app/components/orders/orderMeta';

const STATUS_OPTIONS = [
  {value: '', label: 'All statuses'},
  ...ORDER_STATUSES.map((value) => ({value, label: ORDER_STATUS_LABELS[value]})),
];

/**
 * URL-driven status filter for the orders list (`?status=`). Changing it drops
 * `page` so the server component re-renders the first slice.
 */
export function OrdersToolbar({status}: {status: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextStatus) {
      params.set('status', nextStatus);
    } else {
      params.delete('status');
    }
    params.delete('page');

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  return (
    <Selector
      label="Status"
      isLabelHidden
      options={STATUS_OPTIONS}
      value={status}
      onChange={(next) => navigate(next)}
      width={170}
      isDisabled={isPending}
    />
  );
}
