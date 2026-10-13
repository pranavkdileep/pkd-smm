'use client';

import {useMemo, useState} from 'react';
import {ArrowRight, Gift, LayoutGrid, Store} from 'lucide-react';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {FREE_SERVICES, PLATFORMS, SERVICES, type PlatformId} from './content';
import {PillSearch} from '@/app/components/catalog/PillSearch';
import {PlatformTile} from '@/app/components/catalog/PlatformTile';
import {ListingList, ListingMeta, ListingRow} from '@/app/components/catalog/ListingRow';

type Mode = 'services' | 'free';

interface HeroListing {
  key: string;
  platform: PlatformId;
  title: string;
  description: string;
  price: string;
  priceNote: string;
  href: string;
  action: string;
}

const PLATFORM_NAMES = Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name])) as Record<PlatformId, string>;

/** "from ₹49/1K" → {price: "₹49", note: "from, per 1K"} */
function splitFromPrice(fromPrice: string): {price: string; note: string} {
  const match = fromPrice.match(/(₹[\d.,]+)\s*\/\s*(.+)$/);
  return match ? {price: match[1], note: `from, per ${match[2]}`} : {price: fromPrice, note: ''};
}

const PAID: HeroListing[] = SERVICES.map((service) => {
  const {price, note} = splitFromPrice(service.fromPrice);
  return {
    key: service.name,
    platform: service.platform,
    title: service.name,
    description: service.blurb,
    price,
    priceNote: note,
    href: `/services/${service.platform}`,
    action: 'View',
  };
});

const FREE: HeroListing[] = FREE_SERVICES.map((name) => {
  const platform = PLATFORMS.find((p) => name.includes(p.name))?.id ?? 'instagram';
  return {
    key: name,
    platform,
    title: name,
    description: 'Try before you buy',
    price: 'Free',
    priceNote: 'trial order',
    href: '/signup',
    action: 'Claim',
  };
});

/**
 * Hero browse block: mode toggle, pill search, platform tabs and a divided
 * listing of featured services. Filters client-side over the static catalog.
 */
export function HeroBrowse() {
  const [mode, setMode] = useState<Mode>('services');
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<'all' | PlatformId>('all');

  const listings = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (mode === 'free' ? FREE : PAID).filter(
      (item) =>
        (platform === 'all' || item.platform === platform) &&
        (!needle ||
          item.title.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle) ||
          PLATFORM_NAMES[item.platform].toLowerCase().includes(needle)),
    );
  }, [mode, query, platform]);

  const noun = mode === 'free' ? 'free trial' : 'featured service';

  return (
    <VStack gap={6} className="w-full">
      <HStack justify="center">
        <SegmentedControl label="Catalog" value={mode} onChange={(next) => setMode(next as Mode)}>
          <SegmentedControlItem value="services" label="Services" icon={<Icon icon={Store} size="sm" />} />
          <SegmentedControlItem value="free" label="Free trials" icon={<Icon icon={Gift} size="sm" />} />
        </SegmentedControl>
      </HStack>

      <VStack maxWidth={640} className="mx-auto w-full">
        <PillSearch
          label="Search services"
          placeholder="Search by platform or service, e.g. Reels views"
          value={query}
          onChange={setQuery}
        />
      </VStack>

      {/* Scrolls sideways below md, where seven tabs outgrow the column. */}
      <HStack className="w-full overflow-x-auto md:justify-center">
        <TabList value={platform} onChange={(next) => setPlatform(next as 'all' | PlatformId)}>
          <Tab
            value="all"
            label="All platforms"
            icon={
              <HStack hAlign="center" vAlign="center" className="size-6 rounded-sm bg-accent-bg text-on-accent">
                <Icon icon={LayoutGrid} size="xsm" />
              </HStack>
            }
          />
          {PLATFORMS.map((p) => (
            <Tab key={p.id} value={p.id} label={p.name} icon={<PlatformTile platform={p.id} size="sm" />} />
          ))}
        </TabList>
      </HStack>

      <VStack gap={3}>
        <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
          <Text color="secondary" aria-live="polite">
            <Text weight="semibold" color="primary" hasTabularNumbers>
              {listings.length}
            </Text>{' '}
            {listings.length === 1 ? noun : `${noun}s`}
          </Text>
          <Button
            label="Full catalog"
            variant="ghost"
            href="/services"
            endContent={<Icon icon={ArrowRight} size="sm" />}
          />
        </HStack>

        {listings.length === 0 ? (
          <EmptyState
            headingLevel={2}
            title="Nothing matches that search"
            description="Try another platform or a broader term like “followers” or “views”."
          />
        ) : (
          <ListingList label={mode === 'free' ? 'Free trials' : 'Featured services'}>
            {listings.map((item) => (
              <ListingRow
                key={item.key}
                media={<PlatformTile platform={item.platform} />}
                title={item.title}
                description={item.description}
                meta={
                  <ListingMeta>
                    <Text type="supporting" color="primary" weight="medium">
                      {PLATFORM_NAMES[item.platform]}
                    </Text>
                    <Text type="supporting">· Public link only</Text>
                  </ListingMeta>
                }
                price={item.price}
                priceNote={item.priceNote}
                action={
                  <Button
                    label={item.action}
                    href={item.href}
                    endContent={<Icon icon={ArrowRight} size="sm" />}
                  />
                }
              />
            ))}
          </ListingList>
        )}
      </VStack>
    </VStack>
  );
}
