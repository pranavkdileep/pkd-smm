'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Spinner } from '@astryxdesign/core/Spinner';
import { Text } from '@astryxdesign/core/Text';

import { checkDepositStatus } from '@/actions/deposits/status';

import { formatAmount } from './format';

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 24; // ~2 minutes, then the user checks manually.

interface PaymentResultBannerProps {
  payment: string | undefined;
  depositId?: string;
  amount?: string;
  error?: string;
  alreadyCredited: boolean;
}

type Outcome =
  | { kind: 'success'; amount?: number; alreadyCredited: boolean }
  | { kind: 'failed'; message: string }
  | { kind: 'pending' }
  | { kind: 'cancelled' };

const DEFAULT_FAILURE_MESSAGE = 'The payment was unsuccessful. No charge was made.';

function toOutcome(props: PaymentResultBannerProps): Outcome | null {
  switch (props.payment) {
    case 'success':
    case 'already_credited':
      return {
        kind: 'success',
        amount: props.amount ? Number(props.amount) : undefined,
        alreadyCredited: props.alreadyCredited || props.payment === 'already_credited',
      };
    case 'failed':
      return { kind: 'failed', message: props.error || DEFAULT_FAILURE_MESSAGE };
    case 'pending':
      return { kind: 'pending' };
    case 'cancelled':
      return { kind: 'cancelled' };
    default:
      return null;
  }
}

/**
 * Alert banner shown when the user returns from the payment gateway.
 * Pending payments are polled against the gateway via status.ts until they
 * resolve; the resolved banner replaces itself in place.
 */
export function PaymentResultBanner(props: PaymentResultBannerProps) {
  const router = useRouter();
  const [outcome, setOutcome] = useState<Outcome | null>(() => toOutcome(props));
  const [isChecking, setIsChecking] = useState(false);
  const attemptsRef = useRef(0);
  const depositId = props.depositId;

  const checkNow = useCallback(async () => {
    if (!depositId) {
      return;
    }
    setIsChecking(true);
    const result = await checkDepositStatus(depositId);
    setIsChecking(false);

    if (result.status === 'completed') {
      setOutcome({
        kind: 'success',
        amount: result.amount,
        alreadyCredited: Boolean(result.alreadyProcessed),
      });
      router.refresh();
    } else if (result.status === 'failed') {
      setOutcome({ kind: 'failed', message: result.error || DEFAULT_FAILURE_MESSAGE });
      router.refresh();
    } else if (result.status === 'cancelled') {
      setOutcome({ kind: 'cancelled' });
      router.refresh();
    }
    // Still pending (or transient): keep polling.
  }, [depositId, router]);

  useEffect(() => {
    if (outcome?.kind !== 'pending' || !depositId) {
      return;
    }
    if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
      return;
    }
    const timer = setInterval(() => {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
        clearInterval(timer);
        return;
      }
      void checkNow();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [outcome?.kind, depositId, checkNow]);

  if (!outcome) {
    return null;
  }

  // Clears the return params so the banner goes away and the form is ready.
  function retry() {
    router.replace('/user/add-funds');
  }

  if (outcome.kind === 'success') {
    return (
      <Banner
        status="success"
        isDismissable
        title={
          outcome.amount !== undefined && !Number.isNaN(outcome.amount)
            ? `${formatAmount(outcome.amount)} added to your balance`
            : 'Deposit credited'
        }
        description={
          outcome.alreadyCredited
            ? 'This deposit was already credited earlier  you were not charged twice.'
            : 'Your balance has been updated.'
        }
      />
    );
  }

  if (outcome.kind === 'failed') {
    return (
      <Banner
        status="error"
        title="Payment failed"
        description={outcome.message}
        endContent={
          <Button variant="secondary" size="sm" label="Try again" onClick={retry} />
        }
      />
    );
  }

  if (outcome.kind === 'cancelled') {
    return (
      <Banner
        status="warning"
        isDismissable
        title="Payment cancelled"
        description="You cancelled the checkout  no charge was made."
        endContent={
          <Button variant="secondary" size="sm" label="Try again" onClick={retry} />
        }
      />
    );
  }

  return (
    <Banner
      status="info"
      title="Confirming your payment"
      description="We check with the payment gateway every few seconds  this updates automatically."
      endContent={
        depositId ? (
          <Button
            variant="secondary"
            size="sm"
            label={isChecking ? 'Checking…' : 'Check now'}
            isLoading={isChecking}
            onClick={() => void checkNow()}
          />
        ) : null
      }
    >
      <HStack gap={3} vAlign="center">
        <Spinner size="sm" />
        <Text size="sm" color="secondary">
          Waiting for the gateway to confirm the payment
          {depositId ? ` (Deposit ID: ${depositId})` : ''}. You can also check again in a
          moment from the deposit history below.
        </Text>
      </HStack>
    </Banner>
  );
}
