import {Center} from '@astryxdesign/core/Center';

import {SiteHeader} from '../components/landing/SiteHeader';
import {SignupForm} from './SignupForm';

export const metadata = {
  title: 'Create account · PKD-SMM Panel',
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
