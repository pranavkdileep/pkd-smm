'use client';

import {Grid} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {Users, Layers, Ban, type LucideIcon} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  services: Layers,
  banned: Ban,
};

export interface StatItem {
  /** Key into the icon registry above — keeps props serializable from server components. */
  iconKey: keyof typeof ICONS | string;
  label: string;
  value: number;
}

export function StatGrid({stats}: {stats: StatItem[]}) {
  return (
    <Grid gap={4} columns={{minWidth: 260}}>
      {stats.map((stat) => {
        const IconComponent = ICONS[stat.iconKey];
        return (
          <Card key={stat.label} padding={5} elevation="low">
            <HStack gap={3} vAlign="center" wrap="wrap">
              <HStack gap={2} vAlign="center">
                {IconComponent ? <Icon icon={IconComponent} size="sm" className="text-secondary" /> : null}
                <Text size="sm" color="secondary">{stat.label}</Text>
              </HStack>
              <Text size="lg" weight="semibold">{stat.value.toLocaleString()}</Text>
            </HStack>
          </Card>
        );
      })}
    </Grid>
  );
}