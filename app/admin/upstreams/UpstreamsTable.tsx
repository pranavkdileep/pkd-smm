'use client';

import { useState } from 'react';
import { Table, proportional, pixel, type TableColumn } from '@astryxdesign/core/Table';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';

import type { AdminUpstreamRow } from '@/actions/admin/upstreams';
import { DeleteUpstreamDialog } from './DeleteUpstreamDialog';

function maskApiKey(key: string): string {
  if (!key) {
    return '';
  }
  if (key.length <= 4) {
    return '••••';
  }
  return `••••${key.slice(-4)}`;
}

export function UpstreamsTable({
  upstreams,
  onEdit,
}: {
  upstreams: AdminUpstreamRow[];
  onEdit: (upstream: AdminUpstreamRow) => void;
}) {
  const [deleteTarget, setDeleteTarget] = useState<AdminUpstreamRow | null>(null);

  const columns: TableColumn<AdminUpstreamRow>[] = [
    {
      key: 'name',
      header: 'Provider',
      width: proportional(1.4),
      renderCell: (upstream) => <Text weight="semibold">{upstream.name}</Text>,
    },
    {
      key: 'apiUrl',
      header: 'API URL',
      width: proportional(2.6),
      renderCell: (upstream) => <Text color="secondary">{upstream.apiUrl}</Text>,
    },
    {
      key: 'apiKey',
      header: 'API key',
      width: pixel(140),
      renderCell: (upstream) => <Text size="sm" color="secondary">{maskApiKey(upstream.apiKey)}</Text>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: pixel(150),
      align: 'end',
      resizable: false,
      renderCell: (upstream) => (
        <HStack gap={2} vAlign="center" justify="end">
          <Button label="Edit" variant="secondary" size="sm" onClick={() => onEdit(upstream)} />
          <Button
            label="Delete"
            variant="secondary"
            size="sm"
            onClick={() => setDeleteTarget(upstream)}
          />
        </HStack>
      ),
    },
  ];

  return (
    <>
      <Table
        data={upstreams}
        columns={columns}
        idKey="id"
        density="compact"
        hasHover
        textOverflow="truncate"
      />
      {deleteTarget ? (
        <DeleteUpstreamDialog
          key={deleteTarget.id}
          upstream={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </>
  );
}
