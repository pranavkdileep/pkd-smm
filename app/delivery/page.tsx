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
  title: `Delivery Policy · ${siteConfig.name}`,
  description: `Digital fulfillment terms, start times, drip-feed delivery mechanics, and public link requirements for ${siteConfig.name} orders.`,
};

export default function DeliveryPolicyPage() {
  return (
    <LegalPageShell
      title="Digital Delivery & Fulfillment Policy"
      subtitle={`Detailed guidelines covering automated digital delivery, estimated start times, drip-feed delivery speeds, public link prerequisites, and order tracking.`}
      effectiveDate={siteConfig.legal.effectiveDate}
      jurisdictions={['Global Digital Commerce', 'FTC Mail/Internet Order Rule', 'EU Consumer Rights Directive', 'Australian Consumer Law']}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Digital Nature */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. Nature of Digital Fulfillment</Heading>
          <Text as="p" color="secondary">
            <strong className="text-primary">{siteConfig.name}</strong> specializes strictly in digital social media engagement
            and automated routing services. We do not dispatch physical parcels, goods, or merchandise. Consequently, no physical postal
            carrier, tracking numbers (e.g., FedEx, UPS, DHL), or customs duties are involved.
          </Text>
          <Text as="p" color="secondary">
            All order deliverables are executed virtually through automated server APIs directly to the target social media profile or post.
          </Text>
        </VStack>

        <Divider />

        {/* Section 2: Start Times and Speeds */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. Order Start Times & Delivery Speed</Heading>
          <Text as="p" color="secondary">
            Every service listed in our catalog features specific estimated parameters displayed prior to order confirmation:
          </Text>

          <VStack gap={3} className="w-full">
            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="blue" label="Instant / Rapid" />
                <Text size="sm" weight="bold">Estimated Start Time</Text>
              </HStack>
              <Text size="sm" color="secondary">
                The majority of services have a start time of 5 to 60 minutes following order submission. During periods of high platform load
                or network updates, initial queue dispatch may take up to a few hours.
              </Text>
            </VStack>

            <VStack gap={1} className="rounded-lg border border-border bg-card p-4" align="start">
              <HStack gap={2} vAlign="center">
                <Badge variant="green" label="Gradual Pace" />
                <Text size="sm" weight="bold">Delivery Speed & Drip-Feed Pacing</Text>
              </HStack>
              <Text size="sm" color="secondary">
                Depending on the service tier selected, deliveries are spaced organically (ranging from hundreds to thousands per day)
                to preserve account health and simulate natural engagement velocity. For high-volume campaigns, our drip-feed system allows
                you to automate staggered batch fulfillment over days or weeks.
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Prerequisites for Successful Delivery */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Prerequisites for Successful Delivery</Heading>
          <Text as="p" color="secondary">
            To guarantee delivery without interruption, you must strictly follow these mandatory requirements:
          </Text>

          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Public Link Requirements:</strong> Your account, channel, or post must remain 100% public
              throughout the entire delivery timeframe. Setting an account to private causes upstream nodes to fail and voids delivery guarantees.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Accurate URL Formatting:</strong> Ensure the link is pasted in the exact format shown in the service
              description (e.g., <Text as="span" className="font-mono text-xs text-primary">https://instagram.com/username</Text> or{' '}
              <Text as="span" className="font-mono text-xs text-primary">https://t.me/channel_name</Text>). Do not submit shortened redirect links or private share tokens.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">No Username Modifications:</strong> Do not change your username or handle while an order is active.
              Changing handles breaks URL routing and prevents automated completion checks.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">No Simultaneous Duplicate Orders:</strong> Never place overlapping orders for the same link
              across multiple panels or providers at the same time. Doing so corrupts start count tracking and makes delivery auditing impossible.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 4: Real-time Status Tracking */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. Real-Time Status Tracking</Heading>
          <Text as="p" color="secondary">
            Every submitted order is monitored in your dashboard with live status updates:
          </Text>

          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Pending:</strong> Order received and queued for dispatch to our upstream server nodes.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Processing:</strong> Server has parsed the public link, verified initial count, and allocated delivery slots.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">In Progress:</strong> Delivery is actively streaming engagement metrics to your link.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Completed:</strong> Target quantity has been fully satisfied and validated.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Partial:</strong> Server could only complete a portion; remaining balance is automatically refunded.
            </Text>
            <Text size="sm" color="secondary">
              • <strong className="text-primary">Canceled:</strong> Order could not start (e.g. private link or invalid URL); funds credited back to wallet immediately.
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 5: Stalled Orders & Support */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>5. Stalled or Delayed Orders Procedure</Heading>
          <Text as="p" color="secondary">
            While over 98% of orders conclude within the estimated timeframe, occasional upstream provider maintenance or social network
            API throttling can cause orders to stall.
          </Text>
          <VStack gap={2} className="w-full rounded-lg border border-border bg-card p-4">
            <Text size="sm" weight="bold">
              Escalation for Stalled Orders:
            </Text>
            <Text size="sm" color="secondary">
              If an order has not started or completed after the advertised turnaround time:
            </Text>
            <Text size="sm" color="secondary">
              1. Verify that your profile or post is still accessible publicly without requiring a login.
            </Text>
            <Text size="sm" color="secondary">
              2. Navigate to your User Dashboard and open a support ticket with your Order ID and subject &quot;Order Status Inquiry&quot;, or email our operations desk at <Text as="span" weight="semibold" color="primary">{siteConfig.email.support}</Text>.
            </Text>
            <Text size="sm" color="secondary">
              3. Our support operators will verify server logs, speed up routing, or cancel and refund the order to your wallet within 12 hours.
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
