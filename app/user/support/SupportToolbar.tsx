'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Plus} from 'lucide-react';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Selector} from '@astryxdesign/core/Selector';
import {Banner} from '@astryxdesign/core/Banner';

import {SUPPORT_TICKET_CATEGORIES, SUPPORT_TICKET_PRIORITIES} from '@/lib/database';
import {createSupportTicket} from '@/actions/support/create';

import {CATEGORY_LABELS, PRIORITY_LABELS} from '@/app/components/support/ticketMeta';

const TITLE_MIN_LENGTH = 3; // Mirrors the limit enforced in actions/support/create.ts.
const TITLE_MAX_LENGTH = 120;
const MESSAGE_MAX_LENGTH = 5000;

const CATEGORY_OPTIONS = SUPPORT_TICKET_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));

const PRIORITY_OPTIONS = SUPPORT_TICKET_PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));

/** "Open a ticket" action: primary button that opens the new-ticket dialog. */
export function SupportToolbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HStack gap={2} vAlign="center">
      <Button
        label="Open a ticket"
        variant="primary"
        icon={<Plus size={16} />}
        onClick={() => setIsOpen(true)}
      />
      {isOpen ? <NewTicketDialog onClose={() => setIsOpen(false)} /> : null}
    </HStack>
  );
}

function NewTicketDialog({onClose}: {onClose: () => void}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(key: string) {
    setFieldErrors((previous) => {
      if (!previous[key]) {
        return previous;
      }
      const next = {...previous};
      delete next[key];
      return next;
    });
  }

  async function handleSubmit() {
    setServerError(null);
    const errors: Record<string, string> = {};

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < TITLE_MIN_LENGTH) {
      errors.title = `Give your ticket a title of at least ${TITLE_MIN_LENGTH} characters.`;
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      errors.title = `Titles must be ${TITLE_MAX_LENGTH} characters or fewer.`;
    }
    if (!category) {
      errors.category = 'Choose a category.';
    }
    if (!message.trim()) {
      errors.message = 'Describe the issue in the message box.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    const result = await createSupportTicket({
      title: trimmedTitle,
      category,
      priority,
      message: message.trim(),
    });
    setIsSubmitting(false);

    if (!result.success || !result.ticketId) {
      setServerError(result.error ?? 'Could not open the ticket. Please try again.');
      return;
    }

    onClose();
    router.push(`/user/support/${result.ticketId}`);
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
      width={560}
      maxHeight="80vh"
    >
      <Layout
        header={
          <DialogHeader
            title="Open a support ticket"
            subtitle="The team replies inside the ticket's conversation."
            onOpenChange={onClose}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              {serverError ? <Banner status="error" title={serverError} /> : null}

              <TextInput
                label="Title"
                value={title}
                onChange={(next) => {
                  setTitle(next);
                  clearFieldError('title');
                }}
                placeholder="e.g. Order #1234 stuck in processing"
                isRequired
                isDisabled={isSubmitting}
                status={fieldErrors.title ? {type: 'error', message: fieldErrors.title} : undefined}
              />

              <Selector
                label="Category"
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(next) => {
                  setCategory(next);
                  clearFieldError('category');
                }}
                placeholder="Choose a category…"
                isRequired
                isDisabled={isSubmitting}
                status={
                  fieldErrors.category ? {type: 'error', message: fieldErrors.category} : undefined
                }
              />

              <Selector
                label="Priority"
                options={PRIORITY_OPTIONS}
                value={priority}
                onChange={(next) => {
                  setPriority(next);
                  clearFieldError('priority');
                }}
                isRequired
                isDisabled={isSubmitting}
              />

              <TextArea
                label="Message"
                value={message}
                onChange={(next) => {
                  setMessage(next);
                  clearFieldError('message');
                }}
                placeholder="Describe the issue in detail — order ids, links, and what you expected."
                rows={5}
                maxLength={MESSAGE_MAX_LENGTH}
                isRequired
                isDisabled={isSubmitting}
                status={
                  fieldErrors.message ? {type: 'error', message: fieldErrors.message} : undefined
                }
              />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} justify="end" width="100%">
              <Button label="Cancel" variant="secondary" onClick={onClose} isDisabled={isSubmitting} />
              <Button
                label="Open ticket"
                variant="primary"
                isLoading={isSubmitting}
                onClick={() => {
                  void handleSubmit();
                }}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
