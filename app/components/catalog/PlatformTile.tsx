import {HStack} from '@astryxdesign/core/HStack';

import {BrandIcon, type PlatformKey} from '@/app/components/landing/BrandIcon';
import {PLATFORM_TINTS} from '@/app/components/platformMeta';

const BOX = {sm: 'size-6 rounded-sm', md: 'size-12 rounded-lg'} as const;

/** Platform logo on its brand-tinted tile; the media slot of listing rows and tabs. */
export function PlatformTile({platform, size = 'md'}: {platform: PlatformKey; size?: keyof typeof BOX}) {
  return (
    <HStack
      hAlign="center"
      vAlign="center"
      className={`shrink-0 border border-border ${PLATFORM_TINTS[platform]} ${BOX[size]}`}
      aria-hidden="true"
    >
      <BrandIcon platform={platform} size={size === 'sm' ? 'xsm' : 'md'} />
    </HStack>
  );
}
