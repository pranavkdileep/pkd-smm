import {Layers} from 'lucide-react';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';

import {getCurrentUser} from '@/actions/auth/session';
import {getDefaultOrderService, getOrderServiceById} from '@/actions/users/services';

import {OrderForm} from './OrderForm';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `New Order · ${siteConfig.name}`,
};

type SearchParams = Promise<{[key: string]: string | string[] | undefined}>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewOrderPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  // Deep link from the services catalog (?service=<id>) pre-selects that service.
  const serviceId = firstParam(params.service)?.trim() ?? '';

  // The layout already redirects unauthenticated visitors, so user is present.
  const [user, requested, fallback] = await Promise.all([
    getCurrentUser(),
    serviceId ? getOrderServiceById(serviceId) : Promise.resolve(null),
    getDefaultOrderService(),
  ]);
  // Unknown or inactive ids fall back to the first active service.
  const defaultService = requested ?? fallback;

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

