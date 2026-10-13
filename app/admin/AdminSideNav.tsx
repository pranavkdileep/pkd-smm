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
import { LayoutDashboard, Users, Layers, Server, LifeBuoy, ClipboardList, Wallet, Receipt } from 'lucide-react';

import { siteConfig } from '@/lib/config';
import { BrandMark } from '@/app/components/shell/BrandMark';
import { NavSearch, type NavSearchItem } from '@/app/components/shell/NavSearch';
import { SidebarAccount } from '@/app/components/shell/SidebarAccount';

const SEARCH_ITEMS: NavSearchItem[] = [
  { href: '/admin', label: 'Dashboard', group: 'Overview' },
  { href: '/admin/users', label: 'Users', group: 'Manage' },
  { href: '/admin/orders', label: 'Orders', group: 'Manage' },
  { href: '/admin/services', label: 'Services', group: 'Catalog' },
  { href: '/admin/upstreams', label: 'Upstream providers', group: 'Catalog' },
  { href: '/admin/deposits', label: 'Deposits', group: 'Money' },
  { href: '/admin/transactions', label: 'Transactions', group: 'Money' },
  { href: '/admin/support', label: 'Support tickets', group: 'Help' },
];

// Responsive contract: handled by AppShell  the side nav collapses into the
// mobile drawer below the md breakpoint; above it the top bar toggles the rail.
export function AdminSideNav({
  adminName,
  collapsible,
}: {
  adminName: string;
  collapsible: SideNavControlledCollapsible;
}) {
  const pathname = usePathname();

  return (
    <SideNav
      aria-label="Admin navigation"
      collapsible={collapsible}
      header={
        <SideNavHeading
          heading={siteConfig.shortName}
          subheading="Admin panel"
          icon={<BrandMark />}
          menu={
            <>
              <ListItem label="Admin dashboard" href="/admin" />
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
              href="/admin/support"
              label="Support"
              icon={LifeBuoy}
              isSelected={pathname.startsWith('/admin/support')}
            />
          </SideNavSection>
          <SidebarAccount
            name={adminName}
            detail="Administrator"
            links={[{ label: 'Public website', href: '/' }]}
          />
        </VStack>
      }
    >
      <SideNavSection title="Overview" isHeaderHidden>
        <SideNavItem
          as={Link}
          href="/admin"
          label="Dashboard"
          icon={LayoutDashboard}
          isSelected={pathname === '/admin'}
        />
      </SideNavSection>
      <SideNavSection title="Manage">
        <SideNavItem
          as={Link}
          href="/admin/users"
          label="Users"
          icon={Users}
          isSelected={pathname.startsWith('/admin/users')}
        />
        <SideNavItem
          as={Link}
          href="/admin/orders"
          label="Orders"
          icon={ClipboardList}
          isSelected={pathname.startsWith('/admin/orders')}
        />
      </SideNavSection>
      <SideNavSection title="Catalog">
        <SideNavItem
          as={Link}
          href="/admin/services"
          label="Services"
          icon={Layers}
          isSelected={pathname.startsWith('/admin/services')}
        />
        <SideNavItem
          as={Link}
          href="/admin/upstreams"
          label="Upstreams"
          icon={Server}
          isSelected={pathname.startsWith('/admin/upstreams')}
        />
      </SideNavSection>
      <SideNavSection title="Money">
        <SideNavItem
          as={Link}
          href="/admin/deposits"
          label="Deposits"
          icon={Wallet}
          isSelected={pathname.startsWith('/admin/deposits')}
        />
        <SideNavItem
          as={Link}
          href="/admin/transactions"
          label="Transactions"
          icon={Receipt}
          isSelected={pathname.startsWith('/admin/transactions')}
        />
      </SideNavSection>
    </SideNav>
  );
}
