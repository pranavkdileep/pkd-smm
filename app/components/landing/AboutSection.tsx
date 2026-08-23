import {Grid} from '@astryxdesign/core/Grid';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';

import {SITE} from './content';
import {BrandIcon} from './BrandIcon';
import {NamedIcon} from './NamedIcon';

const PROOF_POINTS = ['Public links only', 'Written terms', 'Live tracking'];

const PANEL_ROWS = [
  {
    icon: 'users' as const,
    label: 'Platforms covered',
    value: '6 major networks',
  },
  {
    icon: 'list-checks' as const,
    label: 'Services live',
    value: '1,200+ and growing',
  },
  {
    icon: 'receipt' as const,
    label: 'Refill terms',
    value: 'Written before you pay',
  },
  {
    icon: 'activity' as const,
    label: 'Order tracking',
    value: 'Live status from checkout',
  },
];

export function AboutSection() {
  return (
    <section id="about" aria-label="About SMM panels" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <Grid columns={{minWidth: 380, max: 2}} gap={8} maxWidth={1280} className="mx-auto items-start px-6">
        <VStack gap={4} align="start">
          <Heading level={2}>What is an SMM panel?</Heading>
          <Text as="p" color="secondary">
            An SMM panel is a dashboard where you order growth services for your social accounts:
            followers, likes, views, reactions and comments, each priced per thousand and delivered
            to a public link. Instead of chasing ten providers with ten payment methods, a panel
            puts the catalog, the wallet and order tracking in one place.
          </Text>
          <Text as="p" color="secondary">
            What separates one panel from another is focus and honesty. {SITE.name} covers six major
            platforms with clear quality tiers, refill terms written into every service before you
            pay, and live status tracking from the moment an order starts.
          </Text>
        </VStack>

        <VStack gap={3} className="rounded-lg border border-border bg-card p-5 shadow-md">
          <HStack justify="between" vAlign="center">
            <HStack gap={1}>
              <HStack width={2.5} height={2.5} className="rounded-full bg-blue-vivid" />
              <HStack width={2.5} height={2.5} className="rounded-full bg-blue-subtle" />
              <HStack width={2.5} height={2.5} className="rounded-full bg-border" />
            </HStack>
            <Text size="3xs" weight="bold" color="secondary" className="uppercase">
              One balance · six platforms
            </Text>
          </HStack>

          <VStack gap={2}>
            {PANEL_ROWS.map((row) => (
              <HStack
                key={row.label}
                gap={3}
                vAlign="center"
                className="w-full rounded-md border border-border bg-body px-3 py-2.5"
              >
                <HStack
                  width={8}
                  height={8}
                  hAlign="center"
                  vAlign="center"
                  className="shrink-0 rounded-md bg-blue-subtle text-blue-vivid"
                >
                  <NamedIcon name={row.icon} size="sm" />
                </HStack>
                <VStack gap={0} align="start">
                  <Text size="xsm" color="secondary">
                    {row.label}
                  </Text>
                  <Text size="sm" weight="semibold">
                    {row.value}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>

          <HStack gap={2} wrap="wrap">
            {['instagram', 'telegram', 'tiktok', 'youtube', 'x', 'facebook'].map((platform) => (
              <BrandIcon key={platform} platform={platform as never} size="sm" className="text-secondary" />
            ))}
          </HStack>

          <HStack gap={2} wrap="wrap">
            {PROOF_POINTS.map((point) => (
              <HStack
                key={point}
                className="rounded-full border border-blue-ring bg-blue-subtle px-3 py-1 text-xs font-semibold text-blue-vivid"
              >
                {point}
              </HStack>
            ))}
          </HStack>
        </VStack>
      </Grid>
    </section>
  );
}
