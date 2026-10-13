'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SideNav,
  SideNavHeading,
  SideNavSection,
  SideNavItem,
  type SideNavControlledCollapsible,
} from '@astryxdesign/core/SideNav';
import { ListItem } from '@astryxdesign/core/List';
import { VStack } from '@astryxdesign/core/VStack';
import {
  CirclePlus,
  ClipboardList,
  Store,
  Wallet,
  RotateCcw,
  Settings,
  LifeBuoy,
} from 'lucide-react';

import { siteConfig } from '@/lib/config';
import { BrandMark } from '@/app/components/shell/BrandMark';
import { NavSearch, type NavSearchItem } from '@/app/components/shell/NavSearch';
import { SidebarAccount } from '@/app/components/shell/SidebarAccount';

const SEARCH_ITEMS: NavSearchItem[] = [
  { href: '/user/services', label: 'Browse services', group: 'Ordering' },
  { href: '/user', label: 'New order', group: 'Ordering' },
  { href: '/user/orders', label: 'Orders', group: 'Ordering' },
  { href: '/user/add-funds', label: 'Add funds', group: 'Wallet' },
  { href: '/user/refunds', label: 'Refunds', group: 'Wallet' },
  { href: '/user/support', label: 'Support tickets', group: 'Account' },
  { href: '/user/settings', label: 'Settings', group: 'Account' },
];

export interface UserSideNavAccount {
  username: string;
  email: string;
}

// Responsive contract: handled by AppShell  the side nav collapses into the
// mobile drawer below the md breakpoint; above it the top bar toggles the rail.
export function UserSideNav({
  account,
  collapsible,
}: {
  account: UserSideNavAccount;
  collapsible: SideNavControlledCollapsible;
}) {
  const pathname = usePathname();

  return (
    <SideNav
      aria-label="User navigation"
      collapsible={collapsible}
      header={
        <SideNavHeading
          heading={siteConfig.shortName}
          subheading="Customer dashboard"
          icon={<BrandMark />}
          menu={
            <>
              <ListItem label="Dashboard" href="/user" />
              <ListItem label="Public website" href="/" />
            </>
          }
        />
      }
      topContent={<NavSearch items={SEARCH_ITEMS} />}
      footer={
        <VStack gap={1}>
          <SideNavSection title="Help" isHeaderHidden>
            <SideNavItem
              as={Link}
              href="/user/support"
              label="Support"
              icon={LifeBuoy}
              isSelected={pathname.startsWith('/user/support')}
            />
            <SideNavItem
              as={Link}
              href="/user/settings"
              label="Settings"
              icon={Settings}
              isSelected={pathname.startsWith('/user/settings')}
            />
          </SideNavSection>
          <SidebarAccount
            name={account.username}
            detail={account.email}
            links={[
              { label: 'Account settings', href: '/user/settings' },
              { label: 'Add funds', href: '/user/add-funds' },
              { label: 'Public website', href: '/' },
            ]}
          />
        </VStack>
      }
    >
      <SideNavSection title="Browse" isHeaderHidden>
        <SideNavItem
          as={Link}
          href="/user/services"
          label="Browse services"
          icon={Store}
          isSelected={pathname.startsWith('/user/services')}
        />
      </SideNavSection>
      <SideNavSection title="Ordering">
        <SideNavItem
          as={Link}
          href="/user"
          label="New order"
          icon={CirclePlus}
          isSelected={pathname === '/user'}
        />
        <SideNavItem
          as={Link}
          href="/user/orders"
          label="Orders"
          icon={ClipboardList}
          isSelected={pathname.startsWith('/user/orders')}
        />
      </SideNavSection>
      <SideNavSection title="Wallet">
        <SideNavItem
          as={Link}
          href="/user/add-funds"
          label="Add funds"
          icon={Wallet}
          isSelected={pathname.startsWith('/user/add-funds')}
        />
        <SideNavItem
          as={Link}
          href="/user/refunds"
          label="Refunds"
          icon={RotateCcw}
          isSelected={pathname.startsWith('/user/refunds')}
        />
      </SideNavSection>
    </SideNav>
  );
}
