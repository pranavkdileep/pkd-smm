import {Layers} from 'lucide-react';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';

import {getCurrentUser} from '@/actions/auth/session';
import {getDefaultOrderService} from '@/actions/users/services';

import {OrderForm} from './OrderForm';

export const metadata = {
  title: 'New Order · PKD-SMM Panel',
};

export default async function NewOrderPage() {
  // The layout already redirects unauthenticated visitors, so user is present.
  const [user, defaultService] = await Promise.all([getCurrentUser(), getDefaultOrderService()]);

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>New Order</Heading>
        <Text color="secondary">
          Search the catalog, fill in the service details, and place your order — rates are per 1K.
        </Text>
      </VStack>
      {defaultService ? (
        <OrderForm initialService={defaultService} balance={user?.balance ?? 0} />
      ) : (
        <EmptyState
          headingLevel={2}
          icon={<Layers size={28} className="text-secondary" aria-hidden="true" />}
          title="No services available yet"
          description="Active services will appear here as soon as one is added."
        />
      )}
    </VStack>
  );
}

