'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Table, proportional, pixel, type TableColumn} from '@astryxdesign/core/Table';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Switch} from '@astryxdesign/core/Switch';
import {Banner} from '@astryxdesign/core/Banner';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';

import {deleteService, setServiceStatus, type AdminServiceRow} from '@/actions/admin/services';

function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

export function ServicesTable({
  services,
  onEdit,
}: {
  services: AdminServiceRow[];
  onEdit: (service: AdminServiceRow) => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminServiceRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleStatusToggle(service: AdminServiceRow, checked: boolean) {
    setError(null);
    const result = await setServiceStatus(service.id, checked ? 'active' : 'inactive');
    if (!result.success) {
      setError(result.error);
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const result = await deleteService(deleteTarget.id);
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

  const columns: TableColumn<AdminServiceRow>[] = [
    {
      key: 'name',
      header: 'Service',
      width: proportional(1.6),
      renderCell: (service) => <Text weight="semibold">{service.name}</Text>,
    },
    {
      key: 'description',
      header: 'Description',
      width: proportional(2.2),
      renderCell: (service) => <Text color="secondary">{service.description || '—'}</Text>,
    },
    {
      key: 'price',
      header: 'Price',
      width: pixel(90),
      renderCell: (service) => <Text size="sm">{formatPrice(service.price)}</Text>,
    },
    {
      key: 'orders',
      header: 'Orders',
      width: pixel(130),
      renderCell: (service) => (
        <Text size="sm" color="secondary">
          {`${formatCount(service.minOrder)} – ${formatCount(service.maxOrder)}`}
        </Text>
      ),
    },
    {
      key: 'inputs',
      header: 'Inputs',
      width: pixel(90),
      renderCell: (service) => {
        const count = Object.keys(service.inputs).length;
        return (
          <Text size="sm" color="secondary">
            {`${count} ${count === 1 ? 'field' : 'fields'}`}
          </Text>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(170),
      renderCell: (service) => {
        const isActive = service.status === 'active';
        return (
          <HStack gap={2} vAlign="center">
            <StatusDot
              variant={isActive ? 'success' : 'neutral'}
              label={isActive ? 'Active' : 'Inactive'}
            />
            <Text size="sm">{isActive ? 'Active' : 'Inactive'}</Text>
            <Switch
              label={`Toggle ${service.name} status`}
              isLabelHidden
              size="sm"
              value={isActive}
              changeAction={(checked) => handleStatusToggle(service, checked)}
            />
          </HStack>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: pixel(150),
      align: 'end',
      resizable: false,
      renderCell: (service) => (
        <HStack gap={2} vAlign="center" justify="end">
          <Button
            label="Edit"
            variant="secondary"
            size="sm"
            onClick={() => onEdit(service)}
          />
          <Button
            label="Delete"
            variant="secondary"
            size="sm"
            onClick={() => setDeleteTarget(service)}
          />
        </HStack>
      ),
    },
  ];

  return (
    <>
      {error ? <Banner status="error" title={error} /> : null}
      <Table
        data={services}
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
        title="Delete service"
        description={`This permanently removes ${deleteTarget?.name ?? 'this service'} from the catalog. This action cannot be undone.`}
        actionLabel="Delete service"
        isActionLoading={isDeleting}
        onAction={handleDelete}
      />
    </>
  );
}
