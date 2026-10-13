import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';

import {getCurrentUser} from '@/actions/auth/session';

import {UserShell} from './UserShell';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Dashboard · ${siteConfig.name}`,
};

export default async function UserLayout({children}: {children: ReactNode}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?error=unauthenticated');
  }

  // Only display fields cross into the client shell (never the full user doc).
  return (
    <UserShell account={{username: user.username, email: user.email}} balance={user.balance}>
      {children}
    </UserShell>
  );
}
