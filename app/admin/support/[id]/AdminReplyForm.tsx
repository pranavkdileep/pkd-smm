'use client';

import {useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Send} from 'lucide-react';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Button} from '@astryxdesign/core/Button';
import {Banner} from '@astryxdesign/core/Banner';

import {addAdminSupportTicketComment} from '@/actions/admin/support';

const MESSAGE_MAX_LENGTH = 5000; // Mirrors the limit enforced in actions/admin/support.ts.

/**
 * Staff reply composer at the bottom of an open ticket's conversation.
 * After sending, the view moves to the page holding the newest comment.
 */
export function AdminReplyForm({
  ticketId,
  page,
  pageSize,
  totalComments,
}: {
  ticketId: string;
  page: number;
  pageSize: number;
  totalComments: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    setError(null);
    const trimmed = message.trim();
    if (!trimmed) {
      setError('Write a message before sending.');
      return;
    }

    setIsSending(true);
    const result = await addAdminSupportTicketComment(ticketId, trimmed);
    setIsSending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setMessage('');
    const lastPage = Math.max(1, Math.ceil((totalComments + 1) / pageSize));
    if (lastPage !== page) {
      const params = new URLSearchParams(searchParams.toString());
      if (lastPage > 1) {
        params.set('page', String(lastPage));
      } else {
        params.delete('page');
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    } else {
      router.refresh();
    }
  }

  return (
    <VStack gap={3}>
      {error ? <Banner status="error" title={error} /> : null}
      <TextArea
        label="Staff reply"
        value={message}
        onChange={(next) => {
          setMessage(next);
          if (error) {
            setError(null);
          }
        }}
        placeholder="Write a reply to the customer…"
        rows={4}
        maxLength={MESSAGE_MAX_LENGTH}
        isDisabled={isSending}
      />
      <HStack justify="end">
        <Button
          label="Send reply"
          variant="primary"
          icon={<Send size={16} />}
          isLoading={isSending}
          isDisabled={!message.trim()}
          onClick={() => {
            void handleSend();
          }}
        />
      </HStack>
    </VStack>
  );
}
