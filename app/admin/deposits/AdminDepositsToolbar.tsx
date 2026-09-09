'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Toolbar} from '@astryxdesign/core/Toolbar';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Search} from 'lucide-react';

import {DEPOSIT_STATUSES} from '@/lib/database';

const SEARCH_DEBOUNCE_MS = 300;

const STATUS_OPTIONS = DEPOSIT_STATUSES.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

/**
 * Admin deposit filters: debounced search (deposit id, gateway reference, or
 * username) plus a status selector. Filters live in the URL; changing either
 * resets to page 1.
 */
export function AdminDepositsToolbar({
  initialSearch,
  initialStatus,
}: {
  initialSearch: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialSearch);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function navigate(updates: {q?: string; status?: string | null}) {
    const params = new URLSearchParams(searchParams.toString());

    const q = updates.q !== undefined ? updates.q : (searchParams.get('q') ?? '');
    if (q.trim()) {
      params.set('q', q.trim());
    } else {
      params.delete('q');
    }

    const status = updates.status !== undefined ? updates.status : searchParams.get('status');
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    // Any filter change sends the user back to the first page of results.
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
      if (next.trim() !== initialSearch.trim()) {
        navigate({q: next});
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <Toolbar
      label="Deposit list filters"
      startContent={
        <TextInput
          label="Search deposits"
          isLabelHidden
          value={value}
          onChange={handleSearchChange}
          placeholder="Search by id, reference, or username…"
          htmlName="q"
          startIcon={Search}
          hasClear
          isDisabled={isPending}
        />
      }
      endContent={
        <Selector
          label="Status filter"
          isLabelHidden
          variant="ghost"
          options={STATUS_OPTIONS}
          value={initialStatus}
          onChange={(next) => navigate({status: next})}
          placeholder="All statuses"
          hasClear
          isDisabled={isPending}
        />
      }
    />
  );
}
