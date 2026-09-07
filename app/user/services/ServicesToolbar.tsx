'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Section} from '@astryxdesign/core/Section';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Button} from '@astryxdesign/core/Button';
import {HStack} from '@astryxdesign/core/HStack';
import {Search} from 'lucide-react';

import {PLATFORM_TYPES, SERVICE_SORT_OPTIONS, type ServicePlatform, type ServiceSortOption} from '@/lib/database';
import {PLATFORM_LABELS} from '@/app/components/platformMeta';

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_SORT: ServiceSortOption = 'name-asc';

const PLATFORM_OPTIONS = [
  {value: '', label: 'All platforms'},
  ...PLATFORM_TYPES.map((value) => ({
    value,
    label: PLATFORM_LABELS[value.toLowerCase() as Lowercase<ServicePlatform>],
  })),
];

const SORT_LABELS: Record<ServiceSortOption, string> = {
  'name-asc': 'Name A–Z',
  'name-desc': 'Name Z–A',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
};

const SORT_OPTIONS = SERVICE_SORT_OPTIONS.map((value) => ({value, label: SORT_LABELS[value]}));

/**
 * URL-driven filters for the user services catalog (`?q=&platform=&sort=`),
 * grouped in a bordered section bar. Any filter change drops `page` so
 * server components re-render the first slice.
 */
export function ServicesToolbar({
  search,
  platform,
  sort,
}: {
  search: string;
  platform: string;
  sort: ServiceSortOption;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(search);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFiltered = Boolean(search || platform || sort !== DEFAULT_SORT);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function navigate(updates: {q?: string; platform?: string; sort?: string}) {
    const params = new URLSearchParams(searchParams.toString());

    const q = updates.q ?? search;
    if (q.trim()) {
      params.set('q', q.trim());
    } else {
      params.delete('q');
    }

    const nextPlatform = updates.platform ?? platform;
    if (nextPlatform) {
      params.set('platform', nextPlatform);
    } else {
      params.delete('platform');
    }

    const nextSort = updates.sort ?? sort;
    if (nextSort !== DEFAULT_SORT) {
      params.set('sort', nextSort);
    } else {
      params.delete('sort');
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
      if (next.trim() !== search.trim()) {
        navigate({q: next});
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <Section variant="section" aria-label="Service catalog filters">
      <HStack gap={2} wrap="wrap" vAlign="center" width="100%">
        <TextInput
          label="Search services"
          isLabelHidden
          value={value}
          onChange={handleSearchChange}
          placeholder="Search services…"
          htmlName="q"
          startIcon={Search}
          hasClear
          width={260}
          isDisabled={isPending}
        />
        <Selector
          label="Platform"
          options={PLATFORM_OPTIONS}
          value={platform}
          onChange={(next) => navigate({platform: next})}
          placeholder="All platforms"
          width={170}
          isDisabled={isPending}
        />
        <Selector
          label="Sort by"
          options={SORT_OPTIONS}
          value={sort}
          onChange={(next) => navigate({sort: next})}
          placeholder="Sort"
          width={190}
          isDisabled={isPending}
        />
        {isFiltered ? (
          <Button
            label="Clear filters"
            variant="secondary"
            onClick={() => navigate({q: '', platform: '', sort: DEFAULT_SORT})}
            isDisabled={isPending}
          />
        ) : null}
      </HStack>
    </Section>
  );
}
