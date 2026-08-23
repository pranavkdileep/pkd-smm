'use client';

import {useState} from 'react';
import {TopNav, TopNavItem} from '@astryxdesign/core/TopNav';
import {MobileNav, MobileNavToggle} from '@astryxdesign/core/MobileNav';
import {AppShellMobileContext} from '@astryxdesign/core/AppShell';
import {SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';

const NAV_LINKS = [
  {label: 'Services', href: '#services'},
  {label: 'Pricing', href: '#pricing'},
  {label: 'How it works', href: '#how-it-works'},
  {label: 'FAQ', href: '#faq'},
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <AppShellMobileContext.Provider
      value={{
        isMobile: true,
        isMobileNavOpen: isMenuOpen,
        toggleMobileNav: () => setIsMenuOpen((v) => !v),
        openMobileNav: () => setIsMenuOpen(true),
        closeMobileNav: () => setIsMenuOpen(false),
        isMobileNavEnabled: true,
        hasAutoToggle: false,
      }}
    >
      <HStack className="sticky top-0 z-50 bg-surface shadow-sm">
        <TopNav
          label="PKD-SMM Panel main navigation"
          heading={
            <HStack gap={2} vAlign="center">
              <HStack
                width={34}
                height={34}
                className="rounded-lg bg-accent-bg text-xs font-bold text-blue-vivid"
                hAlign="center"
                vAlign="center"
              >
                PKD
              </HStack>
              <Text weight="bold">PKD-SMM Panel</Text>
            </HStack>
          }
          startContent={
            <HStack className="max-md:hidden" gap={0.5}>
              {NAV_LINKS.map((link) => (
                <TopNavItem key={link.href} label={link.label} href={link.href} />
              ))}
            </HStack>
          }
          endContent={
            <HStack gap={2}>
              <MobileNavToggle label="Open menu" />
              <Button label="Sign in" variant="ghost" href="/login" size="sm" className="max-sm:hidden" />
              <Button label="Sign up" variant="primary" href="/signup" size="sm" />
            </HStack>
          }
        />

        <MobileNav isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} header="Menu">
          <SideNavSection title="Explore">
            {NAV_LINKS.map((link) => (
              <SideNavItem
                key={link.href}
                label={link.label}
                href={link.href}
                onClick={closeMenu}
              />
            ))}
          </SideNavSection>
          <SideNavSection title="Account">
            <SideNavItem label="Sign in" href="/login" onClick={closeMenu} />
            <SideNavItem label="Create free account" href="/signup" onClick={closeMenu} />
          </SideNavSection>
        </MobileNav>
      </HStack>
    </AppShellMobileContext.Provider>
  );
}
