'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Table, proportional, pixel, type TableColumn} from '@astryxdesign/core/Table';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Banner} from '@astryxdesign/core/Banner';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';

import {deleteUpstream, type AdminUpstreamRow} from '@/actions/admin/upstreams';

function maskApiKey(key: string): string {
  if (!key) {
    return '—';
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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUpstreamRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const result = await deleteUpstream(deleteTarget.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

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
      {error ? <Banner status="error" title={error} /> : null}
      <Table
        data={upstreams}
        columns={columns}
        idKey="id"
        density="compact"
        hasHover
        textOverflow="truncate"
      />
      <AlertDialog
        isOpen={deleteTarget !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteTarget(null);
          }
        }}
        title="Delete provider"
        description={`This permanently removes ${deleteTarget?.name ?? 'this provider'} from the panel. Services linked to it will keep their upstream ID but lose the name lookup.`}
        actionLabel="Delete provider"
        isActionLoading={isDeleting}
        onAction={handleDelete}
      />
    </>
  );
}
