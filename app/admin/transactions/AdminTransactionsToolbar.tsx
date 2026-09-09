'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Toolbar} from '@astryxdesign/core/Toolbar';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Search} from 'lucide-react';

import {TransactionTypes} from '@/lib/database';

const SEARCH_DEBOUNCE_MS = 300;

const TYPE_OPTIONS = TransactionTypes.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

/**
 * Ledger filters: debounced search (transaction id or username — a username
 * narrows the ledger to that user) plus a type selector. Filters live in the
 * URL; changing either resets to page 1.
 */
export function AdminTransactionsToolbar({
  initialSearch,
  initialType,
}: {
  initialSearch: string;
  initialType: string;
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

  function navigate(updates: {q?: string; type?: string | null}) {
    const params = new URLSearchParams(searchParams.toString());

    const q = updates.q !== undefined ? updates.q : (searchParams.get('q') ?? '');
    if (q.trim()) {
      params.set('q', q.trim());
    } else {
      params.delete('q');
    }

    const type = updates.type !== undefined ? updates.type : searchParams.get('type');
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
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
      label="Transaction list filters"
      startContent={
        <TextInput
          label="Search transactions"
          isLabelHidden
          value={value}
          onChange={handleSearchChange}
          placeholder="Search by id or username…"
          htmlName="q"
          startIcon={Search}
          hasClear
          isDisabled={isPending}
        />
      }
      endContent={
        <Selector
          label="Type filter"
          isLabelHidden
          variant="ghost"
          options={TYPE_OPTIONS}
          value={initialType}
          onChange={(next) => navigate({type: next})}
          placeholder="All types"
          hasClear
          isDisabled={isPending}
        />
      }
    />
  );
}
