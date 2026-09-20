'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { HStack } from '@astryxdesign/core/HStack';
import { Button } from '@astryxdesign/core/Button';
import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { Banner } from '@astryxdesign/core/Banner';

import { closeSupportTicket } from '@/actions/support/close';

/** Closes one of the user's own tickets after an explicit confirmation. */
export function CloseTicketButton({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClose() {
    setIsClosing(true);
    const result = await closeSupportTicket(ticketId);
    setIsClosing(false);

    if (!result.success) {
      setIsConfirmOpen(false);
      setError(result.error);
      return;
    }

    setIsConfirmOpen(false);
    router.refresh();
  }

  return (
    <HStack gap={2} vAlign="center" wrap="wrap">
      {error ? <Banner status="error" title={error} /> : null}
      <Button
        label="Close ticket"
        variant="secondary"
        size="sm"
        icon={<CheckCircle2 size={16} />}
        onClick={() => setIsConfirmOpen(true)}
      />
      <AlertDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Close this ticket?"
        description="The conversation will be locked  no further replies can be added. You can always open a new ticket."
        actionLabel="Close ticket"
        isActionLoading={isClosing}
        onAction={() => {
          void handleClose();
        }}
      />
    </HStack>
  );
}
