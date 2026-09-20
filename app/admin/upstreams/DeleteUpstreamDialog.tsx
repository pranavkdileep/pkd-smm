'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Banner } from '@astryxdesign/core/Banner';
import { Badge } from '@astryxdesign/core/Badge';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Pagination } from '@astryxdesign/core/Pagination';
import { Table, proportional, pixel, type TableColumn } from '@astryxdesign/core/Table';
import { Spinner } from '@astryxdesign/core/Spinner';
import { Trash2 } from 'lucide-react';

import {
  deleteUpstream,
  listServicesForUpstream,
  deleteAllServicesForUpstream,
  type AdminUpstreamRow,
  type UpstreamLinkedServiceRow,
} from '@/actions/admin/upstreams';
import { deleteService } from '@/actions/admin/services';

const PAGE_SIZE = 5;

export function DeleteUpstreamDialog({
  upstream,
  onClose,
}: {
  upstream: AdminUpstreamRow;
  onClose: () => void;
}) {
  const router = useRouter();
  const [services, setServices] = useState<UpstreamLinkedServiceRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDeletingUpstream, setIsDeletingUpstream] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listServicesForUpstream(upstream.id, targetPage, PAGE_SIZE);
      setServices(result.services);
      setTotal(result.total);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services.');
    } finally {
      setIsLoading(false);
      setInitialLoaded(true);
    }
  }, [upstream.id]);

  useEffect(() => {
    void loadServices(1);
  }, [loadServices]);

  const isBusy = isLoading || isDeletingAll || isDeletingUpstream || deletingServiceId !== null;

  async function handleDeleteSingle(serviceId: string) {
    setDeletingServiceId(serviceId);
    setError(null);
    try {
      const result = await deleteService(serviceId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      const nextPage = services.length === 1 && page > 1 ? page - 1 : page;
      await loadServices(nextPage);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service.');
    } finally {
      setDeletingServiceId(null);
    }
  }

  async function handleDeleteAll() {
    setIsDeletingAll(true);
    setError(null);
    setConfirmDeleteAll(false);
    try {
      const result = await deleteAllServicesForUpstream(upstream.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      await loadServices(1);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete all services.');
    } finally {
      setIsDeletingAll(false);
    }
  }

  async function handleDeleteUpstream() {
    // Frontend verification: Cannot delete if services still exist
    if (total > 0) {
      setError(`Cannot delete provider: ${total} service(s) are still using it.`);
      return;
    }
    setIsDeletingUpstream(true);
    setError(null);
    try {
      const result = await deleteUpstream(upstream.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete provider.');
    } finally {
      setIsDeletingUpstream(false);
    }
  }

  const columns: TableColumn<UpstreamLinkedServiceRow>[] = [
    {
      key: 'name',
      header: 'Service',
      width: proportional(1.8),
      renderCell: (service) => (
        <Text weight="semibold" size="sm">
          {service.name}
        </Text>
      ),
    },
    {
      key: 'platform',
      header: 'Platform',
      width: pixel(100),
      renderCell: (service) => (
        <Text size="sm" color="secondary">
          {service.platform}
        </Text>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: pixel(90),
      renderCell: (service) => (
        <Text size="sm">
          ₹{Number(service.price).toFixed(2)}
        </Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(90),
      renderCell: (service) => (
        <StatusDot
          variant={service.status === 'active' ? 'success' : 'neutral'}
          label={service.status}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: pixel(90),
      align: 'end',
      renderCell: (service) => (
        <Button
          label="Delete"
          variant="ghost"
          size="sm"
          isLoading={deletingServiceId === service.id}
          isDisabled={isBusy}
          onClick={() => handleDeleteSingle(service.id)}
        />
      ),
    },
  ];

  return (
    <Dialog
      isOpen
      onOpenChange={(open) => {
        if (!open && !isBusy) {
          onClose();
        }
      }}
      purpose="form"
      width={680}
      maxHeight="85vh"
    >
      <Layout
        header={
          <DialogHeader
            title={`Delete Provider: ${upstream.name}`}
            subtitle="Upstream providers can only be deleted when no services are linked to them."
            onOpenChange={isBusy ? undefined : onClose}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              {error ? <Banner status="error" title={error} /> : null}

              {isLoading && !initialLoaded ? (
                <VStack gap={2} align="center" justify="center" className="py-12">
                  <Spinner size="lg" label="Checking linked services…" />
                </VStack>
              ) : total > 0 ? (
                <VStack gap={4}>
                  <Banner
                    status="warning"
                    title="Provider has linked services"
                    description={`This provider cannot be deleted because ${total} service${total === 1 ? '' : 's'} depend on it. Delete all services or remove them individually below.`}
                  />

                  <HStack justify="between" vAlign="center" width="100%">
                    <HStack gap={2} vAlign="center">
                      <Text weight="semibold">Linked Services</Text>
                      <Badge variant="blue" label={String(total)} />
                    </HStack>

                    {confirmDeleteAll ? (
                      <HStack gap={2} vAlign="center">
                        <Text size="sm" weight="semibold">
                          Delete all {total} services?
                        </Text>
                        <Button
                          label="Yes, delete all"
                          variant="destructive"
                          size="sm"
                          isLoading={isDeletingAll}
                          isDisabled={isBusy && !isDeletingAll}
                          onClick={handleDeleteAll}
                        />
                        <Button
                          label="Cancel"
                          variant="ghost"
                          size="sm"
                          isDisabled={isDeletingAll}
                          onClick={() => setConfirmDeleteAll(false)}
                        />
                      </HStack>
                    ) : (
                      <Button
                        label="Delete all services"
                        variant="destructive"
                        size="sm"
                        icon={<Trash2 size={14} aria-hidden="true" />}
                        isDisabled={isBusy}
                        onClick={() => setConfirmDeleteAll(true)}
                      />
                    )}
                  </HStack>

                  <Table
                    data={services}
                    columns={columns}
                    idKey="id"
                    density="compact"
                    hasHover
                    textOverflow="truncate"
                  />

                  {totalPages > 1 ? (
                    <HStack justify="end" width="100%">
                      <Pagination
                        label="Linked services pagination"
                        variant="pages"
                        size="sm"
                        page={page}
                        totalItems={total}
                        totalPages={totalPages}
                        pageSize={PAGE_SIZE}
                        onChange={(nextPage) => loadServices(nextPage)}
                        isDisabled={isBusy}
                      />
                    </HStack>
                  ) : null}
                </VStack>
              ) : (
                <VStack gap={3}>
                  <Banner
                    status="info"
                    title="Safe to delete"
                    description="No services are currently linked to this provider. You may now permanently delete it."
                  />
                  <Text size="sm" color="secondary">
                    Deleting &ldquo;{upstream.name}&rdquo; ({upstream.apiUrl}) will remove it from the panel. This action cannot be undone.
                  </Text>
                </VStack>
              )}
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} justify="end" width="100%">
              <Button
                label="Cancel"
                variant="secondary"
                onClick={onClose}
                isDisabled={isBusy}
              />
              <Button
                label="Delete provider"
                variant="destructive"
                isLoading={isDeletingUpstream}
                isDisabled={total > 0 || !initialLoaded || isBusy}
                onClick={handleDeleteUpstream}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
