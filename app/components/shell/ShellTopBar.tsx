'use client';

import type {ReactNode} from 'react';
import {PanelLeft} from 'lucide-react';
import {TopNav} from '@astryxdesign/core/TopNav';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {useAppShellMobile} from '@astryxdesign/core/AppShell';

import {BrandMark} from './BrandMark';

/**
 * Slim app bar: sidebar rail toggle on the left, page-level actions on the
 * right. Below md, AppShell adds the drawer toggle itself and builds the
 * drawer header from `heading`, so the brand shows there instead.
 */
export function ShellTopBar({
  label,
  brandLabel,
  isCollapsed,
  onCollapsedChange,
  endContent,
}: {
  label: string;
  brandLabel: string;
  isCollapsed: boolean;
  onCollapsedChange: (isCollapsed: boolean) => void;
  endContent?: ReactNode;
}) {
  const {isMobile} = useAppShellMobile();

  return (
    <TopNav
      label={label}
      heading={
        isMobile ? (
          <HStack gap={2} vAlign="center">
            <BrandMark size="sm" />
            <Text weight="semibold" maxLines={1} className="max-sm:hidden">
              {brandLabel}
            </Text>
          </HStack>
        ) : undefined
      }
      startContent={
        isMobile ? undefined : (
          <IconButton
            label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            icon={<Icon icon={PanelLeft} size="sm" />}
            variant="ghost"
            onClick={() => onCollapsedChange(!isCollapsed)}
          />
        )
      }
      endContent={endContent}
    />
  );
}
