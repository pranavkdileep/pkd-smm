'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {SideNav, SideNavHeading, SideNavSection, SideNavItem} from '@astryxdesign/core/SideNav';
import {LayoutDashboard, Users, Layers, Server, ShieldCheck, LifeBuoy} from 'lucide-react';

import {LogoutButton} from './LogoutButton';

// Responsive contract: handled by AppShell — the side nav collapses into the
// mobile drawer below the md breakpoint and supports inline collapse above it.
export function AdminSideNav() {
  const pathname = usePathname();

  return (
    <SideNav
      aria-label="Admin navigation"
      header={
        <SideNavHeading
          heading="PKD-SMM"
          subheading="Admin panel"
          icon={<ShieldCheck size={18} aria-hidden="true" />}
        />
      }
      footer={<LogoutButton />}
      collapsible
    >
      <SideNavSection title="Overview">
        <SideNavItem
          as={Link}
          href="/admin"
          label="Dashboard"
          icon={LayoutDashboard}
          selectedIcon={LayoutDashboard}
          isSelected={pathname === '/admin'}
        />
      </SideNavSection>
      <SideNavSection title="Manage">
        <SideNavItem
          as={Link}
          href="/admin/users"
          label="Users"
          icon={Users}
          selectedIcon={Users}
          isSelected={pathname.startsWith('/admin/users')}
        />
        <SideNavItem
          as={Link}
          href="/admin/services"
          label="Services"
          icon={Layers}
          selectedIcon={Layers}
          isSelected={pathname.startsWith('/admin/services')}
        />
        <SideNavItem
          as={Link}
          href="/admin/upstreams"
          label="Upstreams"
          icon={Server}
          selectedIcon={Server}
          isSelected={pathname.startsWith('/admin/upstreams')}
        />
        <SideNavItem
          as={Link}
          href="/admin/support"
          label="Support"
          icon={LifeBuoy}
          selectedIcon={LifeBuoy}
          isSelected={pathname.startsWith('/admin/support')}
        />
      </SideNavSection>
    </SideNav>
  );
}