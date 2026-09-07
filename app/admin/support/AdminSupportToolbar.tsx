'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Toolbar} from '@astryxdesign/core/Toolbar';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Search} from 'lucide-react';

import {SUPPORT_TICKET_CATEGORIES, SUPPORT_TICKET_PRIORITIES} from '@/lib/database';
import {CATEGORY_LABELS, PRIORITY_LABELS} from '@/app/components/support/ticketMeta';

const SEARCH_DEBOUNCE_MS = 300;

const STATUS_OPTIONS = [
  {value: 'open', label: 'Open'},
  {value: 'closed', label: 'Closed'},
];

const CATEGORY_OPTIONS = SUPPORT_TICKET_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));

const PRIORITY_OPTIONS = SUPPORT_TICKET_PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));

interface FilterUpdate {
  q?: string;
  status?: string | null;
  category?: string | null;
  priority?: string | null;
}

/**
 * Admin support filters: debounced search (title or requester username) plus
 * status, category, and priority selectors. All filters live in the URL;
 * changing any of them resets to page 1.
 */
export function AdminSupportToolbar({
  initialSearch,
  initialStatus,
  initialCategory,
  initialPriority,
}: {
  initialSearch: string;
  initialStatus: string;
  initialCategory: string;
  initialPriority: string;
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

  function navigate(updates: FilterUpdate) {
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

    const category =
      updates.category !== undefined ? updates.category : searchParams.get('category');
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    const priority =
      updates.priority !== undefined ? updates.priority : searchParams.get('priority');
    if (priority) {
      params.set('priority', priority);
    } else {
      params.delete('priority');
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
      label="Support ticket filters"
      startContent={
        <TextInput
          label="Search tickets"
          isLabelHidden
          value={value}
          onChange={handleSearchChange}
          placeholder="Search by title or requester…"
          htmlName="q"
          startIcon={Search}
          hasClear
          isDisabled={isPending}
        />
      }
      endContent={
        <>
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
          <Selector
            label="Category filter"
            isLabelHidden
            variant="ghost"
            options={CATEGORY_OPTIONS}
            value={initialCategory}
            onChange={(next) => navigate({category: next})}
            placeholder="All categories"
            hasClear
            isDisabled={isPending}
          />
          <Selector
            label="Priority filter"
            isLabelHidden
            variant="ghost"
            options={PRIORITY_OPTIONS}
            value={initialPriority}
            onChange={(next) => navigate({priority: next})}
            placeholder="All priorities"
            hasClear
            isDisabled={isPending}
          />
        </>
      }
    />
  );
}
