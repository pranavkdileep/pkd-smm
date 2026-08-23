import {Grid} from '@astryxdesign/core/Grid';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';

import {STATS} from './content';
import {NamedIcon} from './NamedIcon';

const STAT_TINTS: Record<string, string> = {
  blue: 'bg-blue-subtle text-blue-vivid',
  purple: 'bg-purple-subtle text-purple-vivid',
  green: 'bg-green-subtle text-green-vivid',
  orange: 'bg-orange-subtle text-orange-vivid',
  yellow: 'bg-yellow-subtle text-yellow-vivid',
};

/** Full-width trust strip with the five headline stats. */
export function TrustLine() {
  return (
    <section aria-label="Platform statistics" className="border-y border-border bg-surface">
      <Grid
        columns={{minWidth: 220, max: 5}}
        gap={0}
        maxWidth={1280}
        className="mx-auto px-6 max-md:divide-y max-md:divide-border xl:divide-x xl:divide-border"
      >
        {STATS.map((stat) => (
          <HStack key={stat.label} gap={3} vAlign="center" className="px-4 py-6">
            <HStack
              width={10}
              height={10}
              hAlign="center"
              vAlign="center"
              className={`shrink-0 rounded-lg ${STAT_TINTS[stat.tint]}`}
            >
              <NamedIcon name={stat.icon} size="md" />
            </HStack>
            <VStack gap={0.5} align="start">
              <Text size="2xs" weight="bold" color="secondary">
                {stat.label.toUpperCase()}
              </Text>
              <Text weight="bold">{stat.value}</Text>
              <Text size="3xs" color="secondary">
                {stat.note}
              </Text>
            </VStack>
          </HStack>
        ))}
      </Grid>
    </section>
  );
}
