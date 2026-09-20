'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';

import { collections } from '@/lib/db';
import type { UpstreamProvider } from '@/lib/database';
import { getSession } from '@/actions/auth/session';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const TYPEAHEAD_LIMIT = 25;

/** Sanitized upstream provider row sent to the admin UI. */
export interface AdminUpstreamRow extends Record<string, unknown> {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
}

/** Minimal item used by the service dialog's upstream typeahead. */
export interface UpstreamOption {
  id: string;
  label: string;
}

export interface ListUpstreamsResult {
  upstreams: AdminUpstreamRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UpstreamInput {
  name: string;
  apiUrl: string;
  apiKey: string;
}

/** Service linked to an upstream provider. */
export interface UpstreamLinkedServiceRow extends Record<string, unknown> {
  id: string;
  platform: string;
  name: string;
  price: number;
  status: string;
  minOrder: number;
  maxOrder: number;
}

export interface ListUpstreamServicesResult {
  services: UpstreamLinkedServiceRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type MutationResult = { success: true } | { success: false; error: string };

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
  return { $or: [{ name: pattern }, { apiUrl: pattern }] };
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

function toRow(upstream: UpstreamProvider): AdminUpstreamRow {
  return {
    id: upstream.id,
    name: upstream.name,
    apiUrl: upstream.apiUrl,
    apiKey: upstream.apiKey,
  };
}

function validateUpstreamInput(input: UpstreamInput): string | null {
  if (!input.name || !input.name.trim()) {
    return 'Provider name is required.';
  }
  const apiUrl = input.apiUrl.trim();
  if (!apiUrl) {
    return 'API URL is required.';
  }
  if (!/^https?:\/\//i.test(apiUrl)) {
    return 'API URL must start with http:// or https://.';
  }
  if (!input.apiKey || !input.apiKey.trim()) {
    return 'API key is required.';
  }
  return null;
}

/** Lightweight lookup for the service dialog typeahead  returns only id + name. */
export async function searchUpstreams(query: string): Promise<UpstreamOption[]> {
  const trimmed = query.trim();
  const filter = trimmed ? { name: new RegExp(escapeRegex(trimmed), 'i') } : {};
  const upstreams = await collections.upstreamProviders
    .find(filter, { sort: { name: 1 }, limit: TYPEAHEAD_LIMIT })
    .toArray();
  return upstreams.map((upstream) => ({ id: upstream.id, label: upstream.name }));
}

export async function listUpstreams(input: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ListUpstreamsResult> {
  const filter = buildFilter(input.search ?? '');
  const pageSize = clampPageSize(input.pageSize);

  const total = await collections.upstreamProviders.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(input.page, totalPages);

  const upstreams = await collections.upstreamProviders
    .find(filter, {
      sort: { name: 1 },
      skip: (page - 1) * pageSize,
      limit: pageSize,
    })
    .toArray();

  return {
    upstreams: upstreams.map(toRow),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function createUpstream(input: UpstreamInput): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }
  const validationError = validateUpstreamInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const upstream: UpstreamProvider = {
    id: randomUUID(),
    name: input.name.trim(),
    apiUrl: input.apiUrl.trim(),
    apiKey: input.apiKey.trim(),
  };

  await collections.upstreamProviders.insertOne(upstream);

  revalidatePath('/admin/upstreams');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateUpstream(upstreamId: string, input: UpstreamInput): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }
  if (!upstreamId) {
    return { success: false, error: 'Provider id is required.' };
  }
  const validationError = validateUpstreamInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const result = await collections.upstreamProviders.updateOne(
    { id: upstreamId },
    { $set: { name: input.name.trim(), apiUrl: input.apiUrl.trim(), apiKey: input.apiKey.trim() } },
  );
  if (result.matchedCount === 0) {
    return { success: false, error: 'Provider not found.' };
  }

  revalidatePath('/admin/upstreams');
  revalidatePath('/admin');
  return { success: true };
}

export async function listServicesForUpstream(
  upstreamId: string,
  page: number = 1,
  pageSize: number = 5,
): Promise<ListUpstreamServicesResult> {
  if (!(await isAdmin())) {
    return { services: [], total: 0, page: 1, pageSize: 5, totalPages: 1 };
  }
  if (!upstreamId) {
    return { services: [], total: 0, page: 1, pageSize: 5, totalPages: 1 };
  }

  const filter = { upstreamId };
  const total = await collections.services.countDocuments(filter);
  const validPageSize = Math.max(1, Math.min(pageSize, 50));
  const totalPages = Math.max(1, Math.ceil(total / validPageSize));
  const validPage = Math.max(1, Math.min(page, totalPages));

  const services = await collections.services
    .find(filter, {
      sort: { name: 1 },
      skip: (validPage - 1) * validPageSize,
      limit: validPageSize,
    })
    .toArray();

  return {
    services: services.map((s) => ({
      id: s.id,
      platform: s.platform,
      name: s.name,
      price: s.price,
      status: s.status,
      minOrder: s.minOrder,
      maxOrder: s.maxOrder,
    })),
    total,
    page: validPage,
    pageSize: validPageSize,
    totalPages,
  };
}

export async function deleteAllServicesForUpstream(upstreamId: string): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }
  if (!upstreamId) {
    return { success: false, error: 'Provider id is required.' };
  }

  await collections.services.deleteMany({ upstreamId });

  revalidatePath('/admin/services');
  revalidatePath('/admin/upstreams');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteUpstream(upstreamId: string): Promise<MutationResult> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Admin session required.' };
  }
  if (!upstreamId) {
    return { success: false, error: 'Provider id is required.' };
  }

  // Backend verification: Deletion only succeeds if there are no services using it
  const linkedServicesCount = await collections.services.countDocuments({ upstreamId });
  if (linkedServicesCount > 0) {
    return {
      success: false,
      error: `Cannot delete provider: ${linkedServicesCount} service${linkedServicesCount === 1 ? '' : 's'} are still using this upstream provider. All linked services must be deleted first.`,
    };
  }

  const result = await collections.upstreamProviders.deleteOne({ id: upstreamId });
  if (result.deletedCount === 0) {
    return { success: false, error: 'Provider not found.' };
  }

  revalidatePath('/admin/upstreams');
  revalidatePath('/admin');
  return { success: true };
}
