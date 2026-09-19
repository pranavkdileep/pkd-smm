'use client';

import {useState} from 'react';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Banner} from '@astryxdesign/core/Banner';
import {Badge} from '@astryxdesign/core/Badge';

import {resendEmailVerification} from '@/actions/users/verification';

/**
 * Inline "resend verification email" control for unverified accounts.
 * Confirmation is shown inline (the send itself is invisible), not as a toast.
 */
export function EmailVerification({email}: {email: string}) {
  const [isPending, setIsPending] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setError(null);
    setIsPending(true);
    try {
      const result = await resendEmailVerification();
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSentAt(Date.now());
    } finally {
      setIsPending(false);
    }
  }

  return (
    <VStack gap={3}>
      <HStack gap={2} vAlign="center">
        <Badge variant="warning" label="Unverified" />
        <Text color="secondary">{email} isn’t verified yet.</Text>
      </HStack>

      {sentAt !== null ? (
        <Banner
          status="success"
          title="Verification email sent"
          description={`Open the link we sent to ${email} within 24 hours to confirm your address.`}
        />
      ) : null}
      {error ? <Banner status="error" title={error} /> : null}

      <HStack gap={2} vAlign="center">
        <Button
          label={sentAt !== null ? 'Send again' : 'Resend verification email'}
          variant="secondary"
          isLoading={isPending}
          isDisabled={isPending}
          onClick={() => {
            void handleResend();
          }}
        />
        {sentAt !== null ? (
          <Text size="sm" color="secondary">Sent just now — check your inbox.</Text>
        ) : null}
      </HStack>
    </VStack>
  );
}
