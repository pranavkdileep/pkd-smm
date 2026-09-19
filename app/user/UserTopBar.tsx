'use client';

import {useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {TopNav, TopNavItem} from '@astryxdesign/core/TopNav';
import {MobileNavToggle} from '@astryxdesign/core/MobileNav';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Wallet, UserRound, LogOut} from 'lucide-react';

import {logout} from '@/actions/auth/logout';

interface UserTopBarProps {
  balance: number;
}

function formatMoney(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function UserTopBar({balance}: UserTopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  return (
    <TopNav
      label="Account bar"
      // Explicit toggle: AppShell auto-collapses sideNav below md into a
      // drawer, and this toggle (no-op on desktop) opens it on mobile.
      startContent={<MobileNavToggle label="Open navigation" />}
      endContent={
        <HStack gap={5} vAlign="center">
          <HStack gap={1.5} vAlign="center">
            <Icon icon={Wallet} size="sm" />
            <Text type="label" color="secondary">Balance</Text>
            <Text weight="semibold">{formatMoney(balance)}</Text>
          </HStack>
          <TopNavItem
            label="Account"
            href="/user/settings"
            icon={<UserRound size={16} aria-hidden="true" />}
            isSelected={pathname.startsWith('/user/settings')}
          />
          <IconButton
            label="Sign out"
            icon={<LogOut size={16} aria-hidden="true" />}
            variant="ghost"
            isDisabled={isPending}
            isLoading={isPending}
            onClick={async () => {
              setIsPending(true);
              try {
                await logout();
                router.push('/');
              } finally {
                setIsPending(false);
              }
            }}
          />
        </HStack>
      }
    />
  );
}
