import {VStack} from '@astryxdesign/core/VStack';

import {SiteHeader} from './components/landing/SiteHeader';
import {Hero} from './components/landing/Hero';
import {TrustLine} from './components/landing/TrustLine';
import {PlatformsStrip} from './components/landing/PlatformsStrip';
import {ServicesCatalog} from './components/landing/ServicesCatalog';
import {PricingTables} from './components/landing/PricingTables';
import {HowItWorks} from './components/landing/HowItWorks';
import {PaymentMethods} from './components/landing/PaymentMethods';
import {FeatureTabs} from './components/landing/FeatureTabs';
import {Reviews} from './components/landing/Reviews';
import {AboutSection} from './components/landing/AboutSection';
import {Faq} from './components/landing/Faq';
import {SiteFooter} from './components/landing/SiteFooter';
import {FAQS, SERVICES} from './components/landing/content';
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  FaqPageJsonLd,
  ServiceOfferCatalogJsonLd,
} from './components/seo/JsonLd';
import {getLandingPricing} from '@/actions/users/services';

export default async function Home() {
  const initialPricing = await getLandingPricing();

  const homepageOffers = SERVICES.map((s) => ({
    name: s.name,
    description: s.blurb,
    price: s.fromPrice.replace(/[^0-9.]/g, '') || '0.10',
    priceCurrency: 'INR',
  }));

  return (
    <VStack gap={0}>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <FaqPageJsonLd faqs={FAQS} />
      <ServiceOfferCatalogJsonLd
        catalogName="Featured Social Media Growth Services"
        offers={homepageOffers}
      />
      <SiteHeader />
      <main>
        <Hero />
        <TrustLine />
        <PlatformsStrip />
        <ServicesCatalog />
        <PricingTables initialPricing={initialPricing} />
        <HowItWorks />
        <PaymentMethods />
        <FeatureTabs />
        <Reviews />
        <AboutSection />
        <Faq />
      </main>
      <SiteFooter />
    </VStack>
  );
}
