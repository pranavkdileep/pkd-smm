import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl.replace(/\/+$/, '');
  const now = new Date();

  const platforms = Object.keys(siteConfig.seo.platforms);

  const platformRoutes: MetadataRoute.Sitemap = platforms.map((platform) => ({
    url: `${baseUrl}/services/${platform}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const legalRoutes: MetadataRoute.Sitemap = [
    '/terms',
    '/privacy',
    '/refund',
    '/delivery',
    '/cookies',
    '/accessibility',
    '/affiliate-disclosure',
    '/dmca',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '/refund' || route === '/delivery' ? 0.5 : 0.4,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...platformRoutes,
    ...legalRoutes,
  ];
}
