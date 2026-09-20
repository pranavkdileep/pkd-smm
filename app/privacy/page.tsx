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
  title: `Privacy Policy · ${siteConfig.name}`,
  description: `Global privacy policy and statutory data protection notice for ${siteConfig.name} users under GDPR, CCPA, CPRA, DPDP, PIPEDA, and Australian APPs.`,
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy & Statutory Data Notice"
      subtitle={`How ${siteConfig.name} collects, processes, protects, and handles personal data across global jurisdictions including the EU/UK (GDPR), United States (CCPA/CPRA), India (DPDP), Australia (APPs), Canada (PIPEDA), and Brazil (LGPD).`}
      effectiveDate={siteConfig.legal.effectiveDate}
      jurisdictions={['EU/UK GDPR', 'US CCPA/CPRA', 'India DPDP', 'Australia APPs', 'Canada PIPEDA', 'Brazil LGPD']}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Overview and Data Controller */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. Data Controller Information</Heading>
          <Text as="p" color="secondary">
            This Privacy Policy governs the processing of personal data by{' '}
            <strong className="text-primary">{siteConfig.name}</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
            operating the platform at <strong className="text-primary">{siteConfig.domain}</strong>. For the purposes of
            the General Data Protection Regulation (EU/UK GDPR), the India Digital Personal Data Protection (DPDP) Act,
            and related international privacy laws, {siteConfig.name} acts as the Data Controller.
          </Text>
          <Text as="p" color="secondary">
            For all privacy inquiries, rights requests, or questions regarding data handling practices, contact our
            Data Protection Officer and Privacy Team at:
          </Text>
          <VStack gap={1} className="w-full rounded-lg border border-border bg-card p-4">
            <Text size="sm" weight="bold">
              Privacy & Data Protection Contact:
            </Text>
            <Text size="sm" color="secondary">
              Email: <Text as="span" weight="semibold" color="primary">{siteConfig.email.privacy}</Text>
            </Text>
            <Text size="sm" color="secondary">
              Support Desk: <Text as="span" weight="semibold" color="primary">{siteConfig.email.support}</Text>
            </Text>
            <Text size="sm" color="secondary">
              Response Commitment: Within thirty (30) calendar days as mandated by statutory frameworks.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 2: Data We Collect & Passwords Disclaimer */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. Categories of Personal Data Collected</Heading>
          <Text as="p" color="secondary">
            We minimize personal data collection to only what is strictly necessary to maintain your account and deliver
            social media marketing services:
          </Text>

          <VStack gap={3} className="w-full">
            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="blue" label="Account Identifiers" />
                <Text size="sm" weight="bold">User Credentials & Registration</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Username, email address, password hash (encrypted using industry standard bcrypt/argon2 hashing algorithms).
                We never store plain text passwords.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="green" label="Strict Guarantee" />
                <Text size="sm" weight="bold">Target URLs & Social Media Accounts</Text>
              </HStack>
              <Text size="sm" color="secondary">
                When you place an order, you submit target public URLs (such as profile links, public channel links, or post links).
                <strong className="text-primary"> We NEVER request, collect, or store social media account passwords or login credentials. </strong>
                All fulfillment operates exclusively via public web addresses.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="purple" label="Financial Information" />
                <Text size="sm" weight="bold">Payments & Transactions</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Deposits and transactions are processed directly by certified third-party payment gateways (e.g.,
                DodoPayments, Stripe, or cryptocurrency payment providers). {siteConfig.name} does NOT collect or store full credit
                card numbers, CVV codes, or private crypto keys. We only retain the transaction ID, payment provider reference,
                currency, amount, and timestamp.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="neutral" label="Technical Logs" />
                <Text size="sm" weight="bold">Device & Network Metadata</Text>
              </HStack>
              <Text size="sm" color="secondary">
                IP address, browser type, operating system, referring URL, timestamp of requests, and essential session cookies
                (such as <Text as="span" className="font-mono text-xs text-primary">{siteConfig.auth.sessionCookie}</Text>).
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Legal Bases & Purposes */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Purposes and Legal Bases for Processing</Heading>
          <Text as="p" color="secondary">
            Under Article 6 of the General Data Protection Regulation (GDPR) and corresponding global laws, we process personal data
            under the following legal bases:
          </Text>

          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Performance of a Contract (Art. 6(1)(b) GDPR):</strong> To create and administer your account,
              credit deposited balances, dispatch service orders to upstream networks, and track order fulfillment.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Legitimate Interest (Art. 6(1)(f) GDPR):</strong> To monitor system security, detect and prevent
              fraudulent deposits or automated bot attacks, resolve support tickets, and optimize website performance.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Compliance with Legal Obligations (Art. 6(1)(c) GDPR):</strong> To maintain statutory financial,
              accounting, and tax records, and respond to legitimate requests from law enforcement authorities.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Consent (Art. 6(1)(a) GDPR):</strong> For non-essential analytics and marketing cookies,
              which you can grant, modify, or withdraw at any time via our Cookie Settings.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 4: Data Recipients & International Transfers */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. Recipients of Personal Data & Cross-Border Transfers</Heading>
          <Text as="p" color="secondary">
            We do not sell, rent, or trade your personal information. Data is disclosed only to verified service providers
            bound by strict Data Processing Agreements (Art. 28 GDPR):
          </Text>
          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Payment Gateways:</strong> DodoPayments, Stripe, and crypto merchant processors to verify deposits.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Email Service Providers:</strong> Resend, for dispatching transactional account notices and password resets.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Upstream Fulfillment APIs:</strong> We transmit target URLs and requested quantity to upstream service providers.
              No personal profile identifiers, emails, or user names are ever passed to upstream providers.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Hosting & Cloud Infrastructure:</strong> Database and server providers complying with ISO 27001 / SOC 2 standards.
            </Text>
          </VStack>
          <Text as="p" color="secondary">
            <strong className="text-primary">International Transfers:</strong> Where personal data is transferred outside the European Economic Area (EEA),
            the United Kingdom, or your home jurisdiction, we implement appropriate safeguards including European Commission
            <strong className="text-primary"> Standard Contractual Clauses (SCCs)</strong> pursuant to GDPR Article 46, ensuring an adequate level of data protection.
          </Text>
        </VStack>

        <Divider />

        {/* Section 5: Data Retention & Security */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>5. Data Retention and Security Safeguards</Heading>
          <Text as="p" color="secondary">
            We apply rigorous retention schedules to avoid keeping data longer than necessary:
          </Text>
          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Account Data:</strong> Retained for the lifetime of your active account. If you request account closure,
              account records are deactivated and scrubbed within 30 calendar days.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Financial & Invoicing Records:</strong> Kept for up to seven (7) years to comply with statutory taxation,
              accounting audits, and anti-money laundering (AML) laws.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Server & Security Logs:</strong> Network access logs and IP connection traces are automatically rotated
              and purged after ninety (90) calendar days.
            </Text>
          </VStack>
          <Text as="p" color="secondary">
            Technical safeguards include TLS 1.3 / HTTPS encryption in transit, salted password hashing, least-privilege administrative access,
            and regular database security audits.
          </Text>
        </VStack>

        <Divider />

        {/* Section 6: Global Data Subject Rights */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>6. Your Statutory Rights Across Jurisdictions</Heading>
          <Text as="p" color="secondary">
            Depending on your location, you hold comprehensive rights over your personal data:
          </Text>

          <VStack gap={3} className="w-full">
            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <Text size="sm" weight="bold">European Union & United Kingdom (GDPR / UK-GDPR)</Text>
              <Text size="xsm" color="secondary">
                You have the Right to Access (Art. 15), Right to Rectification (Art. 16), Right to Erasure / &quot;Right to be Forgotten&quot; (Art. 17),
                Right to Restriction of Processing (Art. 18), Right to Data Portability (Art. 20), Right to Object to processing (Art. 21),
                and the right to withdraw consent at any time without affecting prior lawful processing. You may also lodge a complaint
                with your local EU Data Protection Authority or the UK Information Commissioner&apos;s Office (ICO).
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <Text size="sm" weight="bold">California & United States (CCPA / CPRA)</Text>
              <Text size="xsm" color="secondary">
                California residents hold the Right to Know categories and specific pieces of personal information collected, the Right to Delete
                personal information, the Right to Correct inaccurate data, and the Right to Non-Discrimination for exercising statutory rights.
                <strong className="text-primary"> Do Not Sell or Share My Personal Information: </strong>
                {siteConfig.name} does not sell personal data or share consumer data with third parties for cross-context behavioral advertising.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <Text size="sm" weight="bold">India (Digital Personal Data Protection Act - DPDP)</Text>
              <Text size="xsm" color="secondary">
                Data Principals have the right to obtain a summary of personal data processed, right to correction and erasure, right to nominate
                another individual in case of death or incapacity, and right to grievance redressal by contacting our compliance office.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <Text size="sm" weight="bold">Australia (Privacy Act 1988 & APPs) & Canada (PIPEDA)</Text>
              <Text size="xsm" color="secondary">
                Under Australia&apos;s Australian Privacy Principles (APPs) and Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA),
                individuals are entitled to clear disclosure regarding data handling, access to personal information, and correction of inaccurate records.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <Text size="sm" weight="bold">Brazil (Lei Geral de Proteção de Dados - LGPD)</Text>
              <Text size="xsm" color="secondary">
                Under Article 18 of the LGPD, users have the right to confirmation of the existence of processing, access to data, correction
                of incomplete data, and anonymization or blocking of unnecessary or excessive data.
              </Text>
            </VStack>
          </VStack>

          <Text size="sm" color="secondary">
            To exercise any of the above rights, submit your request to <Text as="span" weight="semibold" color="primary">{siteConfig.email.privacy}</Text>.
            We will verify your identity and respond within thirty (30) days without charge.
          </Text>
        </VStack>

        <Divider />

        {/* Section 7: Children's Privacy (COPPA & Minor Protection) */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>7. Children&apos;s Privacy and Minor Protection</Heading>
          <Text as="p" color="secondary">
            Our platform is strictly directed to businesses, creators, and individuals who are at least eighteen (18) years of age or the legal age of majority in their jurisdiction.
            In compliance with the United States Children&apos;s Online Privacy Protection Act (COPPA), the EU/UK GDPR child consent requirements (under 16/13),
            and the India DPDP minor protection rules (under 18):
          </Text>
          <Text as="p" color="secondary">
            We do not knowingly solicit, collect, or process personal data from children under thirteen (13) years of age (or minors under applicable national laws)
            without verifiable parental or guardian consent. If we become aware that a child has provided us with personal information, we immediately delete
            such records from our databases and terminate the associated account. Parents or guardians who believe their child has registered may contact{' '}
            <Text as="span" weight="semibold" color="primary">{siteConfig.email.privacy}</Text> for swift removal.
          </Text>
        </VStack>

        <Divider />

        {/* Section 8: Policy Updates */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>8. Updates to this Privacy Policy</Heading>
          <Text as="p" color="secondary">
            We review and update this Privacy Policy periodically to reflect new legal requirements, regulatory guidance, or platform features.
            The &quot;Effective Date&quot; at the top reflects the latest revision. Continued use of {siteConfig.name} after notice of modifications constitutes
            acknowledgment of the updated policy.
          </Text>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
