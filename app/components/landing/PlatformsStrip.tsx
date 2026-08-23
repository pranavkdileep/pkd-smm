import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';

import {PLATFORMS} from './content';
import {BrandIcon} from './BrandIcon';

function MarqueeGroup() {
  return (
    <HStack gap={10} className="landing-marquee-group shrink-0">
      {PLATFORMS.map((platform) => (
        <HStack key={platform.id} gap={2} vAlign="center" className="px-2 text-secondary">
          <BrandIcon platform={platform.id} size="md" />
          <Text weight="bold" color="primary" size="lg">
            {platform.name}
          </Text>
        </HStack>
      ))}
    </HStack>
  );
}

/** Infinite platform marquee; pauses on hover, static when reduced-motion. */
export function PlatformsStrip() {
  return (
    <section
      aria-label="Supported platforms"
      className="landing-marquee overflow-hidden border-b border-border bg-body py-5"
    >
      <HStack className="landing-marquee-track w-max">
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
      </HStack>
    </section>
  );
}
