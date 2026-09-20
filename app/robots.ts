import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/services',
        '/services/*',
        '/terms',
        '/privacy',
        '/cookies',
        '/refund',
        '/delivery',
        '/accessibility',
        '/affiliate-disclosure',
        '/dmca',
      ],
      disallow: [
        '/admin',
        '/admin/*',
        '/user',
        '/user/*',
        '/api',
        '/api/*',
        '/login',
        '/signup',
      ],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
