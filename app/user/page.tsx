import {CirclePlus} from 'lucide-react';

import {PageStub} from './PageStub';

export const metadata = {
  title: 'New Order · PKD-SMM Panel',
};

export default function NewOrderPage() {
  return (
    <PageStub
      title="New Order"
      description="Pick a service, drop in your link, and boost any platform in minutes."
      icon={CirclePlus}
      emptyTitle="The order form is on its way"
      emptyDescription="Service selection, link entry, and quantity controls will appear here."
    />
  );
}
