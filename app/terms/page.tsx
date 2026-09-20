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
  title: `Terms of Service · ${siteConfig.name}`,
  description: `Legally binding Terms of Service and End-User Agreement governing your use of ${siteConfig.name}, order placement, wallet balances, refill guarantees, and liability limitations.`,
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service & User Agreement"
      subtitle={`The legally binding terms and contractual conditions governing access to and use of the ${siteConfig.name} platform, services catalog, wallet deposits, and order delivery.`}
      effectiveDate={siteConfig.legal.effectiveDate}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Acceptance */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. Acceptance of Terms</Heading>
          <Text as="p" color="secondary">
            These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a legally binding agreement between you
            (&quot;Customer&quot;, &quot;User&quot;, &quot;you&quot;) and <strong className="text-primary">{siteConfig.name}</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
            By visiting our website at <strong className="text-primary">{siteConfig.domain}</strong>, registering an account, depositing funds,
            or placing any service order, you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms
            and our Privacy Policy.
          </Text>
          <Text as="p" color="secondary">
            If you do not agree with any provision set forth in this Agreement, you must immediately discontinue use of the platform.
          </Text>
        </VStack>

        <Divider />

        {/* Section 2: Eligibility */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. Eligibility and Account Registration</Heading>
          <Text as="p" color="secondary">
            To be eligible to access {siteConfig.name} and purchase services, you affirm and warrant that:
          </Text>
          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • You are at least eighteen (18) years of age, or have attained the legal age of majority in your jurisdiction.
            </Text>
            <Text size="sm" color="secondary">
              • You have full legal power and capacity to enter into a binding contract and are not barred from receiving services under applicable law.
            </Text>
            <Text size="sm" color="secondary">
              • You will maintain the absolute confidentiality of your account credentials and bear full responsibility for all activities, deposits,
              and order submissions that occur under your account.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Services Description & Passwords Guarantee */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Services Description & Delivery Mechanism</Heading>
          <Text as="p" color="secondary">
            {siteConfig.name} provides a centralized social media marketing (SMM) dashboard allowing users to purchase engagement and growth metrics
            (including followers, likes, views, reactions, and comments) across multiple third-party social networks.
          </Text>
          <VStack gap={2} className="w-full rounded-lg border border-border bg-card p-4">
            <HStack gap={2} vAlign="center">
              <Badge variant="blue" label="Core Operational Rule" />
              <Text size="sm" weight="bold">Public URLs Only — No Passwords</Text>
            </HStack>
            <Text size="sm" color="secondary">
              All services on {siteConfig.name} are delivered strictly using publicly accessible links (such as profile links, public channel URLs,
              or public post addresses). We never ask for, require, or store your social media account passwords. You must never provide login credentials
              to any support agent or within order inputs.
            </Text>
          </VStack>
          <Text as="p" color="secondary">
            You acknowledge that target links submitted must remain completely public and accessible throughout the fulfillment lifecycle.
            Private accounts or links that require authentication will fail to receive delivery and are not eligible for refunds.
          </Text>
        </VStack>

        <Divider />

        {/* Section 4: Independent Third-Party Disclaimer */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. Independent Third-Party Platform Disclaimer</Heading>
          <Text as="p" color="secondary">
            <strong className="text-primary">{siteConfig.name} is an independent marketing automation platform.</strong> We are not affiliated with,
            associated with, authorized by, endorsed by, or in any way officially connected with{' '}
            <strong className="text-primary">Instagram</strong> (Meta Platforms, Inc.), <strong className="text-primary">TikTok</strong> (ByteDance Ltd.),{' '}
            <strong className="text-primary">YouTube</strong> (Google LLC / Alphabet Inc.), <strong className="text-primary">Telegram</strong> (Telegram FZ-LLC),{' '}
            <strong className="text-primary">X</strong> (formerly Twitter / X Corp.), or <strong className="text-primary">Facebook</strong> (Meta Platforms, Inc.),
            or any of their subsidiaries or affiliates.
          </Text>
          <Text as="p" color="secondary">
            All brand names, logos, trademarks, and registered trademarks displayed on this website belong exclusively to their respective owners.
            Reference to these trademarks is purely descriptive to designate the target social network compatible with our routing services.
            You assume full personal responsibility for ensuring your marketing activities comply with the respective third-party platform&apos;s Terms of Use.
          </Text>
        </VStack>

        <Divider />

        {/* Section 5: User Conduct & Prohibited Uses */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>5. User Conduct and Prohibited Activities</Heading>
          <Text as="p" color="secondary">
            You agree not to use the services for any unlawful, fraudulent, harmful, or abusive purpose. In particular, you shall not submit orders:
          </Text>
          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • Targeting content that promotes hate speech, violence, terrorism, illegal substances, or child sexual abuse material (CSAM).
            </Text>
            <Text size="sm" color="secondary">
              • Designed to harass, defame, intimidate, or impersonate real persons or organizations.
            </Text>
            <Text size="sm" color="secondary">
              • Intended to execute fraud, financial scams, deceptive phishing, or malicious botnets.
            </Text>
            <Text size="sm" color="secondary">
              • Utilizing automated scripts, DDoS attacks, or vulnerability scanning against our platform infrastructure without explicit prior written authorization.
            </Text>
          </VStack>
          <Text as="p" color="secondary">
            Any violation of these conduct rules results in immediate account termination and forfeiture of any remaining wallet balance without right of appeal.
          </Text>
        </VStack>

        <Divider />

        {/* Section 6: Wallet Balance, Pricing & Refill Terms */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>6. Deposits, Pricing, and Refill Guarantees</Heading>
          <Text as="p" color="secondary">
            <strong className="text-primary">Wallet Balances:</strong> All orders are deducted from your prepaid virtual wallet balance.
            Deposited funds are non-interest bearing. Currency balances are denominated in USD or equivalent fiat figures displayed on site.
          </Text>
          <Text as="p" color="secondary">
            <strong className="text-primary">Service Performance & Drops:</strong> Social media platforms frequently update their engagement filtering
            and anti-spam algorithms, which can occasionally cause fluctuations or drop-offs in metrics after delivery.
          </Text>
          <Text as="p" color="secondary">
            <strong className="text-primary">Refill Guarantee Policy:</strong> Services marked with a refill guarantee (e.g., 30-day Refill, 60-day Refill,
            or Lifetime Refill) include free automated replenishment if the metric count drops below the initial start count + ordered quantity
            during the active guarantee window. To trigger a refill, users can utilize the dashboard &quot;Refill&quot; button or submit a support ticket
            referencing the order ID.
          </Text>
        </VStack>

        <Divider />

        {/* Section 7: Disclaimer of Warranties */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>7. Disclaimer of Warranties (&quot;As Is&quot;)</Heading>
          <Text as="p" color="secondary">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES, PLATFORM, AND DOCUMENTATION ARE PROVIDED STRICTLY ON AN{' '}
            <strong className="text-primary">&quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS</strong>, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS,
            IMPLIED, STATUTORY, OR OTHERWISE.
          </Text>
          <Text as="p" color="secondary">
            WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            TITLE, QUIET ENJOYMENT, AND NON-INFRINGEMENT. WE MAKE NO REPRESENTATION OR WARRANTY THAT (A) THE SERVICES WILL MEET YOUR SPECIFIC MARKETING
            REQUIREMENTS, (B) THE PLATFORM WILL OPERATE UNINTERRUPTED OR ERROR-FREE, OR (C) THIRD-PARTY SOCIAL NETWORKS WILL NOT SUSPEND, DEMOTE, OR RESTRICT
            YOUR PUBLIC ACCOUNTS AS A RESULT OF THIRD-PARTY PLATFORM POLICY ENFORCEMENT.
          </Text>
        </VStack>

        <Divider />

        {/* Section 8: Limitation of Liability */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>8. Limitation of Liability</Heading>
          <Text as="p" color="secondary">
            IN NO EVENT SHALL {siteConfig.name}, ITS DIRECTORS, EMPLOYEES, AFFILIATES, AGENTS, OR UPSTREAM SUPPLIERS BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, LOSS OF AUDIENCE,
            DATA LOSS, BUSINESS INTERRUPTION, REPUTATIONAL INJURY, OR ACCOUNT RESTRICTION BY THIRD-PARTY NETWORKS, ARISING OUT OF OR IN CONNECTION WITH
            YOUR USE OF OR INABILITY TO USE THE PLATFORM.
          </Text>
          <Text as="p" color="secondary">
            OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THIS AGREEMENT SHALL UNDER NO CIRCUMSTANCES EXCEED THE TOTAL
            AMOUNT PAID BY YOU TO {siteConfig.name} IN THE THIRTY (30) DAYS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE ALLEGED LIABILITY.
          </Text>
        </VStack>

        <Divider />

        {/* Section 9: Governing Law & Dispute Resolution */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>9. Governing Law and Dispute Resolution</Heading>
          <Text as="p" color="secondary">
            This Agreement shall be governed by and construed in accordance with standard civil and commercial contract law principles, without regard
            to conflict of law provisions.
          </Text>
          <Text as="p" color="secondary">
            <strong className="text-primary">Informal Dispute Resolution:</strong> Prior to initiating any formal legal proceeding or arbitration, you agree
            to first contact our legal team at <Text as="span" weight="semibold" color="primary">{siteConfig.email.privacy}</Text> to attempt informal resolution
            in good faith for at least thirty (30) business days.
          </Text>
          <Text as="p" color="secondary">
            If informal negotiation fails, any controversy or claim shall be submitted to final and binding arbitration administered under recognized
            international arbitration rules, or before courts of competent commercial jurisdiction.
          </Text>
        </VStack>

        <Divider />

        {/* Section 10: Severability and Modifications */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>10. Severability, Modifications, and Termination</Heading>
          <Text as="p" color="secondary">
            If any provision of these Terms is deemed unlawful, void, or for any reason unenforceable, that provision shall be deemed severable
            and shall not affect the validity and enforceability of any remaining provisions.
          </Text>
          <Text as="p" color="secondary">
            We reserve the right to amend these Terms at any time. Material updates will be indicated by the Effective Date above. Continued use
            of {siteConfig.name} following posted modifications constitutes your acceptance of the revised terms.
          </Text>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
