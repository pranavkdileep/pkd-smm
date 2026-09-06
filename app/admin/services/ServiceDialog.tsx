'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Banner} from '@astryxdesign/core/Banner';
import {Typeahead} from '@astryxdesign/core/Typeahead';
import {Plus, X} from 'lucide-react';

import {
  createService,
  updateService,
  type AdminServiceRow,
  type ServiceInput,
} from '@/actions/admin/services';
import {searchUpstreams, type UpstreamOption} from '@/actions/admin/upstreams';
import {SERVICE_MAX_INPUTS} from '@/lib/database';

/** One order-form input row in the dialog: key = machine name, label = customer text. */
interface InputFieldRow {
  key: string;
  label: string;
}

function cloneDefaultRows(): InputFieldRow[] {
  return [{key: 'link', label: 'Link to page'}];
}

function toInputRows(inputs: Record<string, string>): InputFieldRow[] {
  const rows = Object.entries(inputs).map(([key, label]) => ({key, label}));
  return rows.length > 0 ? rows : cloneDefaultRows();
}

export function ServiceDialog({
  service,
  onClose,
}: {
  /** Null opens the dialog in create mode; a row opens it in edit mode. */
  service: AdminServiceRow | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [priceText, setPriceText] = useState(service ? String(service.price) : '');
  const [minOrderText, setMinOrderText] = useState(service ? String(service.minOrder) : '');
  const [maxOrderText, setMaxOrderText] = useState(service ? String(service.maxOrder) : '');
  const [refill, setRefill] = useState(service?.refill ?? false);
  const [cancel, setCancel] = useState(service?.cancel ?? false);
  const [selectedUpstream, setSelectedUpstream] = useState<UpstreamOption | null>(
    service?.upstreamId ? {id: service.upstreamId, label: service.upstreamName} : null,
  );
  const [upstreamServiceId, setUpstreamServiceId] = useState(service?.upstreamServiceId ?? '');
  const [inputRows, setInputRows] = useState<InputFieldRow[]>(
    service ? toInputRows(service.inputs) : cloneDefaultRows(),
  );
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

  function updateInputRow(index: number, patch: Partial<InputFieldRow>) {
    setInputRows((rows) => rows.map((row, i) => (i === index ? {...row, ...patch} : row)));
    clearFieldError(`key-${index}`);
    clearFieldError(`label-${index}`);
  }

  function addInputRow() {
    if (inputRows.length >= SERVICE_MAX_INPUTS) {
      return;
    }
    setInputRows((rows) => [...rows, {key: '', label: ''}]);
  }

  function removeInputRow(index: number) {
    // A service always needs at least the default link input.
    if (inputRows.length <= 1) {
      return;
    }
    setInputRows((rows) => rows.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setServerError(null);
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Service name is required.';
    }
    const price = Number(priceText);
    if (!priceText.trim() || !Number.isFinite(price) || price < 0) {
      errors.price = 'Enter a price of 0 or more.';
    }
    const minOrder = Number(minOrderText);
    if (!minOrderText.trim() || !Number.isFinite(minOrder) || minOrder < 0) {
      errors.minOrder = 'Enter a minimum of 0 or more.';
    }
    const maxOrder = Number(maxOrderText);
    if (!maxOrderText.trim() || !Number.isFinite(maxOrder) || maxOrder < 1) {
      errors.maxOrder = 'Enter a maximum of 1 or more.';
    } else if (!errors.minOrder && maxOrder < minOrder) {
      errors.maxOrder = 'Maximum cannot be below the minimum.';
    }
    if (!selectedUpstream) {
      errors.upstream = 'Upstream provider is required.';
    }
    if (!upstreamServiceId.trim()) {
      errors.upstreamServiceId = 'Upstream service ID is required.';
    }

    const seenKeys = new Set<string>();
    inputRows.forEach((row, index) => {
      const key = row.key.trim();
      const label = row.label.trim();
      if (!key) {
        errors[`key-${index}`] = 'Field key is required.';
      } else if (seenKeys.has(key.toLowerCase())) {
        errors[`key-${index}`] = 'Duplicate field key.';
      } else {
        seenKeys.add(key.toLowerCase());
      }
      if (!label) {
        errors[`label-${index}`] = 'Field label is required.';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsSaving(true);

    const inputs: Record<string, string> = {};
    for (const row of inputRows) {
      inputs[row.key.trim()] = row.label.trim();
    }
    const payload: ServiceInput = {
      name: name.trim(),
      description: description.trim(),
      status: service?.status ?? 'active',
      price,
      minOrder,
      maxOrder,
      refill,
      cancel,
      inputs,
      upstreamId: selectedUpstream?.id ?? '',
      upstreamServiceId,
    };

    const result = service ? await updateService(service.id, payload) : await createService(payload);
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
      width={560}
      maxHeight="80vh"
    >
      <Layout
        header={
          <DialogHeader
            title={service ? 'Edit service' : 'New service'}
            subtitle={
              service
                ? 'Update the catalog entry and its order form fields.'
                : 'Add a service to the panel catalog.'
            }
            onOpenChange={onClose}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              {serverError ? <Banner status="error" title={serverError} /> : null}

              <TextInput
                label="Service name"
                value={name}
                onChange={(next) => {
                  setName(next);
                  clearFieldError('name');
                }}
                placeholder="Instagram followers — premium"
                isRequired
                isDisabled={isSaving}
                status={fieldErrors.name ? {type: 'error', message: fieldErrors.name} : undefined}
              />

              <TextArea
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="What the customer gets, delivery speed, quality notes…"
                isOptional
                rows={2}
                isDisabled={isSaving}
              />

              <HStack gap={2} wrap="wrap" vAlign="end">
                <TextInput
                  label="Price"
                  value={priceText}
                  onChange={(next) => {
                    setPriceText(next);
                    clearFieldError('price');
                  }}
                  placeholder="2.50"
                  width={140}
                  isRequired
                  isDisabled={isSaving}
                  status={fieldErrors.price ? {type: 'error', message: fieldErrors.price} : undefined}
                />
                <TextInput
                  label="Min order"
                  value={minOrderText}
                  onChange={(next) => {
                    setMinOrderText(next);
                    clearFieldError('minOrder');
                  }}
                  placeholder="100"
                  width={140}
                  isRequired
                  isDisabled={isSaving}
                  status={
                    fieldErrors.minOrder ? {type: 'error', message: fieldErrors.minOrder} : undefined
                  }
                />
                <TextInput
                  label="Max order"
                  value={maxOrderText}
                  onChange={(next) => {
                    setMaxOrderText(next);
                    clearFieldError('maxOrder');
                  }}
                  placeholder="10000"
                  width={140}
                  isRequired
                  isDisabled={isSaving}
                  status={
                    fieldErrors.maxOrder ? {type: 'error', message: fieldErrors.maxOrder} : undefined
                  }
                />
              </HStack>

              <HStack gap={6} wrap="wrap">
                <CheckboxInput
                  label="Refill allowed"
                  description="Customers can request a refill."
                  value={refill}
                  onChange={setRefill}
                  isDisabled={isSaving}
                />
                <CheckboxInput
                  label="Cancel allowed"
                  description="Pending orders can be cancelled."
                  value={cancel}
                  onChange={setCancel}
                  isDisabled={isSaving}
                />
              </HStack>

              <HStack gap={2} wrap="wrap" vAlign="end">
                <Typeahead
                  label="Upstream provider"
                  value={selectedUpstream}
                  onChange={(item) => {
                    setSelectedUpstream(item);
                    clearFieldError('upstream');
                  }}
                  placeholder="Search providers…"
                  width={260}
                  isRequired
                  isDisabled={isSaving}
                  hasEntriesOnFocus
                  status={fieldErrors.upstream ? {type: 'error', message: fieldErrors.upstream} : undefined}
                  searchSource={{
                    search: (query) => searchUpstreams(query),
                    bootstrap: () => searchUpstreams(''),
                  }}
                />
                <TextInput
                  label="Upstream service ID"
                  value={upstreamServiceId}
                  onChange={(next) => {
                    setUpstreamServiceId(next);
                    clearFieldError('upstreamServiceId');
                  }}
                  placeholder="e.g. 12345"
                  width={220}
                  isRequired
                  isDisabled={isSaving}
                  status={
                    fieldErrors.upstreamServiceId
                      ? {type: 'error', message: fieldErrors.upstreamServiceId}
                      : undefined
                  }
                />
              </HStack>

              <VStack gap={2}>
                <Text weight="semibold">Order form inputs</Text>
                <Text size="sm" color="secondary">
                  Fields the customer fills in when ordering. Up to {SERVICE_MAX_INPUTS} fields.
                </Text>
                {inputRows.map((row, index) => (
                  <HStack key={index} gap={2} vAlign="end" wrap="wrap">
                    <TextInput
                      label={`Input ${index + 1} key`}
                      isLabelHidden
                      value={row.key}
                      onChange={(next) => updateInputRow(index, {key: next})}
                      placeholder="link"
                      width={150}
                      isDisabled={isSaving}
                      status={
                        fieldErrors[`key-${index}`]
                          ? {type: 'error', message: fieldErrors[`key-${index}`]}
                          : undefined
                      }
                    />
                    <TextInput
                      label={`Input ${index + 1} label`}
                      isLabelHidden
                      value={row.label}
                      onChange={(next) => updateInputRow(index, {label: next})}
                      placeholder="Link to page"
                      width={250}
                      isDisabled={isSaving}
                      status={
                        fieldErrors[`label-${index}`]
                          ? {type: 'error', message: fieldErrors[`label-${index}`]}
                          : undefined
                      }
                    />
                    <Button
                      label={`Remove input ${index + 1}`}
                      isIconOnly
                      icon={<X size={16} aria-hidden="true" />}
                      variant="ghost"
                      onClick={() => removeInputRow(index)}
                      isDisabled={isSaving || inputRows.length <= 1}
                    />
                  </HStack>
                ))}
                <HStack>
                  <Button
                    label="Add input"
                    variant="secondary"
                    icon={<Plus size={16} aria-hidden="true" />}
                    onClick={addInputRow}
                    isDisabled={isSaving || inputRows.length >= SERVICE_MAX_INPUTS}
                  />
                </HStack>
              </VStack>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} justify="end" width="100%">
              <Button
                label="Cancel"
                variant="secondary"
                onClick={onClose}
                isDisabled={isSaving}
              />
              <Button
                label={service ? 'Save changes' : 'Create service'}
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

