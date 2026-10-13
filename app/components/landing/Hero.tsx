import { VStack } from '@astryxdesign/core/VStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';

import { SITE } from './content';
import { HeroBrowse } from './HeroBrowse';

/** Browse-first hero: headline, then the searchable featured catalog. */
export function Hero() {
  return (
    <section id="services" aria-label={`${SITE.name} services`} className="w-full scroll-mt-24 bg-body">
      <VStack gap={8} maxWidth={1040} className="mx-auto w-full px-4 pb-16 pt-10 md:px-8 md:pt-16">
        <VStack gap={3} align="center" maxWidth={760} className="mx-auto">
          <Heading level={1} type="display-2" justify="center" textWrap="balance">
            {SITE.name}: boost every platform from one place
          </Heading>
          <Text as="p" color="secondary" size="lg" justify="center" textWrap="pretty">
            Followers, views, likes and engagement for Instagram, Telegram, TikTok, YouTube, X and
            Facebook, delivered to a public link and tracked live on your dashboard.
          </Text>
        </VStack>

        <HeroBrowse />
      </VStack>
    </section>
  );
}
