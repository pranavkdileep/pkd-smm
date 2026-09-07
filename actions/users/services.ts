'use server';

import {collections} from '@/lib/db';
import type {Service, ServicePlatform, ServiceSortOption} from '@/lib/database';
import {PLATFORM_TYPES, SERVICE_SORT_OPTIONS} from '@/lib/database';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const DEFAULT_SORT: ServiceSortOption = 'name-asc';

const SORT_SPECS: Record<ServiceSortOption, Record<string, 1 | -1>> = {
  'name-asc': {name: 1},
  'name-desc': {name: -1},
  'price-asc': {price: 1},
  'price-desc': {price: -1},
};

/** Sanitized catalog row for the user dashboard — no upstream linkage or order-form config. */
export interface CatalogServiceRow extends Record<string, unknown> {
  id: string;
  platform: ServicePlatform;
  name: string;
  description: string;
  price: number;
  minOrder: number;
  maxOrder: number;
  refill: boolean;
  cancel: boolean;
}

export interface ListCatalogServicesResult {
  services: CatalogServiceRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clampPageSize(value: number | undefined): number {
  if (!Number.isFinite(value) || (value ?? 0) < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(value as number, MAX_PAGE_SIZE);
}

function clampPage(value: number | undefined, totalPages: number): number {
  if (!Number.isFinite(value) || (value ?? 1) < 1) {
    return 1;
  }
  return Math.min(value as number, totalPages);
}

function toRow(service: Service): CatalogServiceRow {
  return {
    id: service.id,
    // Legacy documents created before this field existed fall back to the first platform.
    platform: service.platform ?? PLATFORM_TYPES[0],
    name: service.name,
    description: service.description ?? '',
    price: service.price,
    minOrder: service.minOrder,
    maxOrder: service.maxOrder,
    refill: service.refill,
    cancel: service.cancel,
  };
}

/**
 * Lists active services for the user dashboard catalog. Public catalog data —
 * the /user layout already redirects unauthenticated visitors.
 */
export async function listCatalogServices(input: {
  page?: number;
  pageSize?: number;
  search?: string;
  platform?: string;
  sort?: string;
}): Promise<ListCatalogServicesResult> {
  const filter: Record<string, unknown> = {status: 'active'};

  const trimmed = (input.search ?? '').trim();
  if (trimmed) {
    const pattern = new RegExp(escapeRegex(trimmed), 'i');
    filter.$or = [{name: pattern}, {description: pattern}];
  }
  if ((PLATFORM_TYPES as readonly string[]).includes(input.platform ?? '')) {
    filter.platform = input.platform;
  }
  const sort: ServiceSortOption = (SERVICE_SORT_OPTIONS as readonly string[]).includes(input.sort ?? '')
    ? (input.sort as ServiceSortOption)
    : DEFAULT_SORT;

  const pageSize = clampPageSize(input.pageSize);
  const total = await collections.services.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const services = await collections.services
    .find(filter, {
      // id tiebreak keeps pages stable when names or prices collide.
      sort: {...SORT_SPECS[sort], id: 1},
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  return {
    services: services.map(toRow),
    total,
    page,
    pageSize,
    totalPages,
  };
}
