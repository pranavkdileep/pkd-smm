import type {ReactNode} from 'react';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';

/**
 * Bordered, divided container for ListingRow items: one panel, many rows
 * (never one card per row).
 */
export function ListingList({label, children}: {label: string; children: ReactNode}) {
  return (
    <VStack
      as="ul"
      aria-label={label}
      className="w-full divide-y divide-border overflow-hidden rounded-lg border border-border bg-card"
    >
      {children}
    </VStack>
  );
}

/**
 * Marketplace-style listing row: media tile, title, one-line description and
 * meta line, with the price and action on the trailing edge. Below `sm` the
 * price + action wrap onto their own line, as in a stacked mobile listing.
 */
export function ListingRow({
  media,
  title,
  description,
  meta,
  price,
  priceNote,
  action,
}: {
  media: ReactNode;
  title: string;
  description?: string;
  meta?: ReactNode;
  price: string;
  priceNote?: string;
  action: ReactNode;
}) {
  return (
    <HStack as="li" gap={4} vAlign="center" wrap="wrap" className="p-4 sm:flex-nowrap sm:px-5">
      <HStack gap={4} vAlign="center" className="min-w-0 flex-1 basis-64">
        {media}
        <VStack gap={0.5} className="min-w-0 flex-1">
          <Text weight="semibold" maxLines={1}>
            {title}
          </Text>
          {description ? (
            <Text color="secondary" maxLines={1}>
              {description}
            </Text>
          ) : null}
          {meta}
        </VStack>
      </HStack>
      <HStack gap={4} vAlign="center" justify="between" className="max-sm:w-full sm:shrink-0">
        <VStack gap={0} className="sm:items-end">
          <Text type="large" weight="semibold" hasTabularNumbers>
            {price}
          </Text>
          {priceNote ? <Text type="supporting">{priceNote}</Text> : null}
        </VStack>
        {action}
      </HStack>
    </HStack>
  );
}

/** Dot-separated meta line: "Instagram · Refillable · 100 – 10K". */
export function ListingMeta({children}: {children: ReactNode}) {
  return (
    <HStack gap={1.5} vAlign="center" wrap="wrap" className="pt-1">
      {children}
    </HStack>
  );
}
