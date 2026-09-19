import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';

import {listUpstreams} from '@/actions/admin/upstreams';
import {UPSTREAM_PAGE_SIZES} from '@/lib/database';
import {UpstreamsManager} from './UpstreamsManager';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Upstream Providers · ${siteConfig.adminName}`,
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

export default async function AdminUpstreamsPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const search = firstParam(params.q) ?? '';
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize = pageSizeParam && (UPSTREAM_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
    ? pageSizeParam
    : undefined;

  const result = await listUpstreams({page, pageSize, search});
  const isFiltered = Boolean(search.trim());

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Upstream Providers</Heading>
        <Text color="secondary">
          {result.total.toLocaleString()} {result.total === 1 ? 'provider' : 'providers'} configured.
        </Text>
      </VStack>

      <UpstreamsManager
        upstreams={result.upstreams}
        initialSearch={search}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        totalPages={result.totalPages}
        isFiltered={isFiltered}
      />
    </VStack>
  );
}
