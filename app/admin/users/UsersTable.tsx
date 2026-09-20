'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, proportional, pixel, type TableColumn } from '@astryxdesign/core/Table';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Banner } from '@astryxdesign/core/Banner';
import { AlertDialog } from '@astryxdesign/core/AlertDialog';

import { deleteUser, setUserStatus, type AdminUserRow } from '@/actions/admin/users';
import { AdjustBalanceDialog } from './AdjustBalanceDialog';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  ar: 'Arabic',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  tr: 'Turkish',
  ur: 'Urdu',
};

function formatCreatedAt(value: string | null): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<AdminUserRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleStatusToggle(user: AdminUserRow) {
    const nextStatus = user.status === 'banned' ? 'active' : 'banned';
    setError(null);
    startTransition(async () => {
      const result = await setUserStatus(user.id, nextStatus);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const result = await deleteUser(deleteTarget.id);
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

  const columns: TableColumn<AdminUserRow>[] = [
    {
      key: 'username',
      header: 'Username',
      width: proportional(1),
      renderCell: (user) => (
        <Link href={`/admin/users/${user.id}`} className="text-accent">
          <Text weight="semibold">{user.username}</Text>
        </Link>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      width: proportional(2),
      renderCell: (user) => <Text color="secondary">{user.email}</Text>,
    },
    {
      key: 'language',
      header: 'Language',
      width: pixel(110),
      renderCell: (user) => (
        <Text size="sm" color="secondary">{LANGUAGE_LABELS[user.language] ?? user.language}</Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(120),
      renderCell: (user) => (
        <HStack gap={2} vAlign="center">
          <StatusDot
            variant={user.status === 'active' ? 'success' : 'error'}
            label={user.status === 'active' ? 'Active' : 'Banned'}
          />
          <Text size="sm">{user.status === 'active' ? 'Active' : 'Banned'}</Text>
        </HStack>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      width: pixel(130),
      renderCell: (user) => (
        <Text size="sm" color="secondary">{formatCreatedAt(user.createdAt)}</Text>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: pixel(250),
      align: 'end',
      resizable: false,
      renderCell: (user) => (
        <HStack gap={2} vAlign="center" justify="end">
          <Button
            label="Adjust"
            variant="secondary"
            size="sm"
            isDisabled={isPending}
            onClick={() => setAdjustTarget(user)}
          />
          <Button
            label={user.status === 'banned' ? 'Unban' : 'Ban'}
            variant="secondary"
            size="sm"
            isDisabled={isPending}
            onClick={() => handleStatusToggle(user)}
          />
          <Button
            label="Delete"
            variant="secondary"
            size="sm"
            isDisabled={isPending}
            onClick={() => setDeleteTarget(user)}
          />
        </HStack>
      ),
    },
  ];

  return (
    <>
      {error ? <Banner status="error" title={error} /> : null}
      <Table
        data={users}
        columns={columns}
        idKey="id"
        density="compact"
        hasHover
        textOverflow="truncate"
      />
      {adjustTarget ? (
        <AdjustBalanceDialog user={adjustTarget} onClose={() => setAdjustTarget(null)} />
      ) : null}
      <AlertDialog
        isOpen={deleteTarget !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteTarget(null);
          }
        }}
        title="Delete user"
        description={`This permanently removes ${deleteTarget?.username ?? 'this user'} from the panel. This action cannot be undone.`}
        actionLabel="Delete user"
        isActionLoading={isDeleting}
        onAction={handleDelete}
      />
    </>
  );
}