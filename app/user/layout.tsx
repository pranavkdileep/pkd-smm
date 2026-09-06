import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {AppShell} from '@astryxdesign/core/AppShell';

import {getCurrentUser} from '@/actions/auth/session';

import {UserSideNav} from './UserSideNav';
import {UserTopBar} from './UserTopBar';

export const metadata = {
  title: 'Dashboard · PKD-SMM Panel',
};

export default async function UserLayout({children}: {children: ReactNode}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?error=unauthenticated');
  }

  return (
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
