'use client';

import {useRouter} from 'next/navigation';
import {Avatar} from '@astryxdesign/core/Avatar';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';
import {MoreMenu} from '@astryxdesign/core/MoreMenu';
import {useSideNavCollapse} from '@astryxdesign/core/SideNav';
import type {DropdownMenuOption} from '@astryxdesign/core/DropdownMenu';

import {logout} from '@/actions/auth/logout';

export interface SidebarAccountLink {
  label: string;
  href: string;
}

/**
 * Account row pinned to the bottom of the sidebar: avatar, name, and an
 * overflow menu with account links plus sign out. Collapses to the avatar.
 */
export function SidebarAccount({
  name,
  detail,
  links,
}: {
  name: string;
  detail?: string;
  links: SidebarAccountLink[];
}) {
  const router = useRouter();
  const {isCollapsed} = useSideNavCollapse();

  const items: DropdownMenuOption[] = [
    ...links.map((link) => ({label: link.label, onClick: () => router.push(link.href)})),
    {type: 'divider' as const},
    {
      label: 'Sign out',
      onClick: async () => {
        await logout();
        router.push('/');
      },
    },
  ];

  if (isCollapsed) {
    return (
      <MoreMenu
        label="Account menu"
        icon={<Avatar name={name} size="sm" tooltip={false} />}
        items={items}
        placement="end"
        alignment="end"
      />
    );
  }

  return (
    <HStack gap={2} vAlign="center" paddingInline={2} paddingBlock={1}>
      <Avatar name={name} size="sm" tooltip={false} />
      <VStack gap={0} className="min-w-0 flex-1">
        <Text weight="medium" maxLines={1}>
          {name}
        </Text>
        {detail ? (
          <Text type="supporting" maxLines={1}>
            {detail}
          </Text>
        ) : null}
      </VStack>
      <MoreMenu label="Account menu" items={items} size="sm" placement="above" alignment="end" />
    </HStack>
  );
}
