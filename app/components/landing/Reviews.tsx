import {Grid} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Badge} from '@astryxdesign/core/Badge';

import {REVIEWS} from './content';
import {NamedIcon} from './NamedIcon';
import {SectionIntro} from './SectionIntro';
import {siteConfig} from '@/lib/config';

const RATING = 4.6;

function StarRating({value}: {value: number}) {
  const fillWidth = `${(value / 5) * 100}%`;
  return (
    <HStack gap={0} className="relative w-fit">
      <HStack gap={0.5}>
        {[1, 2, 3, 4, 5].map((star) => (
          <HStack
            key={star}
            width={6}
            height={6}
            hAlign="center"
            vAlign="center"
            className="rounded-sm bg-body text-secondary"
          >
            <Text size="2xs">★</Text>
          </HStack>
        ))}
      </HStack>
      <HStack
        gap={0.5}
        width={fillWidth}
        className="absolute inset-y-0 left-0 overflow-hidden"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <HStack
            key={star}
            width={6}
            height={6}
            hAlign="center"
            vAlign="center"
            className="shrink-0 rounded-sm bg-green-vivid text-on-accent"
          >
            <Text size="2xs">★</Text>
          </HStack>
        ))}
      </HStack>
    </HStack>
  );
}

const SCORE_PROOFS = [
  {
    icon: 'shield-check' as const,
    text: 'Every review is tied to a real completed order.',
  },
  {
    icon: 'message-square-text' as const,
    text: 'Feedback covers ordering, delivery tracking and support.',
  },
  {
    icon: 'receipt' as const,
    text: 'Refund outcomes are published with the same context.',
  },
];

/** Full-width summary banner above the review grid. */
function ScoreCard() {
  return (
    <Card padding={4} elevation="low" className="w-full">
      <VStack gap={3}>
        <HStack gap={6} wrap="wrap" vAlign="center" justify="between">
          <HStack gap={4} vAlign="center">
            <Text size="3xl" weight="bold">
              {RATING}
            </Text>
            <VStack gap={0.5} align="start">
              <StarRating value={RATING} />
              <Text weight="bold">Great</Text>
            </VStack>
          </HStack>
          <Text size="sm" color="secondary" className="max-w-md">
            Based on verified customer reviews collected after completed orders.
          </Text>
        </HStack>

        <HStack gap={2} wrap="wrap">
          {SCORE_PROOFS.map((proof) => (
            <HStack
              key={proof.text}
              gap={2}
              vAlign="center"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 sm:w-auto"
            >
              <NamedIcon name={proof.icon} size="sm" className="shrink-0 text-blue-vivid" />
              <Text size="xsm">{proof.text}</Text>
            </HStack>
          ))}
        </HStack>
      </VStack>
    </Card>
  );
}

export function Reviews() {
  return (
    <section id="reviews" aria-label="Customer reviews" className="scroll-mt-24 bg-body py-16 md:py-24">
      <VStack maxWidth={1280} gap={8} className="mx-auto w-full px-6">
        <SectionIntro
          eyebrow="Customer reviews"
          title={`Real feedback from ${siteConfig.shortName} customers`}
          lead="Individuals and teams use the panel for followers, views and engagement across six platforms — this feedback focuses on what every order shares: setup, clarity, support and tracking."
        />

        <ScoreCard />

        <Grid columns={{minWidth: 300, max: 3}} gap={3}>
          {REVIEWS.map((review) => (
            <Card key={review.name} padding={3} elevation="low">
              <VStack gap={2}>
                <HStack gap={2} vAlign="center">
                  <Avatar name={review.name} size="sm" tooltip={false} />
                  <VStack gap={0} align="start">
                    <Text size="sm" weight="bold">
                      {review.name}
                    </Text>
                    <Text size="3xs" color="secondary">
                      {review.role}
                    </Text>
                  </VStack>
                  <HStack className="ml-auto">
                    <Badge variant="success" label="★ 5.0" />
                  </HStack>
                </HStack>
                <Text as="p" size="sm" color="secondary">
                  {review.text}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>
    </section>
  );
}
