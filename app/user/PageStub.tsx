import type {LucideIcon} from 'lucide-react';
import {VStack} from '@astryxdesign/core/VStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {EmptyState} from '@astryxdesign/core/EmptyState';

interface PageStubProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  /** Lucide icon component shown above the empty-state message. */
  icon: LucideIcon;
}

/** Shared scaffold for user dashboard pages whose real UI lands later. */
export function PageStub({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon: IconComponent,
}: PageStubProps) {
  return (
    <VStack gap={6} className="w-full pt-6 px-6">
      <VStack gap={1}>
        <Heading level={1}>{title}</Heading>
        <Text color="secondary">{description}</Text>
      </VStack>
      <EmptyState
        headingLevel={2}
        icon={<IconComponent size={28} className="text-secondary" aria-hidden="true" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    </VStack>
  );
}
