'use client';

import {useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Pagination} from '@astryxdesign/core/Pagination';

/**
 * URL-driven pagination shared by the support ticket list and a ticket's
 * conversation. Page and page-size live in the query string (`?page=&pageSize=`)
 * so server components re-render with the requested slice.
 */
export function UrlPagination({
  label,
  page,
  pageSize,
  total,
  totalPages,
  pageSizes,
}: {
  label: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  pageSizes: readonly number[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const defaultPageSize = pageSizes[0];

  function navigate(updates: {page?: number; pageSize?: number}) {
    const params = new URLSearchParams(searchParams.toString());

    const nextPage = updates.page ?? page;
    if (nextPage > 1) {
      params.set('page', String(nextPage));
    } else {
      params.delete('page');
    }

    const nextPageSize = updates.pageSize ?? pageSize;
    if (nextPageSize !== defaultPageSize) {
      params.set('pageSize', String(nextPageSize));
    } else {
      params.delete('pageSize');
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  return (
    <Pagination
      label={label}
      variant="pages"
      size="sm"
      page={page}
      totalItems={total}
      totalPages={totalPages}
      pageSize={pageSize}
      pageSizeOptions={[...pageSizes]}
      onChange={(nextPage) => navigate({page: nextPage})}
      onPageSizeChange={(nextPageSize) => navigate({page: 1, pageSize: nextPageSize})}
      isDisabled={isPending}
    />
  );
}
