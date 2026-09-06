'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Toolbar} from '@astryxdesign/core/Toolbar';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Pagination} from '@astryxdesign/core/Pagination';
import {Button} from '@astryxdesign/core/Button';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Search, Plus, Server} from 'lucide-react';

import type {AdminUpstreamRow} from '@/actions/admin/upstreams';
import {UPSTREAM_PAGE_SIZES} from '@/lib/database';
import {UpstreamsTable} from './UpstreamsTable';
import {UpstreamDialog} from './UpstreamDialog';

const SEARCH_DEBOUNCE_MS = 300;

function useUpstreamsUrl() {
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

    const pageSize = updates.pageSize ?? UPSTREAM_PAGE_SIZES[0];
    if (pageSize !== UPSTREAM_PAGE_SIZES[0]) {
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

export function UpstreamsManager({
  upstreams,
  initialSearch,
  page,
  pageSize,
  total,
  totalPages,
  isFiltered,
}: {
  upstreams: AdminUpstreamRow[];
  initialSearch: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  isFiltered: boolean;
}) {
  const {navigate, isPending} = useUpstreamsUrl();
  const [value, setValue] = useState(initialSearch);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUpstreamRow | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(upstream: AdminUpstreamRow) {
    setEditing(upstream);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditing(null);
  }

  return (
    <VStack gap={5} className="w-full">
      <Toolbar
        label="Upstream provider list filters"
        startContent={
          <TextInput
            label="Search providers"
            isLabelHidden
            value={value}
            onChange={handleSearchChange}
            placeholder="Search by name or API URL…"
            htmlName="q"
            startIcon={Search}
            hasClear
            isDisabled={isPending}
          />
        }
        endContent={
          <Button
            label="New provider"
            variant="primary"
            icon={<Plus size={16} aria-hidden="true" />}
            onClick={openCreate}
          />
        }
      />

      {upstreams.length === 0 ? (
        <EmptyState
          icon={<Server size={28} />}
          title={isFiltered ? 'No providers match your search' : 'No providers yet'}
          description={
            isFiltered
              ? `Nothing found for "${initialSearch.trim()}". Try a different name or API URL.`
              : 'Add your first upstream provider so services can be linked to it.'
          }
          actions={
            !isFiltered ? (
              <Button
                label="New provider"
                variant="primary"
                icon={<Plus size={16} aria-hidden="true" />}
                onClick={openCreate}
              />
            ) : undefined
          }
        />
      ) : (
        <>
          <UpstreamsTable upstreams={upstreams} onEdit={openEdit} />
          <HStack justify="end" wrap="wrap">
            <Pagination
              label="Upstream providers pagination"
              variant="pages"
              size="sm"
              page={page}
              totalItems={total}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[...UPSTREAM_PAGE_SIZES]}
              onChange={(nextPage) => navigate({page: nextPage, pageSize})}
              onPageSizeChange={(nextPageSize) => navigate({page: 1, pageSize: nextPageSize})}
              isDisabled={isPending}
            />
          </HStack>
        </>
      )}

      {dialogOpen ? (
        <UpstreamDialog
          key={editing?.id ?? 'new'}
          upstream={editing}
          onClose={handleDialogClose}
        />
      ) : null}
    </VStack>
  );
}
