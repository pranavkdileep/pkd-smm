import type {ReactNode} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';

import {AdminSideNav} from './AdminSideNav';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Admin · ${siteConfig.name}`,
};

export default function AdminLayout({children}: {children: ReactNode}) {
  return (
    // Dense admin data area: content padding 0, pages own their own padding.
    <AppShell sideNav={<AdminSideNav />} contentPadding={0}>
      {children}
    </AppShell>
  );
}