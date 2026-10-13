'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Search} from 'lucide-react';
import {CommandPalette} from '@astryxdesign/core/CommandPalette';
import {createStaticSource} from '@astryxdesign/core/Typeahead';
import {VStack} from '@astryxdesign/core/VStack';
import {Kbd} from '@astryxdesign/core/Kbd';
import {SideNavItem, useSideNavCollapse} from '@astryxdesign/core/SideNav';
import {useAppShellMobile} from '@astryxdesign/core/AppShell';

export interface NavSearchItem {
  /** Destination route; doubles as the palette item id. */
  href: string;
  label: string;
  group: string;
}

/**
 * Sidebar search field that opens a page-jump command palette.
 * Also listens for mod+K anywhere in the shell.
 */
export function NavSearch({items, placeholder = 'Search'}: {items: NavSearchItem[]; placeholder?: string}) {
  const router = useRouter();
  const {isCollapsed} = useSideNavCollapse();
  const {closeMobileNav} = useAppShellMobile();
  const [isOpen, setIsOpen] = useState(false);

  const source = useMemo(
    () =>
      createStaticSource(
        items.map((item) => ({id: item.href, label: item.label, auxiliaryData: {group: item.group}})),
      ),
    [items],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Field-shaped entry above the nav; the bare icon row when the rail is collapsed.
  const trigger = (
    <SideNavItem
      label={placeholder}
      icon={Search}
      onClick={() => setIsOpen(true)}
      endContent={<Kbd keys="mod+k" />}
    />
  );

  return (
    <>
      {isCollapsed ? (
        trigger
      ) : (
        <VStack className="rounded-lg border border-border bg-surface">{trigger}</VStack>
      )}
      <CommandPalette
        label="Jump to page"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        searchSource={source}
        emptySearchText="No pages match that search"
        onValueChange={(href) => {
          if (href) {
            closeMobileNav();
            router.push(href);
          }
        }}
      />
    </>
  );
}
