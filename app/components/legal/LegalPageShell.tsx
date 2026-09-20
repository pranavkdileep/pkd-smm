'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';

import { SiteHeader } from '../landing/SiteHeader';
import { SiteFooter } from '../landing/SiteFooter';
import { siteConfig } from '@/lib/config';

export const LEGAL_NAV_ITEMS = [
  { href: '/privacy', label: 'Privacy Policy', badge: 'Mandatory' },
  { href: '/terms', label: 'Terms of Service', badge: 'Contract' },
  { href: '/cookies', label: 'Cookie Policy', badge: 'Consent' },
  { href: '/refund', label: 'Refund Policy', badge: 'Consumer' },
  { href: '/delivery', label: 'Delivery Policy', badge: 'Fulfillment' },
  { href: '/accessibility', label: 'Accessibility Statement', badge: 'WCAG 2.1' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure', badge: 'FTC' },
  { href: '/dmca', label: 'DMCA & Copyright', badge: 'Safe Harbor' },
] as const;

interface LegalPageShellProps {
  title: string;
  subtitle: string;
  effectiveDate?: string;
  jurisdictions?: string[];
  children: ReactNode;
}

export function LegalPageShell({
  title,
  subtitle,
  effectiveDate = siteConfig.legal.effectiveDate,
  jurisdictions = ['Global', 'EU/UK (GDPR)', 'US (CCPA/FTC)', 'India (DPDP)', 'Australia (APPs)'],
  children,
}: LegalPageShellProps) {
  const pathname = usePathname();

  const handleOpenCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(siteConfig.legal.eventCookieSettings));
    }
  };

  return (
    <VStack gap={0} className="min-h-screen bg-body text-primary">
      <SiteHeader />

      <main className="w-full">
        {/* Header Hero */}
        <section aria-label="Legal document header" className="border-b border-border bg-surface py-12 md:py-16">
          <VStack maxWidth={1280} gap={4} className="mx-auto px-6">
            <HStack gap={2} wrap="wrap" vAlign="center">
              <Link href="/" className="text-xs font-medium text-secondary hover:text-blue-vivid">
                Home
              </Link>
              <Text size="xsm" color="secondary">
                /
              </Text>
              <Text size="xsm" color="secondary">
                Legal Center
              </Text>
              <Text size="xsm" color="secondary">
                /
              </Text>
              <Text size="xsm" weight="semibold" color="primary">
                {title}
              </Text>
            </HStack>

            <VStack gap={2} align="start">
              <HStack gap={2} vAlign="center" wrap="wrap">
                <Badge variant="blue" label="Official Compliance" />
                <Badge variant="neutral" label={`Effective: ${effectiveDate}`} />
              </HStack>
              <Heading level={1}>{title}</Heading>
              <Text size="base" color="secondary" className="max-w-3xl">
                {subtitle}
              </Text>
            </VStack>

            <HStack gap={2} wrap="wrap" vAlign="center" className="pt-2">
              <Text size="xsm" weight="bold" color="secondary" className="uppercase tracking-wider">
                Jurisdictions Covered:
              </Text>
              {jurisdictions.map((j) => (
                <HStack
                  key={j}
                  className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-secondary"
                >
                  {j}
                </HStack>
              ))}
            </HStack>
          </VStack>
        </section>

        {/* Content Body with Side Nav */}
        <section aria-label="Legal document body" className="py-12 md:py-16">
          <VStack maxWidth={1280} gap={8} className="mx-auto px-6">
            <Grid columns={{ minWidth: 260, max: 4 }} gap={8} className="items-start">
              {/* Sidebar Navigation */}
              <aside className="sticky top-24">
                <VStack gap={4} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                  <VStack gap={1} align="start">
                    <Text size="xsm" weight="bold" color="secondary" className="uppercase tracking-wider">
                      Legal Navigation
                    </Text>
                    <Text size="sm" color="secondary">
                      All policies governing {siteConfig.name}
                    </Text>
                  </VStack>

                  <Divider />

                  <VStack gap={1} align="start" className="w-full">
                    {LEGAL_NAV_ITEMS.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`w-full rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-blue-subtle font-semibold text-blue-vivid'
                              : 'text-secondary hover:bg-card hover:text-primary'
                          }`}
                        >
                          <HStack justify="between" vAlign="center" className="w-full">
                            <Text size="sm" weight={isActive ? 'bold' : 'normal'}>
                              {item.label}
                            </Text>
                            <Text size="3xs" color={isActive ? 'primary' : 'secondary'} className="uppercase">
                              {item.badge}
                            </Text>
                          </HStack>
                        </Link>
                      );
                    })}
                  </VStack>

                  <Divider />

                  <VStack gap={2} align="start">
                    <Text size="xsm" weight="semibold" color="secondary">
                      Cookie Preferences
                    </Text>
                    <Text size="xsm" color="secondary">
                      Review or withdraw your tracking consent at any time.
                    </Text>
                    <Button
                      label="Manage Cookie Settings"
                      variant="ghost"
                      size="sm"
                      onClick={handleOpenCookieSettings}
                    />
                  </VStack>

                  <VStack gap={2} align="start" className="rounded-lg bg-card p-3 border border-border">
                    <Text size="xsm" weight="bold" color="primary">
                      Need legal assistance?
                    </Text>
                    <Text size="xsm" color="secondary">
                      Contact our data protection and compliance team at{' '}
                      <Text as="span" weight="semibold" color="primary">
                        {siteConfig.email.privacy}
                      </Text>
                    </Text>
                  </VStack>
                </VStack>
              </aside>

              {/* Main Content Article */}
              <article className="md:col-span-3">
                <VStack gap={8} className="rounded-xl border border-border bg-surface p-6 md:p-10 shadow-sm">
                  {children}
                </VStack>
              </article>
            </Grid>
          </VStack>
        </section>
      </main>

      <SiteFooter />
    </VStack>
  );
}
