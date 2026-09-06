import {Settings} from 'lucide-react';

import {PageStub} from '../PageStub';

export const metadata = {
  title: 'Settings · PKD-SMM Panel',
};

export default function SettingsPage() {
  return (
    <PageStub
      title="Settings"
      description="Manage your account details, password, and preferences."
      icon={Settings}
      emptyTitle="Account settings in progress"
      emptyDescription="Profile, password, and language controls will appear here."
    />
  );
}
