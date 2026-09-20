import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import { PRICING, PlatformId, SERVICES } from '@/app/components/landing/content';
import { BrandIcon } from '@/app/components/landing/BrandIcon';
import { NamedIcon } from '@/app/components/landing/NamedIcon';
import { SiteHeader } from '@/app/components/landing/SiteHeader';
import { SiteFooter } from '@/app/components/landing/SiteFooter';
import {
  BreadcrumbJsonLd,
  FaqPageJsonLd,
  ServiceOfferCatalogJsonLd,
} from '@/app/components/seo/JsonLd';

type PlatformKey = keyof typeof siteConfig.seo.platforms;

const VALID_PLATFORMS: PlatformKey[] = ['instagram', 'telegram', 'tiktok', 'youtube', 'x', 'facebook'];

export function generateStaticParams() {
  return VALID_PLATFORMS.map((platform) => ({
    platform,
  }));
}

interface PageProps {
  params: Promise<{
    platform: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform } = await params;

  if (!VALID_PLATFORMS.includes(platform as PlatformKey)) {
    return {};
  }

  const pConfig = siteConfig.seo.platforms[platform as PlatformKey];

  return {
    title: pConfig.title,
    description: pConfig.description,
    keywords: [...pConfig.keywords, ...siteConfig.seo.keywords],
    alternates: {
      canonical: `/services/${platform}`,
    },
    openGraph: {
      title: pConfig.title,
      description: pConfig.description,
      url: `${siteConfig.siteUrl}/services/${platform}`,
      siteName: siteConfig.seo.openGraph.siteName,
    },
    twitter: {
      card: siteConfig.seo.twitter.card,
      title: pConfig.title,
      description: pConfig.description,
    },
  };
}

export default async function PlatformServicesPage({ params }: PageProps) {
  const { platform } = await params;

  if (!VALID_PLATFORMS.includes(platform as PlatformKey)) {
    notFound();
  }

  const pConfig = siteConfig.seo.platforms[platform as PlatformKey];
  const platformServices = PRICING[platform as PlatformId] || [];
  const featuredCards = SERVICES.filter((s) => s.platform === platform);

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: `${pConfig.name} Services`, url: `/services/${platform}` },
  ];

  const platformOffers = platformServices.map((row) => ({
    name: `${pConfig.name} ${row.service}`,
    description: `${row.service} with ${row.guarantee} for ${pConfig.name}`,
    price: row.rate.replace(/[^0-9.]/g, '') || '0.10',
    priceCurrency: 'INR',
  }));

  const platformFaqs = [
    {
      q: `How long until my ${pConfig.name} order begins delivery?`,
      a: `Most ${pConfig.name} orders start automatically within minutes of submission. Larger quantity orders are delivered with safe drip-feed pacing to protect account integrity.`,
    },
    {
      q: `Do you need my ${pConfig.name} password or login details?`,
      a: `Never. We never ask for passwords, cookies, or account access. All orders are processed exclusively using public profile or post links.`,
    },
    {
      q: `What happens if ${pConfig.name} engagement drops?`,
      a: `Every service includes a dedicated refill guarantee (from 30 days to lifetime refill). If a drop occurs within your coverage window, our system replenishes it free of charge.`,
    },
    {
      q: `Can I track my ${pConfig.name} order status live?`,
      a: `Yes! Once an order is placed, your dashboard provides live start count tracking, progress percentages, and automated refill triggers.`,
    },
  ];

  return (
    <VStack gap={0} className="min-h-screen bg-body">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceOfferCatalogJsonLd
        catalogName={`${pConfig.name} Growth Services`}
        serviceType={`${pConfig.name} Social Media Marketing`}
        offers={platformOffers}
      />
      <FaqPageJsonLd faqs={platformFaqs} />

      <SiteHeader />

      <main className="w-full">
        {/* Hero Section */}
        <VStack gap={6} maxWidth={1280} className="mx-auto w-full px-4 py-8 md:px-6 lg:py-12">
          <Breadcrumbs label="Breadcrumb trail">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/services">Services</BreadcrumbItem>
            <BreadcrumbItem isCurrent>{pConfig.name}</BreadcrumbItem>
          </Breadcrumbs>

          <VStack gap={4} align="start" maxWidth={960}>
            <HStack gap={2} vAlign="center">
              <HStack
                width={10}
                height={10}
                hAlign="center"
                vAlign="center"
                className="rounded-xl bg-accent-bg text-accent"
              >
                <BrandIcon platform={platform as PlatformId} size="md" />
              </HStack>
              <Badge variant="blue" label={pConfig.heroBadge} />
            </HStack>

            <Heading level={1} type="display-2" textWrap="balance">
              {pConfig.title}
            </Heading>

            <Text as="p" size="lg" color="secondary">
              {pConfig.description}
            </Text>

            <HStack gap={3} className="pt-2">
              <Button
                label={`Order ${pConfig.name} Services`}
                variant="primary"
                size="lg"
                href="/signup"
              />
              <Button
                label="View Pricing Table"
                variant="secondary"
                size="lg"
                href="#pricing-table"
              />
            </HStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Featured Service Highlights */}
        {featuredCards.length > 0 && (
          <VStack gap={6} maxWidth={1280} className="mx-auto w-full px-4 py-12 md:px-6">
            <VStack gap={2} align="start">
              <Heading level={2}>Popular {pConfig.name} Packages</Heading>
              <Text as="p" color="secondary">
                Top-rated tiers selected by creators, agencies, and brand managers.
              </Text>
            </VStack>

            <Grid columns={{ minWidth: 280, max: 3 }} gap={4} className="w-full">
              {featuredCards.map((service) => (
                <VStack
                  key={service.name}
                  gap={3}
                  className="rounded-xl border border-border bg-surface p-6 shadow-sm"
                >
                  <HStack justify="between" vAlign="center">
                    <Heading level={4}>{service.name}</Heading>
                    <Badge variant="neutral" label={service.fromPrice} />
                  </HStack>
                  <Text as="p" size="sm" color="secondary">
                    {service.blurb}
                  </Text>
                  <HStack justify="between" vAlign="center" className="pt-2">
                    <HStack gap={1} vAlign="center">
                      <NamedIcon name="shield-check" size="sm" className="text-green" />
                      <Text size="xsm" color="secondary">
                        Refill Guaranteed
                      </Text>
                    </HStack>
                    <Button label="Get Started" variant="ghost" size="sm" href="/signup" />
                  </HStack>
                </VStack>
              ))}
            </Grid>
          </VStack>
        )}

        {/* Comprehensive Pricing & Packages Table */}
        <section id="pricing-table" aria-label={`${pConfig.name} pricing table`}>
          <VStack gap={6} maxWidth={1280} className="mx-auto w-full px-4 py-12 md:px-6">
            <VStack gap={2} align="start">
              <Heading level={2}>{pConfig.name} Service Rates & Guarantees</Heading>
              <Text as="p" color="secondary">
                Transparent per-1,000 rates with verified delivery limits and refill windows.
              </Text>
            </VStack>

            <VStack className="overflow-x-auto rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <Table aria-label={`${pConfig.name} pricing table`}>
                <thead>
                  <TableRow>
                    <TableHeaderCell>Service Name</TableHeaderCell>
                    <TableHeaderCell>Price per 1,000</TableHeaderCell>
                    <TableHeaderCell>Min – Max Quantity</TableHeaderCell>
                    <TableHeaderCell>Refill & Guarantee</TableHeaderCell>
                    <TableHeaderCell>Action</TableHeaderCell>
                  </TableRow>
                </thead>
                <tbody>
                  {platformServices.map((service) => (
                    <TableRow key={service.service}>
                      <TableCell>
                        <Text weight="medium" color="primary">
                          {pConfig.name} {service.service}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Badge variant="neutral" label={service.rate} />
                      </TableCell>
                      <TableCell>
                        <Text size="sm" color="secondary">
                          {service.quantity}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <HStack gap={1.5} vAlign="center">
                          <NamedIcon name="shield-check" size="sm" className="text-green" />
                          <Text size="sm" color="secondary">
                            {service.guarantee}
                          </Text>
                        </HStack>
                      </TableCell>
                      <TableCell>
                        <Button label="Order Now" variant="primary" size="sm" href="/signup" />
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </VStack>
          </VStack>
        </section>

        <Divider />

        {/* High-Quality Informational Content Section (>350 words) */}
        <VStack gap={8} maxWidth={1280} className="mx-auto w-full px-4 py-16 md:px-6">
          <VStack gap={3} align="start" maxWidth={900}>
            <Heading level={2}>
              How to Accelerate Your {pConfig.name} Growth Safely
            </Heading>
            <Text as="p" color="secondary" size="lg">
              {pConfig.summary}
            </Text>
          </VStack>

          <Grid columns={{ minWidth: 320, max: 3 }} gap={6} className="w-full">
            <VStack gap={2} align="start" className="rounded-xl border border-border bg-surface p-6">
              <Heading level={4}>1. Select Your Target Service</Heading>
              <Text as="p" size="sm" color="secondary">
                Choose the exact engagement type your campaign needs — whether establishing base
                credibility with followers, expanding post discovery with instant likes, or driving
                video retention with high-watch-time views.
              </Text>
            </VStack>

            <VStack gap={2} align="start" className="rounded-xl border border-border bg-surface p-6">
              <Heading level={4}>2. Submit Public Link Only</Heading>
              <Text as="p" size="sm" color="secondary">
                Enter your public handle, post URL, or video link. We never ask for administrative
                rights, account passwords, or two-factor authentication codes. Your account stays
                100% under your ownership.
              </Text>
            </VStack>

            <VStack gap={2} align="start" className="rounded-xl border border-border bg-surface p-6">
              <Heading level={4}>3. Automatic Delivery & Live Tracking</Heading>
              <Text as="p" size="sm" color="secondary">
                Orders dispatch through high-speed automation. Follow the progress on your live order
                history dashboard with start counts, remaining balance, and one-click refill requests
                if numbers dip.
              </Text>
            </VStack>
          </Grid>
        </VStack>

        <Divider />

        {/* Frequently Asked Questions */}
        <VStack gap={6} maxWidth={900} className="mx-auto w-full px-4 py-16 md:px-6">
          <VStack gap={2} align="start">
            <Heading level={2}>Frequently Asked Questions</Heading>
            <Text as="p" color="secondary">
              Everything you need to know about buying {pConfig.name} services on {siteConfig.name}.
            </Text>
          </VStack>

          <VStack gap={4} className="w-full">
            {platformFaqs.map((faq) => (
              <VStack
                key={faq.q}
                gap={2}
                align="start"
                className="rounded-xl border border-border bg-surface p-5"
              >
                <Heading level={4}>{faq.q}</Heading>
                <Text as="p" size="sm" color="secondary">
                  {faq.a}
                </Text>
              </VStack>
            ))}
          </VStack>
        </VStack>

        {/* Call to Action Bar */}
        <VStack
          gap={4}
          maxWidth={1280}
          className="mx-auto mb-16 w-full rounded-2xl border border-border bg-accent-bg p-8 text-center md:p-12"
        >
          <Heading level={2} justify="center">
            Ready to scale your {pConfig.name} account?
          </Heading>
          <Text as="p" color="secondary" justify="center" className="mx-auto max-w-2xl">
            Join 9,300+ creators and marketing agencies using {siteConfig.name}. Create a free
            account in under 60 seconds with test balance included.
          </Text>
          <HStack gap={3} justify="center" className="pt-2">
            <Button
              label="Create Free Account"
              variant="primary"
              size="lg"
              href="/signup"
            />
            <Button
              label="Explore All Services"
              variant="secondary"
              size="lg"
              href="/services"
            />
          </HStack>
        </VStack>
      </main>

      <SiteFooter />
    </VStack>
  );
}
