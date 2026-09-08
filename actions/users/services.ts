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

const ORDER_SEARCH_LIMIT = 8;

/** Never let upstream linkage leak into client-bound order data. */
const ORDER_SERVICE_PROJECTION = {upstreamId: 0, upstreamServiceId: 0};

/** Sanitized service for the new-order form — includes the order-form field config. */
export interface OrderServiceDetails extends Record<string, unknown> {
  id: string;
  platform: ServicePlatform;
  name: string;
  description: string;
  price: number;
  minOrder: number;
  maxOrder: number;
  refill: boolean;
  cancel: boolean;
  /** Order-form fields the buyer must fill in (slug -> label). */
  inputs: Record<string, string>;
}

function toOrderDetails(service: Service): OrderServiceDetails {
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
    inputs: service.inputs ?? {},
  };
}

/**
 * Fast typeahead search for the new-order form. An empty query returns the
 * first few active services (dropdown bootstrap); otherwise a case-insensitive
 * substring match on name/description, capped at a handful of rows so the
 * response stays small. Public catalog data — the /user layout already
 * redirects unauthenticated visitors.
 */
export async function searchOrderServices(query: string): Promise<OrderServiceDetails[]> {
  const filter: Record<string, unknown> = {status: 'active'};

  const trimmed = query.trim();
  if (trimmed) {
    const pattern = new RegExp(escapeRegex(trimmed), 'i');
    filter.$or = [{name: pattern}, {description: pattern}];
  }

  const services = await collections.services
    .find(filter, {
      projection: ORDER_SERVICE_PROJECTION,
      // id tiebreak keeps result order stable when names collide.
      sort: {name: 1, id: 1},
      limit: ORDER_SEARCH_LIMIT,
    })
    .toArray();

  return services.map(toOrderDetails);
}

/** First active service in catalog order — the default selection on the new-order form. */
export async function getDefaultOrderService(): Promise<OrderServiceDetails | null> {
  const service = await collections.services.findOne(
    {status: 'active'},
    {projection: ORDER_SERVICE_PROJECTION, sort: {name: 1, id: 1}}
  );
  return service ? toOrderDetails(service) : null;
}

/**
 * Resolves one active service by id for deep links into the new-order form
 * (e.g. /user?service=<id>). Returns null for unknown or inactive services so
 * the caller can fall back to the default selection.
 */
export async function getOrderServiceById(id: string): Promise<OrderServiceDetails | null> {
  const trimmed = id.trim();
  if (!trimmed) {
    return null;
  }
  const service = await collections.services.findOne(
    {id: trimmed, status: 'active'},
    {projection: ORDER_SERVICE_PROJECTION}
  );
  return service ? toOrderDetails(service) : null;
}
