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
  title: `Refund Policy · ${siteConfig.name}`,
  description: `Official Refund, Refill, and Cancellation Policy for ${siteConfig.name} digital services, EU 14-day cooling-off consumer terms, and wallet balance rules.`,
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      title="Refund, Refill & Cancellation Policy"
      subtitle={`Clear terms regarding wallet balance refunds, order cancellations, free refill guarantees, and statutory withdrawal rights under the EU Consumer Rights Directive.`}
      effectiveDate={siteConfig.legal.effectiveDate}
      jurisdictions={['EU Consumer Rights Directive', 'UK Consumer Contracts Regs', 'US Uniform Commercial Code', 'Australian Consumer Law']}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Digital Goods Nature */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. Nature of Digital SMM Services</Heading>
          <Text as="p" color="secondary">
            All services offered on <strong className="text-primary">{siteConfig.name}</strong> are intangible digital marketing services,
            social media engagements, and automated promotional deliveries. Because digital goods and engagement actions begin execution
            promptly upon submission, specialized refund rules apply to balance deposits and live orders.
          </Text>
        </VStack>

        <Divider />

        {/* Section 2: Statutory 14-Day Cooling-off Right & Digital Exception */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. EU/UK Statutory Cooling-Off Rights & Digital Exception</Heading>
          <Text as="p" color="secondary">
            Under European Union consumer protection law (<strong className="text-primary">Article 16(m) of the Consumer Rights Directive 2011/83/EU</strong>)
            and the United Kingdom <strong className="text-primary">Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong>,
            consumers generally benefit from a 14-day &quot;cooling-off&quot; period to withdraw from distance contracts.
          </Text>
          <VStack gap={2} className="w-full rounded-lg border border-border bg-card p-4">
            <HStack gap={2} vAlign="center">
              <Badge variant="blue" label="Statutory Exception" />
              <Text size="sm" weight="bold">Waiver of Withdrawal upon Service Execution</Text>
            </HStack>
            <Text size="sm" color="secondary">
              In accordance with statutory consumer law, you expressly acknowledge and agree that when you submit an order for digital social media
              delivery, performance begins immediately. Consequently, your statutory 14-day right of withdrawal ceases once the digital service has
              commenced with your prior express consent.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Wallet Deposits & Unspent Balances */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Wallet Balance Refunds</Heading>
          <Text as="p" color="secondary">
            We provide a fair refund policy for unspent deposited funds:
          </Text>
          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Unspent Balance Window:</strong> If you deposit funds into your {siteConfig.name} wallet and decide not to use them,
              you may request a refund of your unspent balance to the original payment method within fourteen (14) calendar days of deposit.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Deduction of Payment Fees:</strong> Gateway processing fees incurred during the deposit (e.g., Stripe,
              DodoPayments, or blockchain network gas fees) are non-refundable and will be deducted from the refunded sum.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Processing Time:</strong> Approved wallet refunds are initiated within 3 to 5 business days, after which
              your bank or card issuer will credit your account in accordance with their standard processing timelines.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 4: Order Cancellations & Partial Fulfillments */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. Order Cancellations & Partial Fulfillments</Heading>
          <Text as="p" color="secondary">
            Once an order is submitted to the upstream network:
          </Text>
          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">In-Progress Orders:</strong> Orders that have transitioned to &quot;In Progress&quot; or &quot;Processing&quot; status
              cannot be paused, modified, or canceled manually because automated network nodes have already begun dispatching engagement.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Failed / Canceled Orders:</strong> If an order fails due to an upstream server error, invalid target URL,
              or platform maintenance, the full unspent order amount is <strong className="text-primary">automatically credited back to your account balance</strong> immediately.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Partial Deliveries:</strong> If an order can only be partially completed (for example, 700 followers out of 1,000 delivered
              before an account privacy change), the unfulfilled remaining portion (300 followers) is automatically refunded back to your wallet balance.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 5: Refill Guarantee Policy */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>5. Service Drops & Refill Guarantees</Heading>
          <Text as="p" color="secondary">
            Due to periodic social media platform algorithm updates and purge cycles, natural drops in followers, likes, or views may occur.
            To protect your investment, we offer clear refill guarantee terms:
          </Text>
          <VStack gap={3} className="w-full">
            <VStack gap={2} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="green" label="Coverage" />
                <Text size="sm" weight="bold">Refill Windows (30-Day, 60-Day, Lifetime)</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Each service in our catalog specifies its exact refill terms before you checkout. If your metric count drops below the recorded
                start count + ordered quantity during the active guarantee period, you are entitled to free replenishment.
              </Text>
              <Text size="xsm" color="secondary">
                To initiate a refill, simply locate the order in your User Dashboard and click &quot;Refill&quot;, or submit a ticket to our 24/7 support team.
              </Text>
            </VStack>

            <VStack gap={2} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="neutral" label="Conditions" />
                <Text size="sm" weight="bold">Refill Eligibility Conditions</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Refills apply only if the account and target link remain public. If the account was set to private, username changed, or post deleted,
                the refill guarantee is voided. Furthermore, if you order from multiple providers simultaneously on the same link, counts cannot be
                accurately attributed and refill requests cannot be honored.
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 6: Chargebacks & Disputes */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>6. Chargebacks and Payment Disputes</Heading>
          <Text as="p" color="secondary">
            We are committed to resolving customer concerns swiftly through our 24/7 ticketing system. Opening an unauthorized chargeback or fraudulent
            payment dispute constitutes a material breach of our Terms of Service.
          </Text>
          <VStack gap={2} className="w-full rounded-lg border border-border bg-card p-4">
            <Text size="sm" color="secondary">
              • In the event of an unnotified chargeback, payment dispute, or reversal filed via your bank or payment provider:
            </Text>
            <Text size="sm" color="secondary">
              1. Your {siteConfig.name} account will be immediately and permanently terminated.
            </Text>
            <Text size="sm" color="secondary">
              2. Any remaining wallet balance will be permanently forfeited.
            </Text>
            <Text size="sm" color="secondary">
              3. Associated payment methods, IP addresses, and customer profiles will be blacklisted across our merchant network.
            </Text>
            <Text size="sm" color="secondary">
              Always contact our support team at <Text as="span" weight="semibold" color="primary">{siteConfig.email.support}</Text> or submit a ticket
              before disputing a charge. We will gladly investigate and resolve legitimate issues promptly.
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
