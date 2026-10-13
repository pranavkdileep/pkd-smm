'use client';

import {useState, type ReactNode} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';

import {UserSideNav, type UserSideNavAccount} from './UserSideNav';
import {UserTopBar} from './UserTopBar';

/** Client frame for the user area; owns the sidebar collapse state shared by nav + top bar. */
export function UserShell({
  account,
  balance,
  children,
}: {
  account: UserSideNavAccount;
  balance: number;
  children: ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // Responsive contract:
    //   >= 768px  topNav + sideNav 256 (collapsible to an icon rail) | content flex
    //   < 768px   sideNav collapses into the MobileNav drawer (AppShell auto);
    //             the top bar swaps its rail toggle for MobileNavToggle.
    // Dense user data area: content padding 0, pages own their own padding.
    <AppShell
      variant="section"
      sideNav={
        <UserSideNav
          account={account}
          collapsible={{isCollapsed, onCollapsedChange: setIsCollapsed, hasButton: false}}
        />
      }
      topNav={
        <UserTopBar balance={balance} isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
      }
      contentPadding={0}
    >
      {children}
    </AppShell>
  );
}
