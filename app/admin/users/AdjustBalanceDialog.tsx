'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { TextInput } from '@astryxdesign/core/TextInput';

import { adjustUserBalance, type AdminUserRow } from '@/actions/admin/users';
import { formatAmount } from '@/app/user/add-funds/format';

/** Manual credit/debit form  positive amount credits, negative debits. */
export function AdjustBalanceDialog({ user, onClose }: { user: AdminUserRow; onClose: () => void }) {
  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!amount || !reason.trim()) {
      setError('Enter an amount and a reason.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const result = await adjustUserBalance(user.id, amount, reason);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onClose();
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      isOpen
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      purpose="form"
      width={440}
    >
      <Layout
        header={
          <DialogHeader
            title={`Adjust balance  ${user.username}`}
            subtitle={`Current balance: ${formatAmount(user.balance)}. Positive amounts credit, negative debit.`}
            onOpenChange={onClose}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              {error ? <Banner status="error" title={error} /> : null}
              <NumberInput
                label="Amount"
                description="Use a negative value to debit."
                value={amount}
                onChange={(next) => setAmount(next)}
                units="₹"
                step={1}
                isWheelEnabled={false}
                isRequired
                isDisabled={isSaving}
              />
              <TextInput
                label="Reason"
                value={reason}
                onChange={setReason}
                placeholder="e.g. Goodwill credit for ticket #…"
                isRequired
                isDisabled={isSaving}
              />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} justify="end" width="100%">
              <Button label="Cancel" variant="secondary" onClick={onClose} isDisabled={isSaving} />
              <Button
                label="Apply adjustment"
                variant="primary"
                isLoading={isSaving}
                onClick={() => {
                  void handleSave();
                }}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
