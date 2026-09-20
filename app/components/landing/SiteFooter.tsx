import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import Link from 'next/link';

import { FOOTER_COLUMNS, PLATFORMS, SITE } from './content';
import { BrandIcon } from './BrandIcon';
import { siteConfig } from '@/lib/config';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <VStack maxWidth={1280} gap={6} className="mx-auto w-full px-6 py-12">
        <Grid columns={{ minWidth: 220, max: 4 }} gap={6}>
          <VStack gap={3} align="start">
            <HStack gap={2} vAlign="center">
              <HStack
                width={9}
                height={9}
                hAlign="center"
                vAlign="center"
                className="rounded-lg bg-accent-bg text-xs font-bold text-blue-vivid"
              >
                {siteConfig.brandInitials}
              </HStack>
              <Text weight="bold">{SITE.name}</Text>
            </HStack>
            <Text size="sm" color="secondary">
              {SITE.tagline}. Six platforms, one balance, live order tracking and support around the
              clock.
            </Text>
          </VStack>

          {FOOTER_COLUMNS.map((column) => (
            <VStack key={column.heading} gap={2} align="start">
              <Text size="sm" weight="bold" color="primary">
                {column.heading}
              </Text>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-secondary hover:text-blue-vivid"
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          ))}

          <VStack gap={2} align="start">
            <Text size="sm" weight="bold" color="primary">
              Platforms
            </Text>
            {PLATFORMS.map((platform) => (
              <Link
                key={platform.id}
                href="#services"
                className="text-sm text-secondary hover:text-blue-vivid"
              >
                {platform.name} services
              </Link>
            ))}
          </VStack>
        </Grid>

        <Divider />

        <HStack justify="between" wrap="wrap" gap={3}>
          <Text size="xsm" color="secondary">
            © 2026 {SITE.name}. Independent third-party marketing service  not affiliated with or
            endorsed by Instagram, Telegram, TikTok, YouTube, X or Facebook.
          </Text>
          <HStack gap={3}>
            {PLATFORMS.map((platform) => (
              <BrandIcon key={platform.id} platform={platform.id} size="sm" className="text-secondary" />
            ))}
          </HStack>
        </HStack>
      </VStack>
    </footer>
  );
}
