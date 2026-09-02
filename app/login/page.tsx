import {Suspense} from 'react';
import {Center} from '@astryxdesign/core/Center';
import {Spinner} from '@astryxdesign/core/Spinner';

import {SiteHeader} from '../components/landing/SiteHeader';
import {LoginForm} from './LoginForm';

export const metadata = {
  title: 'Sign in · PKD-SMM Panel',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-body">
      <SiteHeader />
      <Center axis="both" minHeight="calc(100vh - 64px)" padding={6}>
        <Suspense fallback={<Spinner label="Loading sign-in" />}>
          <LoginForm />
        </Suspense>
      </Center>
    </main>
  );
}
