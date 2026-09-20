import { siteConfig } from '@/lib/config';

interface FaqItem {
  q: string;
  a: string;
}

interface BreadcrumbItemDef {
  name: string;
  url: string;
}

interface ServiceOfferDef {
  name: string;
  description?: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/favicon.ico`,
    description: siteConfig.seo.defaultDescription,
    email: siteConfig.email.support,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: siteConfig.email.support,
        availableLanguage: ['English', 'Spanish', 'Hindi'],
      },
    ],
    sameAs: [
      `https://x.com/${siteConfig.seo.twitter.handle.replace('@', '')}`,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.siteUrl,
    description: siteConfig.seo.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.siteUrl}/services?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqPageJsonLd({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceOfferCatalogJsonLd({
  catalogName = 'Social Media Growth Services',
  serviceType = 'Social Media Marketing',
  offers,
}: {
  catalogName?: string;
  serviceType?: string;
  offers: ServiceOfferDef[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: catalogName,
      itemListElement: offers.map((offer) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: offer.name,
          description: offer.description || `${offer.name} with instant delivery and refill guarantee.`,
        },
        price: offer.price || '0.10',
        priceCurrency: offer.priceCurrency || 'INR',
        availability: offer.availability || 'https://schema.org/InStock',
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: siteConfig.seo.rating.ratingValue,
      reviewCount: siteConfig.seo.rating.reviewCount,
      bestRating: siteConfig.seo.rating.bestRating,
      worstRating: siteConfig.seo.rating.worstRating,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItemDef[] }) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
