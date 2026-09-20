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
  title: `Accessibility Statement · ${siteConfig.name}`,
  description: `Accessibility Statement and WCAG 2.1 Level AA / EN 301 549 compliance declaration for ${siteConfig.name}.`,
};

export default function AccessibilityPage() {
  return (
    <LegalPageShell
      title="Accessibility Statement"
      subtitle={`Our formal commitment to digital accessibility, inclusive design, and conformance with WCAG 2.1 Level AA and EN 301 549 standards across all devices and assistive tools.`}
      effectiveDate={siteConfig.legal.effectiveDate}
      jurisdictions={['W3C WCAG 2.1 AA', 'EN 301 549 (EU)', 'US ADA Title III', 'India RPWD Act 2016']}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Commitment */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. Our Commitment to Digital Accessibility</Heading>
          <Text as="p" color="secondary">
            <strong className="text-primary">{siteConfig.name}</strong> is dedicated to providing a digital platform that is accessible,
            inclusive, and usable by individuals of all abilities, including people who rely on assistive technologies such as screen readers,
            keyboard-only navigation, speech recognition software, or screen magnification.
          </Text>
          <Text as="p" color="secondary">
            We aim to conform to the <strong className="text-primary">Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>,
            as well as European standard <strong className="text-primary">EN 301 549</strong> and the technical expectations of the
            Americans with Disabilities Act (ADA) and India&apos;s Rights of Persons with Disabilities (RPWD) Act.
          </Text>
        </VStack>

        <Divider />

        {/* Section 2: Technical Measures */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. Accessibility Features & Engineering Standards</Heading>
          <Text as="p" color="secondary">
            To ensure an inclusive digital environment, we build our user interfaces on the Astryx design system, implementing:
          </Text>

          <VStack gap={3} className="w-full">
            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="blue" label="Keyboard" />
                <Text size="sm" weight="bold">Full Keyboard Navigability</Text>
              </HStack>
              <Text size="sm" color="secondary">
                All interactive elements (navigation links, buttons, order forms, modals, and cookie switches) are fully reachable
                and operable using keyboard commands (Tab, Enter, Spacebar, Escape) with high-visibility focus indicators.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="purple" label="Screen Reader" />
                <Text size="sm" weight="bold">Screen Reader Optimization</Text>
              </HStack>
              <Text size="sm" color="secondary">
                We structure pages with semantic HTML5 landmarks (&lt;header&gt;, &lt;main&gt;, &lt;footer&gt;, &lt;aside&gt;) and provide descriptive
                ARIA labels (<Text as="span" className="font-mono text-xs text-primary">aria-label</Text>, <Text as="span" className="font-mono text-xs text-primary">aria-live</Text>)
                for screen readers including NVDA, JAWS, VoiceOver, and TalkBack.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="green" label="Contrast & Zoom" />
                <Text size="sm" weight="bold">Color Contrast & Viewport Zoom</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Typography and interactive controls maintain a contrast ratio exceeding the minimum 4.5:1 standard for normal text and 3:1 for
                large text. Pages support browser zoom up to 200% without breaking layout structure or losing critical data.
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Assessment & Known Limitations */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Testing Methodology & Known Limitations</Heading>
          <Text as="p" color="secondary">
            Our platform undergoes continuous automated accessibility scans (using axe-core and Lighthouse) paired with periodic manual testing
            with keyboard navigation and VoiceOver/NVDA screen readers.
          </Text>
          <Text as="p" color="secondary">
            <strong className="text-primary">Known Limitations:</strong> While we strive for complete compliance, certain legacy third-party payment
            iFrames or external cryptocurrency payment widgets may feature third-party interface components whose accessibility attributes are
            outside our direct engineering control. We continuously work with payment partners to improve these flows.
          </Text>
        </VStack>

        <Divider />

        {/* Section 4: Feedback & Assistance */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. Feedback and Formal Assistance</Heading>
          <Text as="p" color="secondary">
            We welcome your feedback on the accessibility of {siteConfig.name}. If you experience any difficulty accessing content, navigating
            the dashboard, or placing an order, please contact our dedicated accessibility coordinator:
          </Text>

          <VStack gap={2} className="w-full rounded-lg border border-border bg-card p-4">
            <Text size="sm" weight="bold">Accessibility Contact Information:</Text>
            <Text size="sm" color="secondary">
              Email: <Text as="span" weight="semibold" color="primary">{siteConfig.email.accessibility}</Text>
            </Text>
            <Text size="sm" color="secondary">
              Support Desk: Open a ticket categorized under &quot;Accessibility Support&quot;
            </Text>
            <Text size="sm" color="secondary">
              Turnaround Time: We commit to acknowledging inquiries within two to three (2-3) business days and providing accessible alternatives or planned remediations.
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
