import {Center} from '@astryxdesign/core/Center';
import {VStack} from '@astryxdesign/core/VStack';
import {Heading} from '@astryxdesign/core/Heading';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Layers} from 'lucide-react';

export const metadata = {
  title: 'Services · PKD-SMM Admin',
};

export default function AdminServicesPage() {
  return (
    <Center axis="both" minHeight="60vh" padding={6}>
      <VStack gap={4} align="center">
        <Heading level={1}>Services</Heading>
        <EmptyState
          icon={<Layers size={28} />}
          title="Services management coming soon"
          description="This is a placeholder page. Service catalog management will be built here."
        />
      </VStack>
    </Center>
  );
}