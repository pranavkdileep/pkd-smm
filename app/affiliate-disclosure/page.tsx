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
  title: `Affiliate & Advertising Disclosure · ${siteConfig.name}`,
  description: `FTC Endorsement Guide compliance and Affiliate Referral Program transparency disclosure for ${siteConfig.name}.`,
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageShell
      title="Affiliate & Advertising Disclosure"
      subtitle={`Statutory disclosure in accordance with United States Federal Trade Commission (FTC) 16 CFR Part 255 and international advertising transparency guidelines.`}
      effectiveDate={siteConfig.legal.effectiveDate}
      jurisdictions={['US FTC Endorsement Guides (16 CFR Part 255)', 'UK CAP Code (ASA)', 'EU Unfair Commercial Practices Directive']}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Statutory Framework */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. Statutory Framework & Commitment to Transparency</Heading>
          <Text as="p" color="secondary">
            In compliance with the United States Federal Trade Commission (FTC) guidelines set forth in{' '}
            <strong className="text-primary">16 CFR Part 255 (&quot;Guides Concerning the Use of Endorsements and Testimonials in Advertising&quot;)</strong>,
            the United Kingdom Advertising Standards Authority (ASA) CAP Code, and the European Union Unfair Commercial Practices Directive,
            this disclosure clarifies all material connections, commissions, and promotional relationships on{' '}
            <strong className="text-primary">{siteConfig.name}</strong>.
          </Text>
        </VStack>

        <Divider />

        {/* Section 2: Referral Program */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. Our Referral and Affiliate Program</Heading>
          <Text as="p" color="secondary">
            {siteConfig.name} operates a performance-based affiliate referral program. Content creators, marketing agencies, and existing clients
            may obtain a customized referral link to share with their audience.
          </Text>

          <VStack gap={3} className="w-full">
            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="purple" label="Commission" />
                <Text size="sm" weight="bold">Affiliate Commission Structure</Text>
              </HStack>
              <Text size="sm" color="secondary">
                When a new user registers an account through an affiliate referral link and completes a qualifying wallet deposit, the referring
                partner may receive a commission percentage credited to their partner wallet balance.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="blue" label="Pricing Guarantee" />
                <Text size="sm" weight="bold">Zero Extra Cost to the Customer</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Purchasing services or depositing funds via an affiliate referral link incurs <strong className="text-primary">zero additional cost to you</strong>.
                Pricing, discounts, refill guarantees, and service quality remain 100% identical whether you sign up directly or through a partner referral link.
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Partner Endorsement Standards */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Guidelines for Our Affiliates and Promoters</Heading>
          <Text as="p" color="secondary">
            We require all affiliates, influencers, and marketing partners who promote {siteConfig.name} to adhere strictly to truth-in-advertising principles:
          </Text>

          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Clear and Conspicuous Notice:</strong> Affiliates must clearly disclose their material connection
              (e.g., using explicit tags such as &quot;#ad&quot;, &quot;#sponsored&quot;, or &quot;Affiliate link&quot;) prominently before users click the link.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">No Misleading Guarantees:</strong> Affiliates are strictly prohibited from making false promises regarding
              overnight virality, guaranteed business revenues, or pretending to be official representatives of third-party platforms such as Instagram or YouTube.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">No Spam or Deceptive Distribution:</strong> Affiliate links may not be posted via unsolicited email spam,
              hijacked social comments, or misleading domain redirects.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 4: Customer Inquiries */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. Questions Regarding Affiliates</Heading>
          <Text as="p" color="secondary">
            If you have questions regarding our affiliate program or wish to report an affiliate who is violating our truth-in-advertising guidelines,
            please contact our partner desk at <Text as="span" weight="semibold" color="primary">{siteConfig.email.affiliates}</Text> or reach out to{' '}
            <Text as="span" weight="semibold" color="primary">{siteConfig.email.support}</Text>.
          </Text>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
