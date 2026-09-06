'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Banner} from '@astryxdesign/core/Banner';

import {
  createUpstream,
  updateUpstream,
  type AdminUpstreamRow,
  type UpstreamInput,
} from '@/actions/admin/upstreams';

export function UpstreamDialog({
  upstream,
  onClose,
}: {
  /** Null opens the dialog in create mode; a row opens it in edit mode. */
  upstream: AdminUpstreamRow | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(upstream?.name ?? '');
  const [apiUrl, setApiUrl] = useState(upstream?.apiUrl ?? '');
  const [apiKey, setApiKey] = useState(upstream?.apiKey ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  async function handleSave() {
    setServerError(null);
    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = 'Provider name is required.';
    }
    if (!apiUrl.trim()) {
      errors.apiUrl = 'API URL is required.';
    } else if (!/^https?:\/\//i.test(apiUrl.trim())) {
      errors.apiUrl = 'API URL must start with http:// or https://.';
    }
    if (!apiKey.trim()) {
      errors.apiKey = 'API key is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsSaving(true);

    const payload: UpstreamInput = {
      name: name.trim(),
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim(),
    };

    const result = upstream
      ? await updateUpstream(upstream.id, payload)
      : await createUpstream(payload);
    setIsSaving(false);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    onClose();
    router.refresh();
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
      width={520}
      maxHeight="80vh"
    >
      <Layout
        header={
          <DialogHeader
            title={upstream ? 'Edit provider' : 'New provider'}
            subtitle={
              upstream
                ? 'Update this upstream API connection.'
                : 'Connect a new upstream provider API.'
            }
            onOpenChange={onClose}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              {serverError ? <Banner status="error" title={serverError} /> : null}

              <TextInput
                label="Provider name"
                value={name}
                onChange={(next) => {
                  setName(next);
                  clearFieldError('name');
                }}
                placeholder="e.g. SMMPanel"
                isRequired
                isDisabled={isSaving}
                status={fieldErrors.name ? {type: 'error', message: fieldErrors.name} : undefined}
              />

              <TextInput
                label="API URL"
                value={apiUrl}
                onChange={(next) => {
                  setApiUrl(next);
                  clearFieldError('apiUrl');
                }}
                placeholder="https://api.example.com/v1"
                isRequired
                isDisabled={isSaving}
                status={fieldErrors.apiUrl ? {type: 'error', message: fieldErrors.apiUrl} : undefined}
              />

              <TextInput
                label="API key"
                type="password"
                value={apiKey}
                onChange={(next) => {
                  setApiKey(next);
                  clearFieldError('apiKey');
                }}
                placeholder="••••••••"
                isRequired
                isDisabled={isSaving}
                status={fieldErrors.apiKey ? {type: 'error', message: fieldErrors.apiKey} : undefined}
              />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} justify="end" width="100%">
              <Button label="Cancel" variant="secondary" onClick={onClose} isDisabled={isSaving} />
              <Button
                label={upstream ? 'Save changes' : 'Create provider'}
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
