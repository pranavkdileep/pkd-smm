'use client';

import { useState, useEffect } from 'react';
import { TabList, Tab } from '@astryxdesign/core/TabList';
import { Table } from '@astryxdesign/core/Table';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Icon } from '@astryxdesign/core/Icon';
import { Badge } from '@astryxdesign/core/Badge';
import { ShieldCheck } from 'lucide-react';

import type { PlatformId, PricingRow } from './content';
import { PLATFORMS, PRICING } from './content';
import { BrandIcon } from './BrandIcon';
import { NamedIcon } from './NamedIcon';
import { SectionIntro } from './SectionIntro';
import { getLandingPricing } from '@/actions/users/services';

interface PricingRecord extends Record<string, unknown> {
  service: string;
  rate: string;
  quantity: string;
  guarantee: string;
}

const COLUMNS = [
  { key: 'service', header: 'Service' },
  { key: 'rate', header: 'Rate per 1K' },
  { key: 'quantity', header: 'Quantity' },
  { key: 'guarantee', header: 'Guarantee' },
] as const;

function MobilePricingRows({ rows }: { rows: PricingRow[] }) {
  return (
    <VStack gap={0} className="divide-y divide-border sm:hidden">
      {rows.map((row) => (
        <VStack key={row.service} gap={1.5} align="start" className="px-4 py-3">
          <HStack justify="between" vAlign="center" gap={2} className="w-full">
            <Text size="sm" weight="bold">
              {row.service}
            </Text>
            <Badge variant="blue" label={row.rate} />
          </HStack>
          <HStack gap={2} wrap="wrap" vAlign="center">
            <HStack
              gap={1}
              vAlign="center"
              className="rounded-full border border-border bg-body px-2 py-0.5"
            >
              <NamedIcon name="list-checks" size="xsm" className="text-secondary" />
              <Text size="xsm" color="secondary">
                {row.quantity}
              </Text>
            </HStack>
            <HStack
              gap={1}
              vAlign="center"
              className="rounded-full bg-green-subtle px-2 py-0.5 text-green-vivid"
            >
              <NamedIcon name="shield-check" size="xsm" />
              <Text size="xsm" weight="semibold">
                {row.guarantee}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}

function PricingPanel({ rows }: { rows: PricingRow[] }) {
  const data: PricingRecord[] = rows.map((row) => ({ ...row }));
  return (
    <Card padding={0} elevation="low" className="overflow-x-auto">
      <HStack className="hidden sm:block">
        <Table data={data} columns={COLUMNS as never} density="balanced" isStriped hasHover />
      </HStack>
      <MobilePricingRows rows={rows} />
      <HStack gap={2} vAlign="center" className="border-t border-border px-4 py-3">
        <Icon icon={ShieldCheck} size="sm" className="text-green-vivid" />
        <Text size="xsm" color="secondary">
          Starting rates  live prices for every tier sit inside the panel after you sign up.
        </Text>
      </HStack>
      <HStack className="px-4 pb-4">
        <Button label="Order on this platform" variant="primary" href="/signup" />
      </HStack>
    </Card>
  );
}

interface PricingTablesProps {
  initialPricing?: Record<PlatformId, PricingRow[]>;
}

export function PricingTables({ initialPricing }: PricingTablesProps = {}) {
  const [active, setActive] = useState<PlatformId>('instagram');
  const [pricing, setPricing] = useState<Record<PlatformId, PricingRow[]>>(
    initialPricing ?? PRICING
  );

  useEffect(() => {
    let activeEffect = true;
    async function fetchPricing() {
      try {
        const live = await getLandingPricing();
        if (activeEffect && live) {
          setPricing(live);
        }
      } catch (error) {
        // preserve current/fallback pricing
      }
    }

    fetchPricing();
    return () => {
      activeEffect = false;
    };
  }, []);

  const currentRows = pricing[active] ?? PRICING[active] ?? [];

  return (
    <section id="pricing" aria-label="Popular rates" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <VStack maxWidth={1280} gap={6} className="mx-auto w-full px-6">
        <SectionIntro
          eyebrow="Live rates"
          title="Popular services and their rates"
          lead="A sample from the full catalog across all six platforms. Switch tabs to compare starting prices."
        />

        <VStack gap={4}>
          <HStack className="relative max-w-full">
            <TabList
              value={active}
              onChange={(value) => setActive(value as PlatformId)}
              hasDivider
              className="max-w-full overflow-x-auto"
            >
              {PLATFORMS.map((platform) => (
                <Tab
                  key={platform.id}
                  value={platform.id}
                  label={platform.name}
                  icon={<BrandIcon platform={platform.id} />}
                />
              ))}
            </TabList>
            <HStack
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent sm:hidden"
            />
            <HStack
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent sm:hidden"
            />
          </HStack>

          <PricingPanel key={active} rows={currentRows} />

          <HStack gap={2} vAlign="center">
            {PLATFORMS.map((platform) => (
              <BrandIcon
                key={platform.id}
                platform={platform.id}
                size="sm"
                className={platform.id === active ? 'text-primary' : 'text-disabled'}
              />
            ))}
            <Text size="xsm" color="secondary">
              Six platforms, one balance.
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </section>
  );
}
