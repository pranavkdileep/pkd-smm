'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {HStack} from '@astryxdesign/core/HStack';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Search} from 'lucide-react';

import {ORDER_STATUSES} from '@/lib/database';
import {ORDER_STATUS_LABELS} from '@/app/components/orders/orderMeta';

const SEARCH_DEBOUNCE_MS = 300;

const STATUS_OPTIONS = [
  {value: '', label: 'All statuses'},
  ...ORDER_STATUSES.map((value) => ({value, label: ORDER_STATUS_LABELS[value]})),
];

/**
 * URL-driven status filter + ID/link search for the orders list
 * (`?status=&q=`). Any change drops `page` so the server re-renders slice one.
 */
export function OrdersToolbar({status, search}: {status: string; search: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(search);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function navigate(next: {status?: string; q?: string}) {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    if (nextStatus) {
      params.set('status', nextStatus);
    } else {
      params.delete('status');
    }
    // Fall back to the URL prop (not local state) so status changes don't
    // echo a stale debounced keystroke.
    const nextQ = next.q ?? search;
    if (nextQ.trim()) {
      params.set('q', nextQ.trim());
    } else {
      params.delete('q');
    }
    params.delete('page');

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  function handleSearchChange(next: string) {
    setValue(next);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      navigate({q: next});
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <HStack gap={2} wrap="wrap" vAlign="center">
      <TextInput
        label="Search orders"
        isLabelHidden
        value={value}
        onChange={handleSearchChange}
        placeholder="Search by Order ID or link…"
        htmlName="q"
        startIcon={Search}
        hasClear
        width={240}
        isDisabled={isPending}
      />
      <Selector
        label="Status"
        isLabelHidden
        options={STATUS_OPTIONS}
        value={status}
        onChange={(next) => navigate({status: next})}
        width={170}
        isDisabled={isPending}
      />
    </HStack>
  );
}
