import type {ServicePlatform} from '@/lib/database';

type PlatformKey = Lowercase<ServicePlatform>;

/** Display names for the service platforms, keyed lowercase like BrandIcon. */
export const PLATFORM_LABELS: Record<PlatformKey, string> = {
  instagram: 'Instagram',
  telegram: 'Telegram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  x: 'X',
};

/** Brand tint classes for platform icon chips, shared by the landing catalog and the user dashboard. */
export const PLATFORM_TINTS: Record<PlatformKey, string> = {
  instagram: 'bg-pink-subtle text-pink-vivid',
  telegram: 'bg-blue-subtle text-blue-vivid',
  tiktok: 'bg-gray-subtle text-gray-vivid',
  youtube: 'bg-red-subtle text-red-vivid',
  x: 'bg-purple-subtle text-purple-vivid',
  facebook: 'bg-blue-subtle text-blue-vivid',
};
