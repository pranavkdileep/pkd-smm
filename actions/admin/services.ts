'use server';

import {revalidatePath} from 'next/cache';
import {randomUUID} from 'node:crypto';

import {collections} from '@/lib/db';
import type {Service, ServicePlatform} from '@/lib/database';
import {PLATFORM_TYPES, SERVICE_MAX_INPUTS} from '@/lib/database';
import {getSession} from '@/actions/auth/session';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export type ServiceStatus = 'active' | 'inactive';

export type {ServicePlatform};

/** Sanitized service row sent to the admin UI. */
export interface AdminServiceRow extends Record<string, unknown> {
  id: string;
  platform: ServicePlatform;
  name: string;
  description: string;
  status: ServiceStatus;
  price: number;
  minOrder: number;
  maxOrder: number;
  refill: boolean;
  cancel: boolean;
  inputs: Record<string, string>;
  upstreamId: string;
  upstreamServiceId: string;
  /** Resolved provider name for display when the service has an upstream. */
  upstreamName: string;
}

export interface ListServicesResult {
  services: AdminServiceRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Create/update payload accepted from the admin UI. */
export interface ServiceInput {
  platform: ServicePlatform;
  name: string;
  description: string;
  status: ServiceStatus;
  price: number;
  minOrder: number;
  maxOrder: number;
  refill: boolean;
  cancel: boolean;
  /** Order-form fields: key = machine name, value = human label. Max 10 entries. */
  inputs: Record<string, string>;
  /** Upstream linkage — required by validation. */
  upstreamId?: string;
  upstreamServiceId?: string;
}

export type MutationResult = {success: true} | {success: false; error: string};

async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === 'admin';
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFilter(search: string): Record<string, unknown> {
  const trimmed = search.trim();
  if (!trimmed) {
    return {};
  }
  const pattern = new RegExp(escapeRegex(trimmed), 'i');
  return {$or: [{name: pattern}, {description: pattern}]};
}

function clampPage(value: number | undefined, totalPages: number): number {
  if (!Number.isFinite(value) || (value ?? 1) < 1) {
    return 1;
  }
  return Math.min(value as number, totalPages);
}

function clampPageSize(value: number | undefined): number {
  if (!Number.isFinite(value) || (value ?? 0) < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(value as number, MAX_PAGE_SIZE);
}

function toRow(service: Service, upstreamName: string): AdminServiceRow {
  return {
    id: service.id,
    // Legacy documents created before this field existed fall back to the first platform.
    platform: service.platform ?? PLATFORM_TYPES[0],
    name: service.name,
    description: service.description,
    status: service.status,
    price: service.price,
    minOrder: service.minOrder,
    maxOrder: service.maxOrder,
    refill: service.refill,
    cancel: service.cancel,
    inputs: service.inputs ?? {},
    upstreamId: service.upstreamId ?? '',
    upstreamServiceId: service.upstreamServiceId ?? '',
    upstreamName,
  };
}

/** Slugifies an input key so order data stays consistent. */
function slugifyKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeInputs(inputs: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, label] of Object.entries(inputs)) {
    const slug = slugifyKey(key);
    const trimmedLabel = label.trim();
    if (slug && trimmedLabel) {
      normalized[slug] = trimmedLabel;
    }
  }
  return normalized;
}

function validateServiceInput(input: ServiceInput): string | null {
  if (!PLATFORM_TYPES.includes(input.platform)) {
    return 'Invalid platform.';
  }
  if (!input.name || !input.name.trim()) {
    return 'Service name is required.';
  }
  if (!Number.isFinite(input.price) || input.price < 0) {
    return 'Price must be a number of 0 or more.';
  }
  if (!Number.isFinite(input.minOrder) || input.minOrder < 0) {
    return 'Minimum order must be a number of 0 or more.';
  }
  if (!Number.isFinite(input.maxOrder) || input.maxOrder < 1) {
    return 'Maximum order must be a number of 1 or more.';
  }
  if (input.maxOrder < input.minOrder) {
    return 'Maximum order cannot be smaller than the minimum order.';
  }
  if (input.status !== 'active' && input.status !== 'inactive') {
    return 'Invalid status.';
  }
  if (!input.upstreamId || !input.upstreamId.trim()) {
    return 'Upstream provider is required.';
  }
  if (!input.upstreamServiceId || !input.upstreamServiceId.trim()) {
    return 'Upstream service ID is required.';
  }

  const entries = Object.entries(input.inputs ?? {});
  if (entries.length === 0) {
    return 'Add at least one input field for the order form.';
  }
  if (entries.length > SERVICE_MAX_INPUTS) {
    return `A service can have at most ${SERVICE_MAX_INPUTS} input fields.`;
  }
  const seenKeys = new Set<string>();
  for (const [key, label] of entries) {
    const slug = slugifyKey(key);
    if (!slug) {
      return 'Every input field needs a name (letters and numbers).';
    }
    if (seenKeys.has(slug)) {
      return `Duplicate input field name: "${slug}".`;
    }
    seenKeys.add(slug);
    if (!label || !label.trim()) {
      return `Input field "${slug}" needs a label.`;
    }
  }
  return null;
}

export async function listServices(input: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ListServicesResult> {
  const filter = buildFilter(input.search ?? '');
  const pageSize = clampPageSize(input.pageSize);

  const total = await collections.services.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const services = await collections.services
    .find(filter, {
      sort: {name: 1},
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  const upstreamIds = [...new Set(services.map((service) => service.upstreamId).filter(Boolean))];
  const upstreams = upstreamIds.length
    ? await collections.upstreamProviders.find({id: {$in: upstreamIds}}).toArray()
    : [];
  const nameById = new Map(upstreams.map((upstream) => [upstream.id, upstream.name]));

  return {
    services: services.map((service) => toRow(service, nameById.get(service.upstreamId) ?? '')),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function createService(input: ServiceInput): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Admin session required.'};
  }
  const validationError = validateServiceInput(input);
  if (validationError) {
    return {success: false, error: validationError};
  }

  const service: Service = {
    id: randomUUID(),
    platform: input.platform,
    name: input.name.trim(),
    description: input.description.trim(),
    status: input.status,
    price: input.price,
    minOrder: input.minOrder,
    maxOrder: input.maxOrder,
    refill: input.refill,
    cancel: input.cancel,
    inputs: normalizeInputs(input.inputs),
    upstreamId: input.upstreamId?.trim() ?? '',
    upstreamServiceId: input.upstreamServiceId?.trim() ?? '',
  };

  await collections.services.insertOne(service);

  revalidatePath('/admin/services');
  revalidatePath('/admin');
  return {success: true};
}

export async function updateService(serviceId: string, input: ServiceInput): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Admin session required.'};
  }
  if (!serviceId) {
    return {success: false, error: 'Service id is required.'};
  }
  const validationError = validateServiceInput(input);
  if (validationError) {
    return {success: false, error: validationError};
  }

  const result = await collections.services.updateOne(
    {id: serviceId},
    {
      $set: {
        platform: input.platform,
        name: input.name.trim(),
        description: input.description.trim(),
        status: input.status,
        price: input.price,
        minOrder: input.minOrder,
        maxOrder: input.maxOrder,
        refill: input.refill,
        cancel: input.cancel,
        inputs: normalizeInputs(input.inputs),
        upstreamId: input.upstreamId?.trim() ?? '',
        upstreamServiceId: input.upstreamServiceId?.trim() ?? '',
      },
    },
  );
  if (result.matchedCount === 0) {
    return {success: false, error: 'Service not found.'};
  }

  revalidatePath('/admin/services');
  revalidatePath('/admin');
  return {success: true};
}

export async function setServiceStatus(
  serviceId: string,
  status: ServiceStatus,
): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Admin session required.'};
  }
  if (status !== 'active' && status !== 'inactive') {
    return {success: false, error: 'Invalid status.'};
  }

  const result = await collections.services.updateOne({id: serviceId}, {$set: {status}});
  if (result.matchedCount === 0) {
    return {success: false, error: 'Service not found.'};
  }

  revalidatePath('/admin/services');
  revalidatePath('/admin');
  return {success: true};
}

export async function deleteService(serviceId: string): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return {success: false, error: 'Admin session required.'};
  }

  const result = await collections.services.deleteOne({id: serviceId});
  if (result.deletedCount === 0) {
    return {success: false, error: 'Service not found.'};
  }

  revalidatePath('/admin/services');
  revalidatePath('/admin');
  return {success: true};
}
