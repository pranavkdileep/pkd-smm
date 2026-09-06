'use client';

import {useState} from 'react';

import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {Divider} from '@astryxdesign/core/Divider';
import {Banner} from '@astryxdesign/core/Banner';

import {createDepositOrder} from '@/actions/deposits/create';

import {formatAmount} from './format';

const MIN_DEPOSIT = 60; // Panel minimum for INR top-ups.
const MAX_DEPOSIT = 50000; // Mirrors the single-transaction limit in create.ts.
const PRESET_AMOUNTS = [100, 250, 500, 1000];

/**
 * Add Funds form: picks an amount (with quick presets), confirms the gateway,
 * then hands off to the Dodo Payments checkout via the create.ts server action.
 */
export function AddFundsForm() {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Single gateway today; the selector keeps the choice explicit and leaves
  // room for more gateways without changing the form layout.
  const [gateway, setGateway] = useState('dodopayments');

  function selectAmount(next: string) {
    setAmount(next);
    setAmountError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const parsed = Number(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setAmountError('Enter an amount to deposit.');
      return;
    }
    if (parsed < MIN_DEPOSIT) {
      setAmountError(`Minimum deposit is ₹${MIN_DEPOSIT}.`);
      return;
    }
    if (parsed > MAX_DEPOSIT) {
      setAmountError(`Maximum single deposit is ${formatAmount(MAX_DEPOSIT)}.`);
      return;
    }

    setIsSubmitting(true);
    const result = await createDepositOrder({amount: parsed});

    if (!result.success || !result.checkoutUrl) {
      setServerError(result.error ?? 'Could not start the checkout. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Full-page redirect to the gateway's hosted checkout.
    window.location.assign(result.checkoutUrl);
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={5}>
        {serverError ? <Banner status="error" title={serverError} /> : null}

        <VStack gap={2}>
          <TextInput
            label="Amount (₹)"
            value={amount}
            onChange={(next) => selectAmount(next.replace(/[^\d.]/g, ''))}
            placeholder="Enter amount"
            description={`Minimum deposit is ₹${MIN_DEPOSIT}.`}
            isRequired
            isDisabled={isSubmitting}
            status={amountError ? {type: 'error', message: amountError} : undefined}
            width="100%"
          />
          <HStack gap={2} vAlign="center" wrap="wrap">
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="secondary"
                size="sm"
                label={`₹${preset}`}
                isDisabled={isSubmitting}
                onClick={() => selectAmount(String(preset))}
              />
            ))}
          </HStack>
        </VStack>

        <Divider />

        <RadioList
          label="Payment gateway"
          description="How you want to pay at checkout."
          value={gateway}
          onChange={setGateway}
          isDisabled={isSubmitting}
        >
          <RadioListItem
            value="dodopayments"
            label="Dodo Payments"
            description="Cards, net banking, UPI, and global wallets."
          />
        </RadioList>

        <VStack gap={2}>
          <Button
            type="submit"
            variant="primary"
            label={isSubmitting ? 'Redirecting to checkout…' : 'Continue to checkout'}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            width="100%"
          />
          <Text size="sm" color="secondary">
            You&apos;ll be redirected to Dodo Payments&apos; secure checkout to complete the payment.
          </Text>
        </VStack>
      </VStack>
    </form>
  );
}
