'use client';

import {useState} from 'react';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Check, Users, Wallet, Smartphone, ShieldCheck} from 'lucide-react';

import {FEATURE_TABS} from './content';
import {SectionIntro} from './SectionIntro';

const TAB_ICONS = [Users, Wallet, Smartphone, ShieldCheck] as const;

const TAB_TINTS: Record<string, string> = {
  teams: 'bg-blue-subtle text-blue-vivid',
  payments: 'bg-green-subtle text-green-vivid',
  mobile: 'bg-purple-subtle text-purple-vivid',
  security: 'bg-orange-subtle text-orange-vivid',
};

export function FeatureTabs() {
  const [active, setActive] = useState<string>(FEATURE_TABS[0].id);
  const current = FEATURE_TABS.find((tab) => tab.id === active) ?? FEATURE_TABS[0];

  return (
    <section aria-label="Platform features" className="bg-body py-16 md:py-24">
      <VStack maxWidth={1280} gap={8} className="mx-auto w-full px-6">
        <SectionIntro
          eyebrow="More than a service list"
          title="Built around the way you work"
          lead="Everything around the catalog is designed for individuals and marketing teams running real campaigns."
        />

        <HStack className="relative max-w-full">
          <TabList value={active} onChange={setActive} className="max-w-full overflow-x-auto">
            {FEATURE_TABS.map((tab, index) => {
              const TabIcon = TAB_ICONS[index];
              return (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  icon={<Icon icon={TabIcon} size="sm" />}
                />
              );
            })}
          </TabList>
          <HStack
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-body to-transparent lg:hidden"
          />
          <HStack
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-body to-transparent lg:hidden"
          />
        </HStack>

        <Card padding={5} elevation="low" key={current.id}>
          <Grid columns={{minWidth: 240, max: 2}} gap={6} align="center">
            <VStack gap={3} align="start">
              <HStack
                width={12}
                height={12}
                hAlign="center"
                vAlign="center"
                className={`rounded-lg ${TAB_TINTS[current.id]}`}
              >
                <Icon icon={TAB_ICONS[FEATURE_TABS.findIndex((t) => t.id === current.id)]} size="md" />
              </HStack>
              <Heading level={3}>{current.headline}</Heading>
              <Text as="p" color="secondary">
                {current.body}
              </Text>
            </VStack>

            <VStack gap={3} align="start">
              {current.points.map((point) => (
                <HStack
                  key={point}
                  gap={2}
                  vAlign="center"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5"
                >
                  <Icon icon={Check} size="sm" className="text-green-vivid" />
                  <Text size="sm" weight="semibold" color="primary">
                    {point}
                  </Text>
                </HStack>
              ))}
              <Button label="Create free account" variant="primary" href="/signup" className="mt-2" />
            </VStack>
          </Grid>
        </Card>
      </VStack>
    </section>
  );
}
