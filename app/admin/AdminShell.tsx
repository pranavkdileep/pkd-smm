'use client';

import {useState, type ReactNode} from 'react';
import {ExternalLink} from 'lucide-react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';

import {ShellTopBar} from '@/app/components/shell/ShellTopBar';

import {AdminSideNav} from './AdminSideNav';

/** Client frame for the admin area; owns the sidebar collapse state shared by nav + top bar. */
export function AdminShell({adminName, children}: {adminName: string; children: ReactNode}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // Responsive contract:
    //   >= 768px  topNav + sideNav 256 (collapsible to an icon rail) | content flex
    //   < 768px   sideNav collapses into the MobileNav drawer (AppShell auto).
    // Dense admin data area: content padding 0, pages own their own padding.
    <AppShell
      variant="section"
      sideNav={
        <AdminSideNav
          adminName={adminName}
          collapsible={{isCollapsed, onCollapsedChange: setIsCollapsed, hasButton: false}}
        />
      }
      topNav={
        <ShellTopBar
          label="Admin bar"
          brandLabel="Admin"
          isCollapsed={isCollapsed}
          onCollapsedChange={setIsCollapsed}
          endContent={
            <Button
              label="View site"
              href="/"
              target="_blank"
              endContent={<Icon icon={ExternalLink} size="sm" />}
            />
          }
        />
      }
      contentPadding={0}
    >
      {children}
    </AppShell>
  );
}
