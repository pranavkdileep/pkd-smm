'use client';

import {useState} from 'react';
import {
  Table,
  proportional,
  pixel,
  useTableRowExpansion,
  type TableColumn,
} from '@astryxdesign/core/Table';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';

import type {CatalogServiceRow} from '@/actions/users/services';
import {PLATFORM_LABELS, PLATFORM_TINTS} from '@/app/components/platformMeta';
import {BrandIcon, type PlatformKey} from '@/app/components/landing/BrandIcon';
import {formatAmount} from '@/app/user/add-funds/format';

import {OrderNowButton} from './OrderNowButton';

/**
 * Dense service rows — one row per service instead of card soup.
 * Long descriptions expand via the row chevron.
 */
export function ServicesTable({
  services,
  rowIndexStart,
  rowCount,
}: {
  services: CatalogServiceRow[];
  rowIndexStart: number;
  rowCount: number;
}) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const expansion = useTableRowExpansion<CatalogServiceRow>({
    expandedKeys,
    onToggle: (key) => {
      setExpandedKeys((previous) => {
        const next = new Set(previous);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    getRowKey: (service) => service.id,
    renderExpanded: (service) => (
      <Text size="sm" color="secondary">
        {service.description || 'No description for this service.'}
      </Text>
    ),
    getIsItemExpandable: (service) => Boolean(service.description),
  });

  const columns: TableColumn<CatalogServiceRow>[] = [
    {
      key: 'platform',
      header: 'Platform',
      width: pixel(140),
      renderCell: (service) => {
        const platformKey = service.platform.toLowerCase() as PlatformKey;
        return (
          <HStack gap={2} vAlign="center">
            <HStack
              width={7}
              height={7}
              hAlign="center"
              vAlign="center"
              className={`rounded-lg ${PLATFORM_TINTS[platformKey]}`}
            >
              <BrandIcon platform={platformKey} size="sm" />
            </HStack>
            <Text size="sm">{PLATFORM_LABELS[platformKey]}</Text>
          </HStack>
        );
      },
    },
    {
      key: 'name',
      header: 'Service',
      width: proportional(2),
      renderCell: (service) => (
        <VStack gap={0.5}>
          <Text size="sm" weight="medium">
            {service.name}
          </Text>
          {service.description ? (
            <Text size="sm" color="secondary" className="line-clamp-1">
              {service.description}
            </Text>
          ) : null}
        </VStack>
      ),
    },
    {
      key: 'price',
      header: 'Rate / 1K',
      width: pixel(130),
      align: 'end',
      renderCell: (service) => (
        <Text size="sm" weight="semibold" hasTabularNumbers>
          {formatAmount(service.price, 'INR')}
        </Text>
      ),
    },
    {
      key: 'limits',
      header: 'Limits',
      width: pixel(150),
      align: 'end',
      renderCell: (service) => (
        <Text size="sm" color="secondary" hasTabularNumbers>
          {service.minOrder.toLocaleString()} – {service.maxOrder.toLocaleString()}
        </Text>
      ),
    },
    {
      key: 'features',
      header: 'Features',
      width: pixel(170),
      renderCell: (service) => (
        <HStack gap={1.5} wrap="wrap">
          {service.refill ? <Token label="Refillable" color="green" size="sm" /> : null}
          {service.cancel ? <Token label="Cancellable" color="blue" size="sm" /> : null}
          {!service.refill && !service.cancel ? (
            <Text size="sm" color="secondary">
              —
            </Text>
          ) : null}
        </HStack>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      width: pixel(110),
      align: 'end',
      renderCell: (service) => <OrderNowButton serviceId={service.id} />,
    },
  ];

  return (
    <Table
      data={services}
      columns={columns}
      idKey="id"
      density="compact"
      hasHover
      dividers="rows"
      textOverflow="truncate"
      plugins={{expansion}}
      rowIndexStart={rowIndexStart}
      rowCount={rowCount}
    />
  );
}
