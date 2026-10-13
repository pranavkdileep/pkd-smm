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

export function PaymentMethods() {
  return (
    <section aria-label="Payment methods" className="border-t border-border bg-surface py-14 md:py-20">
      <VStack maxWidth={1280} gap={8} className="mx-auto w-full px-6">
        <SectionIntro
          eyebrow="Add funds"
          title="Payment methods"
          lead="Top up your balance with cards or crypto and it is credited instantly  orders spend straight from your balance."
          align="center"
        />

        <Grid columns={{ minWidth: 190, max: 6 }} gap={3}>
          {PAYMENTS.map((payment, index) => (
            <Card key={payment.name} padding={4}>
              <VStack gap={2} align="start">
                <HStack
                  hAlign="center"
                  vAlign="center"
                  className="size-10 rounded-lg border border-border bg-body text-primary"
                >
                  <NamedIcon name={PAYMENT_ICONS[index]} size="sm" />
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
