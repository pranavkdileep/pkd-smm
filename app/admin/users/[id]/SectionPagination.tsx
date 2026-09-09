'use client';

import {useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Pagination} from '@astryxdesign/core/Pagination';

/**
 * Pager for one section of the user detail page. Each section owns a URL param
 * (`?opage=`, `?dpage=`, …) so the four sections paginate independently.
 */
export function SectionPagination({
  param,
  label,
  page,
  pageSize,
  total,
  totalPages,
}: {
  param: string;
  label: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) {
      params.set(param, String(nextPage));
    } else {
      params.delete(param);
    }
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  return (
    <Pagination
      label={label}
      variant="compact"
      size="sm"
      page={page}
      totalItems={total}
      totalPages={totalPages}
      pageSize={pageSize}
      onChange={navigate}
      isDisabled={isPending}
    />
  );
}
