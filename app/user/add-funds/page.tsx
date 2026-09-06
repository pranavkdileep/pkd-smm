import {Wallet} from 'lucide-react';

import {PageStub} from '../PageStub';

export const metadata = {
  title: 'Add Funds · PKD-SMM Panel',
};

export default function AddFundsPage() {
  return (
    <PageStub
      title="Add Funds"
      description="Top up your balance with the payment method you prefer."
      icon={Wallet}
      emptyTitle="Deposits are almost ready"
      emptyDescription="Payment gateways and top-up amounts will appear here."
    />
  );
}
