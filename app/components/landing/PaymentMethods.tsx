import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';

import { PAYMENTS } from './content';
import { NamedIcon, type NamedIconName } from './NamedIcon';
import { SectionIntro } from './SectionIntro';

const PAYMENT_ICONS: NamedIconName[] = [
  'credit-card',
  'landmark',
  'banknote',
  'wallet',
  'bitcoin',
  'coins',
];

const PAYMENT_TINTS = [
  'bg-blue-subtle text-blue-vivid',
  'bg-orange-subtle text-orange-vivid',
  'bg-purple-subtle text-purple-vivid',
  'bg-cyan-subtle text-cyan-vivid',
  'bg-yellow-subtle text-yellow-vivid',
  'bg-green-subtle text-green-vivid',
];

export function PaymentMethods() {
  return (
    <section aria-label="Payment methods" className="border-y border-border bg-surface py-16 md:py-20">
      <VStack maxWidth={1280} gap={8} className="mx-auto w-full px-6">
        <SectionIntro
          eyebrow="Add funds"
          title="Payment methods"
          lead="Top up your balance with cards or crypto and it is credited instantly  orders spend straight from your balance."
          align="center"
        />

        <Grid columns={{ minWidth: 190, max: 6 }} gap={3}>
          {PAYMENTS.map((payment, index) => (
            <Card key={payment.name} padding={3} elevation="low">
              <VStack gap={2} align="start">
                <HStack
                  width={10}
                  height={10}
                  hAlign="center"
                  vAlign="center"
                  className={`rounded-lg ${PAYMENT_TINTS[index]}`}
                >
                  <NamedIcon name={PAYMENT_ICONS[index]} size="md" />
                </HStack>
                <VStack gap={0.5} align="start">
                  <Text weight="bold">{payment.name}</Text>
                  <Text size="xsm" color="secondary">
                    {payment.detail}
                  </Text>
                </VStack>
              </VStack>
            </Card>
          ))}
        </Grid>

        <Text size="sm" color="secondary" justify="center">
          Deposits are credited automatically. Refund rules are written on every service before you pay.
        </Text>
      </VStack>
    </section>
  );
}
