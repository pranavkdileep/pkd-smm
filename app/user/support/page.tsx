import {LifeBuoy} from 'lucide-react';

import {PageStub} from '../PageStub';

export const metadata = {
  title: 'Support · PKD-SMM Panel',
};

export default function SupportPage() {
  return (
    <PageStub
      title="Support"
      description="Open a ticket and the team will get back to you."
      icon={LifeBuoy}
      emptyTitle="Support desk opening soon"
      emptyDescription="A ticket form and your conversation history will appear here."
    />
  );
}
