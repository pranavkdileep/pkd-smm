import {Center} from '@astryxdesign/core/Center';

import {SiteHeader} from '../components/landing/SiteHeader';
import {SignupForm} from './SignupForm';
import {siteConfig} from '@/lib/config';

export const metadata = {
  title: `Create account · ${siteConfig.name}`,
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-body">
      <SiteHeader />
      <Center axis="both" minHeight="calc(100vh - 64px)" padding={6}>
        <SignupForm />
      </Center>
    </main>
  );
}
