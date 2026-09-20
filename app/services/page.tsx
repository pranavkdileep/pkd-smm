import type { Metadata } from 'next';
import Link from 'next/link';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { Table, TableRow, TableCell, TableHeaderCell } from '@astryxdesign/core/Table';
import { Breadcrumbs, BreadcrumbItem } from '@astryxdesign/core/Breadcrumbs';

import { siteConfig } from '@/lib/config';
import { PLATFORMS, SERVICES, PRICING, FAQS, PlatformId } from '@/app/components/landing/content';
import { BrandIcon } from '@/app/components/landing/BrandIcon';
import { NamedIcon } from '@/app/components/landing/NamedIcon';
import { SiteHeader } from '@/app/components/landing/SiteHeader';
import { SiteFooter } from '@/app/components/landing/SiteFooter';
import {
  BreadcrumbJsonLd,
  FaqPageJsonLd,
  ServiceOfferCatalogJsonLd,
} from '@/app/components/seo/JsonLd';

export const metadata: Metadata = {
  title: siteConfig.seo.services.title,
  description: siteConfig.seo.services.description,
  keywords: [...siteConfig.seo.services.keywords, ...siteConfig.seo.keywords],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: siteConfig.seo.services.title,
    description: siteConfig.seo.services.description,
    url: `${siteConfig.siteUrl}/services`,
  },
};

export default function ServicesPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ];

  const allOffers = SERVICES.map((service) => ({
    name: service.name,
    description: service.blurb,
    price: service.fromPrice.replace(/[^0-9.]/g, '') || '0.10',
    priceCurrency: 'INR',
  }));

  return (
    <VStack gap={0} className="min-h-screen bg-body">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceOfferCatalogJsonLd
        catalogName="All Social Media Services Catalog"
        offers={allOffers}
      />
      <FaqPageJsonLd faqs={FAQS.slice(0, 5)} />

      <SiteHeader />

      <main className="w-full">
        {/* Header & Breadcrumb Hero */}
        <VStack gap={6} maxWidth={1280} className="mx-auto w-full px-4 py-8 md:px-6 lg:py-12">
          <Breadcrumbs label="Breadcrumb trail">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem isCurrent>Services</BreadcrumbItem>
          </Breadcrumbs>

          <VStack gap={3} align="start" maxWidth={900}>
            <Badge
              variant="blue"
              icon={<NamedIcon name="shield-check" size="sm" />}
              label="Instant Start · Refill Guarantee · 24/7 Tracking"
            />
            <Heading level={1} type="display-2" textWrap="balance">
              Social Media Growth Services & Pricing
            </Heading>
            <Text as="p" size="lg" color="secondary">
              Browse our verified catalog of social media marketing services. Boost Instagram,
              Telegram, TikTok, YouTube, X, and Facebook with transparent rates, gradual delivery
              pacing, and full refill guarantees.
            </Text>
          </VStack>

          {/* Quick Platform Category Navigation */}
          <VStack gap={3} align="start" className="w-full pt-2">
            <Text weight="bold" size="sm" color="primary">
              Explore by Platform Hub:
            </Text>
            <Grid columns={{ minWidth: 170, max: 6 }} gap={3} className="w-full">
              {PLATFORMS.map((platform) => (
                <Link
                  key={platform.id}
                  href={`/services/${platform.id}`}
                  className="group rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent hover:shadow-md"
                >
                  <HStack gap={3} vAlign="center">
                    <HStack
                      width={9}
                      height={9}
                      hAlign="center"
                      vAlign="center"
                      className="rounded-lg bg-accent-bg text-accent"
                    >
                      <BrandIcon platform={platform.id} size="sm" />
                    </HStack>
                    <VStack gap={0.5} align="start">
                      <Text weight="bold" size="sm" color="primary" className="group-hover:text-blue-vivid">
                        {platform.name}
                      </Text>
                      <Text size="xsm" color="secondary">
                        View packages →
                      </Text>
                    </VStack>
                  </HStack>
                </Link>
              ))}
            </Grid>
          </VStack>
        </VStack>

        <Divider />

        {/* Master Services Table */}
        <VStack gap={6} maxWidth={1280} className="mx-auto w-full px-4 py-12 md:px-6">
          <VStack gap={2} align="start">
            <Heading level={2}>Featured Packages by Platform</Heading>
            <Text as="p" color="secondary">
              All services operate on public URLs only — no passwords or private account access
              required.
            </Text>
          </VStack>

          <VStack gap={10} className="w-full">
            {PLATFORMS.map((platform) => {
              const rows = PRICING[platform.id as PlatformId] || [];
              const platformMeta = siteConfig.seo.platforms[platform.id as keyof typeof siteConfig.seo.platforms];

              return (
                <VStack
                  key={platform.id}
                  gap={4}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
                    <HStack gap={3} vAlign="center">
                      <HStack
                        width={10}
                        height={10}
                        hAlign="center"
                        vAlign="center"
                        className="rounded-xl bg-accent-bg text-accent"
                      >
                        <BrandIcon platform={platform.id} size="md" />
                      </HStack>
                      <VStack gap={0.5} align="start">
                        <Heading level={3}>{platform.name} Services</Heading>
                        <Text size="sm" color="secondary">
                          {platformMeta?.description || `High-retention ${platform.name} growth packages`}
                        </Text>
                      </VStack>
                    </HStack>

                    <Button
                      label={`Explore ${platform.name} Hub`}
                      variant="secondary"
                      size="sm"
                      href={`/services/${platform.id}`}
                    />
                  </HStack>

                  <Table aria-label={`${platform.name} services pricing`}>
                    <thead>
                      <TableRow>
                        <TableHeaderCell>Service Offering</TableHeaderCell>
                        <TableHeaderCell>Starting Rate</TableHeaderCell>
                        <TableHeaderCell>Order Range</TableHeaderCell>
                        <TableHeaderCell>Guarantee Policy</TableHeaderCell>
                        <TableHeaderCell>Order</TableHeaderCell>
                      </TableRow>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <TableRow key={row.service}>
                          <TableCell>
                            <Text weight="medium" color="primary">
                              {row.service}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Badge variant="neutral" label={row.rate} />
                          </TableCell>
                          <TableCell>
                            <Text size="sm" color="secondary">
                              {row.quantity}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <HStack gap={1.5} vAlign="center">
                              <NamedIcon name="shield-check" size="sm" className="text-green" />
                              <Text size="sm" color="secondary">
                                {row.guarantee}
                              </Text>
                            </HStack>
                          </TableCell>
                          <TableCell>
                            <Button
                              label="Order"
                              variant="ghost"
                              size="sm"
                              href="/signup"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </VStack>
              );
            })}
          </VStack>
        </VStack>

        <Divider />

        {/* Informational SEO Content Section (Rich Content >300 words) */}
        <VStack gap={8} maxWidth={1280} className="mx-auto w-full px-4 py-16 md:px-6">
          <VStack gap={3} align="start" maxWidth={900}>
            <Heading level={2}>Why Choose PKD-SMM for Social Media Growth?</Heading>
            <Text as="p" color="secondary" size="lg">
              PKD-SMM Panel delivers reliable social media marketing solutions designed for
              creators, digital agencies, and resellers. Our infrastructure combines speed, safety,
              and transparency.
            </Text>
          </VStack>

          <Grid columns={{ minWidth: 320, max: 3 }} gap={6} className="w-full">
            <VStack gap={2} align="start" className="rounded-xl border border-border bg-surface p-6">
              <HStack
                width={10}
                height={10}
                hAlign="center"
                vAlign="center"
                className="rounded-lg bg-blue-subtle text-blue-vivid"
              >
                <NamedIcon name="lock" size="md" />
              </HStack>
              <Heading level={4}>Zero Password Requirement</Heading>
              <Text as="p" size="sm" color="secondary">
                We never ask for account passwords, login credentials, or access tokens. Orders are
                fulfilled solely using public links to profiles, posts, reels, or channels, keeping
                your account completely secure.
              </Text>
            </VStack>

            <VStack gap={2} align="start" className="rounded-xl border border-border bg-surface p-6">
              <HStack
                width={10}
                height={10}
                hAlign="center"
                vAlign="center"
                className="rounded-lg bg-green-subtle text-green-vivid"
              >
                <NamedIcon name="shield-check" size="md" />
              </HStack>
              <Heading level={4}>Refill & Drop Protection</Heading>
              <Text as="p" size="sm" color="secondary">
                Social media algorithms fluctuate periodically. Every service specifies a clear
                refill window — from 30 days to lifetime refill guarantees. If engagement drops
                within your window, our system replenishes it automatically at no additional fee.
              </Text>
            </VStack>

            <VStack gap={2} align="start" className="rounded-xl border border-border bg-surface p-6">
              <HStack
                width={10}
                height={10}
                hAlign="center"
                vAlign="center"
                className="rounded-lg bg-purple-subtle text-purple-vivid"
              >
                <NamedIcon name="headphones" size="md" />
              </HStack>
              <Heading level={4}>Drip-Feed & Natural Pacing</Heading>
              <Text as="p" size="sm" color="secondary">
                For large campaigns, orders can be delivered in gradual increments over hours or
                days. This gradual pacing matches organic social growth patterns and helps maximize
                reach without triggering algorithmic spam filters.
              </Text>
            </VStack>
          </Grid>
        </VStack>
      </main>

      <SiteFooter />
    </VStack>
  );
}
