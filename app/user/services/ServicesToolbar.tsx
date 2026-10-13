'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ArrowDownUp, LayoutGrid} from 'lucide-react';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {Selector} from '@astryxdesign/core/Selector';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';

import {PLATFORM_TYPES, type ServicePlatform, type ServiceSortOption} from '@/lib/database';
import {PLATFORM_LABELS} from '@/app/components/platformMeta';
import {PillSearch} from '@/app/components/catalog/PillSearch';
import {PlatformTile} from '@/app/components/catalog/PlatformTile';

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_SORT: ServiceSortOption = 'name-asc';

const SORT_OPTIONS: {value: ServiceSortOption; label: string}[] = [
  {value: 'name-asc', label: 'Name A–Z'},
  {value: 'name-desc', label: 'Name Z–A'},
  {value: 'price-asc', label: 'Price: low to high'},
  {value: 'price-desc', label: 'Price: high to low'},
];

/**
 * URL-driven catalog state (`?q=&platform=&sort=`). Any filter change drops
 * `page` so server components re-render the first slice.
 */
function useCatalogNavigation(current: {search: string; platform: string; sort: ServiceSortOption}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(updates: {q?: string; platform?: string; sort?: string}) {
    const params = new URLSearchParams(searchParams.toString());
    const entries: [string, string, string][] = [
      ['q', (updates.q ?? current.search).trim(), ''],
      ['platform', updates.platform ?? current.platform, ''],
      ['sort', updates.sort ?? current.sort, DEFAULT_SORT],
    ];
    for (const [key, value, fallback] of entries) {
      if (value && value !== fallback) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    params.delete('page');

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  return {navigate, isPending};
}

/** Floating pill search; debounced so typing updates the list in place. */
export function ServicesSearch({search, platform, sort}: {search: string; platform: string; sort: ServiceSortOption}) {
  const {navigate} = useCatalogNavigation({search, platform, sort});
  const [value, setValue] = useState(search);
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
      if (next.trim() !== search.trim()) {
        navigate({q: next});
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <PillSearch
      label="Search services"
      placeholder="Search services by name, platform, or type"
      value={value}
      onChange={handleChange}
      onSubmit={(next) => navigate({q: next})}
    />
  );
}

/** Platform category tabs: "All platforms" plus one tab per platform. */
export function ServicesPlatformTabs({
  search,
  platform,
  sort,
}: {
  search: string;
  platform: string;
  sort: ServiceSortOption;
}) {
  const {navigate} = useCatalogNavigation({search, platform, sort});

  // Scrolls sideways below md, where seven tabs outgrow the column.
  return (
    <HStack className="w-full overflow-x-auto md:justify-center">
      <TabList value={platform || 'all'} onChange={(next) => navigate({platform: next === 'all' ? '' : next})}>
        <Tab
          value="all"
          label="All platforms"
          icon={
            <HStack hAlign="center" vAlign="center" className="size-6 rounded-sm bg-accent-bg text-on-accent">
              <Icon icon={LayoutGrid} size="xsm" />
            </HStack>
          }
        />
        {PLATFORM_TYPES.map((value) => {
          const key = value.toLowerCase() as Lowercase<ServicePlatform>;
          return (
            <Tab
              key={value}
              value={value}
              label={PLATFORM_LABELS[key]}
              icon={<PlatformTile platform={key} size="sm" />}
            />
          );
        })}
      </TabList>
    </HStack>
  );
}

/** Ghost sort selector for the results bar. */
export function ServicesSort({search, platform, sort}: {search: string; platform: string; sort: ServiceSortOption}) {
  const {navigate, isPending} = useCatalogNavigation({search, platform, sort});

  return (
    <HStack gap={1} vAlign="center">
      <Icon icon={ArrowDownUp} size="sm" color="secondary" />
      <Selector
        label="Sort services"
        isLabelHidden
        variant="ghost"
        options={SORT_OPTIONS}
        value={sort}
        onChange={(next) => navigate({sort: next})}
        isDisabled={isPending}
      />
    </HStack>
  );
}
