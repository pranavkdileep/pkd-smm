import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';

import {siteConfig} from '@/lib/config';

const BOX = {sm: 'size-6 rounded-md', md: 'size-8 rounded-lg', lg: 'size-10 rounded-lg'} as const;

/** Square brand tile with the site initials: sidebar headings, site header, auth pages. */
export function BrandMark({size = 'md'}: {size?: keyof typeof BOX}) {
  return (
    <HStack
      hAlign="center"
      vAlign="center"
      className={`shrink-0 bg-orange-subtle text-orange-vivid ${BOX[size]}`}
      aria-hidden="true"
    >
      <Text size={size === 'lg' ? 'base' : 'xsm'} weight="bold" color="inherit">
        {siteConfig.brandInitials}
      </Text>
    </HStack>
  );
}
