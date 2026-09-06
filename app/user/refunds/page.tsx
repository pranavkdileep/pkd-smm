import {RotateCcw} from 'lucide-react';

import {PageStub} from '../PageStub';

export const metadata = {
  title: 'Refunds · PKD-SMM Panel',
};

export default function RefundsPage() {
  return (
    <PageStub
      title="Refunds"
      description="Review refunded orders and returned balances in one place."
      icon={RotateCcw}
      emptyTitle="Nothing to refund"
      emptyDescription="Refill and refund requests for your orders will appear here."
    />
  );
}
