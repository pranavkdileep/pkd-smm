import { VStack } from '@astryxdesign/core/VStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Card } from '@astryxdesign/core/Card';
import { Divider } from '@astryxdesign/core/Divider';

import { getUserDepositsPage } from '@/actions/deposits/status';

import { AddFundsForm } from './AddFundsForm';
import { DepositHistory } from './DepositHistory';
import { PaymentResultBanner } from './PaymentResultBanner';
import { siteConfig } from '@/lib/config';

export const metadata = {
  title: `Add Funds · ${siteConfig.name}`,
};

interface AddFundsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AddFundsPage({ searchParams }: AddFundsPageProps) {
  const params = await searchParams;
  const payment = firstParam(params.payment);
  // First page is rendered on the server; DepositHistory fetches further
  // pages through the paginated status.ts server action.
  const initialPage = await getUserDepositsPage();

  return (
    // Deposit page per the Astryx settings/forms archetype: one self-contained
    // Add Funds card (the only Card on the page) above a dense, edge-to-edge
    // history table  no card soup, one containment layer for the form.
    <VStack gap={8} className="w-full pt-6 px-6 pb-10">
      <VStack gap={1}>
        <Heading level={1}>Add Funds</Heading>
        <Text color="secondary">
          Top up your balance via Dodo Payments  cards, net banking, UPI, and global
          wallets.
        </Text>
      </VStack>

      {payment ? (
        <PaymentResultBanner
          payment={payment}
          depositId={firstParam(params.deposit_id)}
          amount={firstParam(params.amount)}
          error={firstParam(params.error)}
          alreadyCredited={firstParam(params.already_credited) === '1'}
        />
      ) : null}

      <Card padding={6} maxWidth={560}>
        <AddFundsForm />
      </Card>

      <Divider />

      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={2}>Deposit history</Heading>
          <Text size="sm" color="secondary">
            Every top-up on your account, newest first. Pending deposits can be
            re-checked against the gateway at any time.
          </Text>
        </VStack>
        <DepositHistory initialPage={initialPage} />
      </VStack>
    </VStack>
  );
}
