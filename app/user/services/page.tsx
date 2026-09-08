import {Layers} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Grid} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listCatalogServices, type CatalogServiceRow} from '@/actions/users/services';
import {
  PLATFORM_TYPES,
  SERVICE_PAGE_SIZES,
  SERVICE_SORT_OPTIONS,
  type ServiceSortOption,
} from '@/lib/database';
import {PLATFORM_LABELS, PLATFORM_TINTS} from '@/app/components/platformMeta';
import {BrandIcon, type PlatformKey} from '@/app/components/landing/BrandIcon';
import {UrlPagination} from '@/app/components/support/UrlPagination';
import {formatAmount} from '@/app/user/add-funds/format';

import {OrderNowButton} from './OrderNowButton';
import {ServicesToolbar} from './ServicesToolbar';

export const metadata = {
  title: 'Services · PKD-SMM Panel',
};

type SearchParams = Promise<{[key: string]: string | string[] | undefined}>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : undefined;
}

function ServiceCard({service}: {service: CatalogServiceRow}) {
  const platformKey = service.platform.toLowerCase() as PlatformKey;
  const perks = [service.refill ? 'Refillable' : '', service.cancel ? 'Cancellable' : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <Card padding={3} elevation="low" className="flex flex-col">
      <VStack gap={3} className="flex-1">
        <HStack gap={2} vAlign="center">
          <HStack
            width={9}
            height={9}
            hAlign="center"
            vAlign="center"
            className={`rounded-lg ${PLATFORM_TINTS[platformKey]}`}
          >
            <BrandIcon platform={platformKey} size="md" />
          </HStack>
          <Text size="sm" color="secondary">
            {PLATFORM_LABELS[platformKey]}
          </Text>
        </HStack>
        <VStack gap={1}>
          <Heading level={4}>{service.name}</Heading>
          {service.description ? (
            <Text size="sm" color="secondary" className="line-clamp-2">
              {service.description}
            </Text>
          ) : null}
        </VStack>
      </VStack>
      <VStack gap={1} className="mt-3 border-t border-border pt-3">
        <HStack justify="between" vAlign="center" width="100%">
          <Text weight="bold">{formatAmount(service.price, 'INR')} / 1K</Text>
          {perks ? (
            <Text size="sm" color="secondary">
              {perks}
            </Text>
          ) : null}
        </HStack>
        <HStack justify="between" vAlign="center" width="100%">
          <Text size="sm" color="secondary">
            Min {service.minOrder.toLocaleString()} · Max {service.maxOrder.toLocaleString()}
          </Text>
          <OrderNowButton serviceId={service.id} />
        </HStack>
      </VStack>
    </Card>
  );
}

export default async function ServicesPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const search = firstParam(params.q)?.trim() ?? '';
  const platformParam = firstParam(params.platform) ?? '';
  const platform = (PLATFORM_TYPES as readonly string[]).includes(platformParam) ? platformParam : '';
  const sortParam = firstParam(params.sort) ?? '';
  const sort: ServiceSortOption = (SERVICE_SORT_OPTIONS as readonly string[]).includes(sortParam)
    ? (sortParam as ServiceSortOption)
    : 'name-asc';
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize =
    pageSizeParam && (SERVICE_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
      ? pageSizeParam
      : undefined;

  const result = await listCatalogServices({page, pageSize, search, platform, sort});
  const isFiltered = Boolean(search || platform);

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Services</Heading>
        <Text color="secondary">
          {result.total === 0
            ? 'Every active service on the panel, with live pricing.'
            : `${result.total.toLocaleString()} ${result.total === 1 ? 'service' : 'services'} · rates per 1K.`}
        </Text>
      </VStack>

      <ServicesToolbar search={search} platform={platform} sort={sort} />

      {result.services.length === 0 ? (
        <EmptyState
          headingLevel={2}
          icon={<Layers size={28} className="text-secondary" aria-hidden="true" />}
          title={isFiltered ? 'No services match your filters' : 'No services yet'}
          description={
            isFiltered
              ? 'Try a different search term or platform.'
              : 'Active services will appear here as soon as one is added.'
          }
        />
      ) : (
        <>
          <Grid columns={{minWidth: 280, max: 3}} gap={3}>
            {result.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </Grid>
          {result.totalPages > 1 ? (
            <HStack justify="end" wrap="wrap">
              <UrlPagination
                label="Services pagination"
                page={result.page}
                pageSize={result.pageSize}
                total={result.total}
                totalPages={result.totalPages}
                pageSizes={SERVICE_PAGE_SIZES}
              />
            </HStack>
          ) : null}
        </>
      )}
    </VStack>
  );
}
