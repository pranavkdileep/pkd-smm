'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Lock} from 'lucide-react';
import {HStack} from '@astryxdesign/core/HStack';
import {Button} from '@astryxdesign/core/Button';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';
import {Banner} from '@astryxdesign/core/Banner';

import {closeAdminSupportTicket} from '@/actions/admin/support';

/** Closes a ticket as staff after an explicit confirmation. */
export function AdminCloseTicketButton({ticketId}: {ticketId: string}) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClose() {
    setIsClosing(true);
    const result = await closeAdminSupportTicket(ticketId);
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
        icon={<Lock size={16} />}
        onClick={() => setIsConfirmOpen(true)}
      />
      <AlertDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Close this ticket?"
        description="The conversation will be locked for both you and the customer. They can still read the thread and open a new ticket."
        actionLabel="Close ticket"
        isActionLoading={isClosing}
        onAction={() => {
          void handleClose();
        }}
      />
    </HStack>
  );
}
