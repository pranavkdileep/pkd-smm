import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {AppShell} from '@astryxdesign/core/AppShell';

import {getCurrentUser} from '@/actions/auth/session';

import {UserSideNav} from './UserSideNav';
import {UserTopBar} from './UserTopBar';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Dashboard · ${siteConfig.name}`,
};

export default async function UserLayout({children}: {children: ReactNode}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?error=unauthenticated');
  }

  return (
    // Responsive contract:
    //   >= 768px  topNav + sideNav 256 | content flex
    //   < 768px   sideNav collapses into MobileNav drawer (AppShell auto);
    //             UserTopBar's MobileNavToggle opens it; content is w-full.
    // Dense user data area: content padding 0, pages own their own padding.
    <AppShell
      sideNav={<UserSideNav />}
      topNav={<UserTopBar balance={user.balance} />}
      contentPadding={0}
    >
      {children}
    </AppShell>
  );
}
