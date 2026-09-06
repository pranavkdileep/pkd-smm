'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Toolbar} from '@astryxdesign/core/Toolbar';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Pagination} from '@astryxdesign/core/Pagination';
import {Search} from 'lucide-react';

import {USER_PAGE_SIZES} from '@/lib/database';

const SEARCH_DEBOUNCE_MS = 300;

function useUsersUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(updates: {q?: string; page?: number; pageSize?: number}) {
    const params = new URLSearchParams(searchParams.toString());

    const q = updates.q ?? searchParams.get('q') ?? '';
    if (q.trim()) {
      params.set('q', q.trim());
    } else {
      params.delete('q');
    }

    const page = updates.page ?? 1;
    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }

    const pageSize = updates.pageSize ?? USER_PAGE_SIZES[0];
    if (pageSize !== USER_PAGE_SIZES[0]) {
      params.set('pageSize', String(pageSize));
    } else {
      params.delete('pageSize');
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  return {navigate, isPending};
}

export function UsersToolbar({initialSearch}: {initialSearch: string}) {
  const {navigate, isPending} = useUsersUrl();
  const [value, setValue] = useState(initialSearch);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleChange(next: string) {
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
      label="User list filters"
      startContent={
        <TextInput
          label="Search users"
          isLabelHidden
          value={value}
          onChange={handleChange}
          placeholder="Search by username or email…"
          htmlName="q"
          startIcon={Search}
          hasClear
          isDisabled={isPending}
        />
      }
    />
  );
}

export function UsersPagination({
  page,
  pageSize,
  total,
  totalPages,
}: {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}) {
  const {navigate, isPending} = useUsersUrl();

  return (
    <Pagination
      label="Users pagination"
      variant="pages"
      size="sm"
      page={page}
      totalItems={total}
      totalPages={totalPages}
      pageSize={pageSize}
      pageSizeOptions={[...USER_PAGE_SIZES]}
      onChange={(nextPage) => navigate({page: nextPage, pageSize})}
      onPageSizeChange={(nextPageSize) => navigate({page: 1, pageSize: nextPageSize})}
      isDisabled={isPending}
    />
  );
}