import {Carousel} from '@astryxdesign/core/Carousel';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Badge} from '@astryxdesign/core/Badge';


import {FREE_SERVICES, SERVICES} from './content';
import {NamedIcon} from './NamedIcon';
import {BrandIcon} from './BrandIcon';
import {SectionIntro} from './SectionIntro';
import {PLATFORM_TINTS} from '@/app/components/platformMeta';

export function ServicesCatalog() {
  return (
    <section id="services" aria-label="Service catalog" className="scroll-mt-24 bg-body py-16 md:py-24">
      <VStack gap={6}>
        <VStack maxWidth={1280} className="mx-auto w-full px-6">
          <SectionIntro
            eyebrow="All services"
            title="Every platform, one panel"
            lead="Followers, views, likes and engagement for Instagram, Telegram, TikTok, YouTube, X and Facebook — each service states its price and guarantee before you pay."
          />
        </VStack>

        <Carousel gap={3} padding={4} hasSnap aria-label="Available services">
          {SERVICES.map((service) => (
            <ClickableCard
              key={service.name}
              label={`Open ${service.name}`}
              href="/signup"
              padding={3}
              elevation="low"
              width={260}
              className="flex flex-col"
            >
              <VStack gap={2} align="start">
                <HStack
                  width={10}
                  height={10}
                  hAlign="center"
                  vAlign="center"
                  className={`rounded-lg ${PLATFORM_TINTS[service.platform]}`}
                >
                  <BrandIcon platform={service.platform} size="md" />
                </HStack>
                <Heading level={4}>{service.name}</Heading>
                <Text size="sm" color="secondary">
                  {service.blurb}
                </Text>
                <HStack justify="between" vAlign="center" className="pt-3">
                  <Badge variant="neutral" label={service.fromPrice} />
                  <HStack
                    width={7}
                    height={7}
                    hAlign="center"
                    vAlign="center"
                    className="rounded-md bg-card text-primary"
                  >
                    <NamedIcon name="chevron-right" size="sm" />
                  </HStack>
                </HStack>
              </VStack>
            </ClickableCard>
          ))}
        </Carousel>

        <VStack maxWidth={1280} className="mx-auto w-full px-6">
          <VStack gap={2}>
            <Text weight="bold">Try before you buy</Text>
            <HStack gap={2} wrap="wrap">
              {FREE_SERVICES.map((free) => (
                <HStack
                  key={free}
                  gap={1.5}
                  vAlign="center"
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-green-vivid"
                >
                  <NamedIcon name="gift" size="sm" />
                  <Text size="sm" weight="semibold" color="primary">
                    {free}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </section>
  );
}
