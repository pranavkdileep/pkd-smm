'use client';

import {Search} from 'lucide-react';
import {HStack} from '@astryxdesign/core/HStack';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';

/**
 * Floating pill search: a large TextInput (pill radius + soft shadow come
 * from the theme's `text-input` size:lg rule) beside a dark round submit.
 */
export function PillSearch({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  isDisabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  isDisabled?: boolean;
}) {
  return (
    <form
      role="search"
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <HStack gap={2} vAlign="center">
        <TextInput
          label={label}
          isLabelHidden
          size="lg"
          width="100%"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          htmlName="q"
          hasClear
          isDisabled={isDisabled}
        />
        <Button
          label="Search"
          isIconOnly
          size="lg"
          variant="primary"
          type="submit"
          icon={<Icon icon={Search} size="sm" />}
          isDisabled={isDisabled}
          className="size-12 shrink-0 rounded-full"
        />
      </HStack>
    </form>
  );
}
