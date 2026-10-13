import {Grid} from '@astryxdesign/core/Grid';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';

import {STATS} from './content';
import {NamedIcon} from './NamedIcon';

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
              hAlign="center"
              vAlign="center"
              className="size-10 shrink-0 rounded-lg border border-border bg-body text-primary"
            >
              <NamedIcon name={stat.icon} size="sm" />
            </HStack>
            <VStack gap={0} align="start">
              <Text type="supporting">{stat.label}</Text>
              <Text weight="semibold">{stat.value}</Text>
              <Text type="supporting">{stat.note}</Text>
            </VStack>
          </HStack>
        ))}
      </Grid>
    </section>
  );
}
