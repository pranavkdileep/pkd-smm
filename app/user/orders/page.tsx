import {ClipboardList} from 'lucide-react';

import {PageStub} from '../PageStub';

export const metadata = {
  title: 'Orders · PKD-SMM Panel',
};

export default function OrdersPage() {
  return (
    <PageStub
      title="Orders"
      description="Track every order you have placed — status, progress, and history."
      icon={ClipboardList}
      emptyTitle="No orders yet"
      emptyDescription="Your order history and live order tracking will appear here."
    />
  );
}
