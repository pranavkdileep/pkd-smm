import {Layers} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';

import {listCatalogServices} from '@/actions/users/services';
import {
  PLATFORM_TYPES,
  SERVICE_PAGE_SIZES,
  SERVICE_SORT_OPTIONS,
  type ServiceSortOption,
} from '@/lib/database';
import {UrlPagination} from '@/app/components/support/UrlPagination';

import {ServicesListing} from './ServicesListing';
import {ServicesPlatformTabs, ServicesSearch, ServicesSort} from './ServicesToolbar';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Services · ${siteConfig.name}`,
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
    <VStack gap={6} maxWidth={1040} className="mx-auto w-full px-4 py-8 md:px-8 md:py-10">
      <VStack gap={2} align="center">
        <Heading level={1} justify="center">
          Browse services
        </Heading>
        <Text color="secondary" justify="center">
          Every active service on the panel, with live pricing per 1,000.
        </Text>
      </VStack>

      <VStack maxWidth={640} className="mx-auto w-full">
        <ServicesSearch search={search} platform={platform} sort={sort} />
      </VStack>

      <ServicesPlatformTabs search={search} platform={platform} sort={sort} />

      <VStack gap={3}>
        <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
          <Text color="secondary">
            <Text weight="semibold" color="primary" hasTabularNumbers>
              {result.total.toLocaleString()}
            </Text>{' '}
            {result.total === 1 ? 'service' : 'services'}
          </Text>
          <ServicesSort search={search} platform={platform} sort={sort} />
        </HStack>

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
          <ServicesListing services={result.services} />
        )}
      </VStack>

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
    </VStack>
  );
}
