'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {SideNav, SideNavHeading, SideNavSection, SideNavItem} from '@astryxdesign/core/SideNav';
import {
  CirclePlus,
  ClipboardList,
  Layers,
  Wallet,
  RotateCcw,
  Settings,
  LifeBuoy,
  Zap,
} from 'lucide-react';
import {siteConfig} from '@/lib/config';

// Responsive contract: handled by AppShell — the side nav collapses into the
// mobile drawer below the md breakpoint and supports inline collapse above it.
export function UserSideNav() {
  const pathname = usePathname();

  return (
    <SideNav
      aria-label="User navigation"
      header={
        <SideNavHeading
          heading={siteConfig.shortName}
          subheading="Dashboard"
          icon={<Zap size={18} aria-hidden="true" />}
        />
      }
      collapsible
    >
      <SideNavSection title="Ordering">
        <SideNavItem
          as={Link}
          href="/user"
          label="New Order"
          icon={CirclePlus}
          selectedIcon={CirclePlus}
          isSelected={pathname === '/user'}
        />
        <SideNavItem
          as={Link}
          href="/user/orders"
          label="Orders"
          icon={ClipboardList}
          selectedIcon={ClipboardList}
          isSelected={pathname.startsWith('/user/orders')}
        />
        <SideNavItem
          as={Link}
          href="/user/services"
          label="Services"
          icon={Layers}
          selectedIcon={Layers}
          isSelected={pathname.startsWith('/user/services')}
        />
      </SideNavSection>
      <SideNavSection title="Account">
        <SideNavItem
          as={Link}
          href="/user/add-funds"
          label="Add Funds"
          icon={Wallet}
          selectedIcon={Wallet}
          isSelected={pathname.startsWith('/user/add-funds')}
        />
        <SideNavItem
          as={Link}
          href="/user/refunds"
          label="Refunds"
          icon={RotateCcw}
          selectedIcon={RotateCcw}
          isSelected={pathname.startsWith('/user/refunds')}
        />
        <SideNavItem
          as={Link}
          href="/user/settings"
          label="Settings"
          icon={Settings}
          selectedIcon={Settings}
          isSelected={pathname.startsWith('/user/settings')}
        />
      </SideNavSection>
      <SideNavSection title="Help">
        <SideNavItem
          as={Link}
          href="/user/support"
          label="Support"
          icon={LifeBuoy}
          selectedIcon={LifeBuoy}
          isSelected={pathname.startsWith('/user/support')}
        />
      </SideNavSection>
    </SideNav>
  );
}
