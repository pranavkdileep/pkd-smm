'use client';

import {useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {HStack} from '@astryxdesign/core/HStack';
import {TextInput, type TextInputStatus} from '@astryxdesign/core/TextInput';
import {IconButton} from '@astryxdesign/core/IconButton';

/**
 * Password field with a show/hide toggle. TextInput has no adornment slot,
 * so the toggle sits beside the input, bottom-aligned with the text box.
 */
export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  htmlName,
  isRequired,
  isDisabled,
  description,
  status,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  htmlName?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  description?: string;
  status?: {type: 'error' | 'warning' | 'success'; message?: string};
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <HStack gap={2} vAlign="end" width="100%">
      <TextInput
        label={label}
        type={isVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        htmlName={htmlName}
        isRequired={isRequired}
        isDisabled={isDisabled}
        description={description}
        status={status as TextInputStatus | undefined}
        width="100%"
        className="flex-1"
      />
      <IconButton
        label={isVisible ? 'Hide password' : 'Show password'}
        tooltip={isVisible ? 'Hide password' : 'Show password'}
        icon={
          isVisible ? (
            <EyeOff size={16} aria-hidden="true" />
          ) : (
            <Eye size={16} aria-hidden="true" />
          )
        }
        variant="ghost"
        onClick={() => setIsVisible((v) => !v)}
        isDisabled={isDisabled}
      />
    </HStack>
  );
}
