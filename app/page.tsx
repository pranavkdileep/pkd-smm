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
import {FinalCta} from './components/landing/FinalCta';
import {SiteFooter} from './components/landing/SiteFooter';

export default function Home() {
  return (
    <VStack gap={0}>
      <SiteHeader />
      <main>
        <Hero />
        <TrustLine />
        <PlatformsStrip />
        <ServicesCatalog />
        <PricingTables />
        <HowItWorks />
        <PaymentMethods />
        <FeatureTabs />
        <Reviews />
        <AboutSection />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </VStack>
  );
}
