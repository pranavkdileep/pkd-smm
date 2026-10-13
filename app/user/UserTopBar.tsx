'use client';

import {Plus, Wallet} from 'lucide-react';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {Button} from '@astryxdesign/core/Button';

import {ShellTopBar} from '@/app/components/shell/ShellTopBar';

interface UserTopBarProps {
  balance: number;
  isCollapsed: boolean;
  onCollapsedChange: (isCollapsed: boolean) => void;
}

function formatMoney(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function UserTopBar({balance, isCollapsed, onCollapsedChange}: UserTopBarProps) {
  return (
    <ShellTopBar
      label="Account bar"
      brandLabel="Dashboard"
      isCollapsed={isCollapsed}
      onCollapsedChange={onCollapsedChange}
      endContent={
        <HStack gap={4} vAlign="center">
          <HStack gap={1.5} vAlign="center">
            <Icon icon={Wallet} size="sm" color="secondary" />
            <Text type="label" color="secondary" className="max-lg:hidden">
              Balance
            </Text>
            <Text weight="semibold" hasTabularNumbers>
              {formatMoney(balance)}
            </Text>
          </HStack>
          <Button
            label="Add funds"
            variant="primary"
            href="/user/add-funds"
            icon={<Icon icon={Plus} size="sm" />}
          />
        </HStack>
      }
    />
  );
}
