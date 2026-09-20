import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Badge } from '@astryxdesign/core/Badge';

import { HERO_BENEFITS, PLATFORMS, SITE } from './content';
import { BrandIcon } from './BrandIcon';
import { NamedIcon } from './NamedIcon';
import { HeroSignInCard } from './HeroSignInCard';

export function Hero() {
  return (
    <section
      id="top"
      aria-label={`${SITE.name} introduction`}
      className="landing-hero-wash relative w-full bg-body"
    >
      <Grid
        columns={{ minWidth: 420, max: 2 }}
        gap={10}
        maxWidth={1440}
        className="relative mx-auto items-center px-4 py-12 md:py-16 lg:px-8"
      >
        <VStack gap={4} align="start">
          <HStack gap={2} wrap="wrap">
            {PLATFORMS.map((platform) => (
              <BrandIcon key={platform.id} platform={platform.id} size="md" className="text-secondary" />
            ))}
          </HStack>

          <Badge
            variant="blue"
            icon={<NamedIcon name="star" size="sm" />}
            label="SMM panel for individuals & marketing teams"
          />

          <Heading level={1} type="display-2" textWrap="balance">
            {SITE.name}: boost every platform from one place
          </Heading>

          <Text as="p" color="secondary" size="lg">
            {SITE.name} is an affordable social media growth platform for Instagram, Telegram,
            TikTok, YouTube, X and Facebook  followers, views, likes and engagement delivered to a
            public link and tracked live on your dashboard.
          </Text>

          <HStack gap={3}>
            <Button label="Create free account" variant="primary" size="lg" href="/signup" />
            <Button label="Explore services" variant="secondary" size="lg" href="#services" />
          </HStack>

          <Grid columns={{ minWidth: 200, max: 2 }} gap={2} className="w-full pt-2">
            {HERO_BENEFITS.map((benefit) => (
              <HStack
                key={benefit.text}
                gap={2}
                vAlign="center"
                className="rounded-lg border border-border bg-card/80 p-3 backdrop-blur-sm transition-colors hover:border-primary/30"
              >
                <NamedIcon name={benefit.icon} size="sm" className="shrink-0 text-blue-vivid" />
                <Text size="sm" weight="medium" color="primary">
                  {benefit.text}
                </Text>
              </HStack>
            ))}
          </Grid>
        </VStack>

        <HStack justify="end" className="w-full">
          <HeroSignInCard />
        </HStack>
      </Grid>
    </section>
  );
}
