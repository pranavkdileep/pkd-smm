import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Users} from 'lucide-react';

import {listUsers} from '@/actions/admin/users';
import {USER_PAGE_SIZES} from '@/lib/database';
import {UsersTable} from './UsersTable';
import {UsersToolbar, UsersPagination} from './UsersToolbar';

export const metadata = {
  title: 'Users · PKD-SMM Admin',
};

type SearchParams = Promise<{[key: string]: string | string[] | undefined}>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : undefined;
}

export default async function AdminUsersPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const search = firstParam(params.q) ?? '';
  const page = parsePositiveInt(firstParam(params.page));
  const pageSizeParam = parsePositiveInt(firstParam(params.pageSize));
  const pageSize = pageSizeParam && (USER_PAGE_SIZES as readonly number[]).includes(pageSizeParam)
    ? pageSizeParam
    : undefined;

  const result = await listUsers({page, pageSize, search});
  const isFiltered = Boolean(search.trim());

  return (
    <VStack gap={5} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>Users</Heading>
        <Text color="secondary">
          {result.total.toLocaleString()} {result.total === 1 ? 'user' : 'users'} on the panel.
        </Text>
      </VStack>

      <UsersToolbar initialSearch={search} />

      {result.users.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title={isFiltered ? 'No users match your search' : 'No users yet'}
          description={
            isFiltered
              ? `Nothing found for "${search.trim()}". Try a different username or email.`
              : 'Users will appear here as soon as they sign up.'
          }
        />
      ) : (
        <>
          <UsersTable users={result.users} />
          <HStack justify="end" wrap="wrap">
            <UsersPagination
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
              totalPages={result.totalPages}
            />
          </HStack>
        </>
      )}
    </VStack>
  );
}