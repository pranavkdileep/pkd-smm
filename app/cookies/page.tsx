import { Metadata } from 'next';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Badge } from '@astryxdesign/core/Badge';
import { LegalPageShell } from '@/app/components/legal/LegalPageShell';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: `Cookie Policy · ${siteConfig.name}`,
  description: `Comprehensive Cookie Policy and tracking disclosure for ${siteConfig.name} in compliance with EU ePrivacy, UK PECR, and GDPR consent standards.`,
};

const COOKIE_INVENTORY = [
  {
    name: siteConfig.auth.sessionCookie,
    provider: siteConfig.domain,
    purpose: 'Stores encrypted session token to authenticate logged-in users and secure dashboard operations.',
    duration: 'Session / 30 days',
    category: 'Strictly Necessary',
    badgeVariant: 'neutral' as const,
  },
  {
    name: siteConfig.legal.cookieConsentKey,
    provider: siteConfig.domain,
    purpose: 'Stores your granular cookie consent preferences (necessary, analytics, marketing flags).',
    duration: '1 year (Local Storage)',
    category: 'Strictly Necessary',
    badgeVariant: 'neutral' as const,
  },
  {
    name: '__Host-csrf_token',
    provider: siteConfig.domain,
    purpose: 'Cryptographic anti-forgery token protecting user forms and API routes from Cross-Site Request Forgery.',
    duration: 'Session',
    category: 'Strictly Necessary',
    badgeVariant: 'neutral' as const,
  },
  {
    name: '_ga, _gid',
    provider: 'Google Analytics (Optional)',
    purpose: 'Collects anonymized traffic statistics, bounce rates, and session durations to optimize platform speed.',
    duration: '2 years / 24 hours',
    category: 'Analytics',
    badgeVariant: 'blue' as const,
  },
  {
    name: siteConfig.legal.affiliateCookieKey,
    provider: siteConfig.domain,
    purpose: 'Records affiliate partner referral parameters to accurately credit partner commission on initial deposit.',
    duration: '30 days',
    category: 'Marketing',
    badgeVariant: 'purple' as const,
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy & Tracking Technologies"
      subtitle={`Detailed breakdown of cookies, local storage mechanisms, and analytical identifiers utilized on ${siteConfig.name}, compliant with the EU ePrivacy Directive and UK PECR.`}
      effectiveDate={siteConfig.legal.effectiveDate}
      jurisdictions={['EU ePrivacy Directive', 'UK PECR', 'EU/UK GDPR', 'US CCPA/CPRA']}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Introduction */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. What Are Cookies and Local Storage?</Heading>
          <Text as="p" color="secondary">
            Cookies are small text files placed on your computer or mobile device when you access a website. Cookies are widely
            used by online platforms to ensure security, authenticate user sessions, remember user preferences, and gather
            statistical data on website efficiency.
          </Text>
          <Text as="p" color="secondary">
            In addition to cookies, <strong className="text-primary">{siteConfig.name}</strong> utilizes modern web storage
            mechanisms such as <strong className="text-primary">HTML5 LocalStorage</strong> and <strong className="text-primary">SessionStorage</strong>
            to maintain state (for example, keeping your cookie choices stored on your browser without transmitting unnecessary headers on every HTTP request).
          </Text>
        </VStack>

        <Divider />

        {/* Section 2: Categories */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. Categories of Cookies We Use</Heading>
          <Text as="p" color="secondary">
            We classify all cookies into distinct functional tiers to give you transparent and granular control:
          </Text>

          <VStack gap={4} className="w-full">
            <VStack gap={2} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="neutral" label="Essential" />
                <Text size="sm" weight="bold">A. Strictly Necessary Cookies</Text>
              </HStack>
              <Text size="sm" color="secondary">
                These cookies are indispensable for the core operation of the platform. They authenticate your user session,
                enable secure wallet transactions, prevent cross-site request forgery (CSRF), and remember your privacy consent choices.
                Under the EU ePrivacy Directive and UK PECR, strictly necessary cookies do not require prior consent and cannot be switched off.
              </Text>
            </VStack>

            <VStack gap={2} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="blue" label="Optional" />
                <Text size="sm" weight="bold">B. Performance & Analytics Cookies</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Analytics cookies allow us to aggregate anonymous metrics regarding visitor count, page loading speeds, user journey flows,
                and server response latencies. This telemetry enables us to detect errors and optimize API response times. These cookies
                are only activated if you grant affirmative opt-in consent.
              </Text>
            </VStack>

            <VStack gap={2} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="purple" label="Optional" />
                <Text size="sm" weight="bold">C. Marketing & Referral Cookies</Text>
              </HStack>
              <Text size="sm" color="secondary">
                These cookies track affiliate referral links to calculate partner commissions when a referred user signs up and deposits funds.
                They do not create cross-website behavioral advertising profiles or track you outside of {siteConfig.domain}.
                They require your consent prior to activation.
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Inventory Table */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Detailed Cookie Inventory</Heading>
          <Text as="p" color="secondary">
            The table below provides a full audit of the primary cookies and local storage tokens deployed across our domain:
          </Text>

          <VStack gap={2} className="w-full">
            {COOKIE_INVENTORY.map((item) => (
              <VStack
                key={item.name}
                gap={2}
                className="w-full rounded-lg border border-border bg-card p-4"
                align="start"
              >
                <HStack justify="between" vAlign="center" className="w-full" wrap="wrap" gap={2}>
                  <HStack gap={2} vAlign="center">
                    <Text as="span" weight="bold" className="font-mono text-sm text-primary">{item.name}</Text>
                    <Badge variant={item.badgeVariant} label={item.category} />
                  </HStack>
                  <Text size="xsm" color="secondary">
                    Duration: <Text as="span" weight="semibold" color="primary">{item.duration}</Text>
                  </Text>
                </HStack>
                <Text size="xsm" color="secondary">
                  <strong>Provider:</strong> {item.provider}
                </Text>
                <Text size="sm" color="secondary">
                  {item.purpose}
                </Text>
              </VStack>
            ))}
          </VStack>
        </VStack>

        <Divider />

        {/* Section 4: Consent Management */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. How to Manage and Withdraw Your Consent</Heading>
          <Text as="p" color="secondary">
            Under Article 7 of the GDPR and ICO guidelines, consent must be as easy to withdraw as it was to give. You have two convenient
            ways to control your tracking preferences:
          </Text>

          <VStack gap={3} className="w-full rounded-xl border border-blue-ring bg-blue-subtle p-5">
            <HStack gap={2} vAlign="center">
              <Badge variant="blue" label="Interactive Control" />
              <Text size="base" weight="bold" color="primary">
                Manage Cookie Preferences Directly
              </Text>
            </HStack>
            <Text size="sm" color="secondary">
              You can reopen our cookie consent preference modal at any time to adjust your analytics or marketing preferences.
              Your updated choices take effect immediately.
            </Text>
            <Text size="xsm" color="secondary">
              Use the button in the sidebar or footer: <Text as="span" weight="semibold" color="primary">Manage Cookie Preferences</Text>.
            </Text>
          </VStack>

          <VStack gap={2} align="start" className="w-full pt-2">
            <Text size="sm" weight="bold">Browser-Level Cookie Controls:</Text>
            <Text size="sm" color="secondary">
              You can also block or delete cookies through your web browser configuration. Most modern browsers (Chrome, Safari, Firefox, Edge)
              allow you to inspect installed cookies, reject third-party cookies, or clear stored cookies upon exit.
              Note that blocking strictly necessary cookies will prevent you from signing in or placing orders on {siteConfig.name}.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 5: Third-Party Disclosures */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>5. Third-Party Trackers & Policy Inquiries</Heading>
          <Text as="p" color="secondary">
            We do not permit third-party advertising networks to inject cross-site trackers or behavioral fingerprinting scripts into our site.
            When external payment portals (such as DodoPayments or Stripe) are loaded in checkout frames, their respective privacy and cookie
            policies govern those specific interactions.
          </Text>
          <Text as="p" color="secondary">
            For questions regarding our Cookie Policy, please contact our privacy desk at{' '}
            <Text as="span" weight="semibold" color="primary">{siteConfig.email.privacy}</Text>.
          </Text>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
