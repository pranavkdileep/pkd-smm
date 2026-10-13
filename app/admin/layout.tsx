import type {ReactNode} from 'react';

import {getSession} from '@/actions/auth/session';

import {AdminShell} from './AdminShell';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Admin · ${siteConfig.name}`,
};

export default async function AdminLayout({children}: {children: ReactNode}) {
  // proxy.ts already gates /admin to admin sessions; this only reads the name.
  const session = await getSession();

  return <AdminShell adminName={session?.username ?? 'Admin'}>{children}</AdminShell>;
}
