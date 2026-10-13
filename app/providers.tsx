'use client';

import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {socialGeeksTheme} from './theme/social-geeks';
import {CookieConsent} from './components/legal/CookieConsent';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <Theme theme={socialGeeksTheme} mode="light">
      <LinkProvider component={Link}>
        {children}
        <CookieConsent />
      </LinkProvider>
    </Theme>
  );
}