import {Layers} from 'lucide-react';

import {PageStub} from '../PageStub';

export const metadata = {
  title: 'Services · PKD-SMM Panel',
};

export default function ServicesPage() {
  return (
    <PageStub
      title="Services"
      description="Browse every service on the panel with live pricing per platform."
      icon={Layers}
      emptyTitle="The service catalog is coming"
      emptyDescription="Filterable platform, pricing, and per-1K rates will appear here."
    />
  );
}
