'use client';

import {useState} from 'react';
import {usePathname} from 'next/navigation';
import {TopNav, TopNavItem} from '@astryxdesign/core/TopNav';
import {MobileNav, MobileNavToggle} from '@astryxdesign/core/MobileNav';
import {AppShellMobileContext} from '@astryxdesign/core/AppShell';
import {SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {HStack} from '@astryxdesign/core/HStack';
import Link from 'next/link';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {siteConfig} from '@/lib/config';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const pathname = usePathname();
  // Don't offer the page the visitor is already on.
  const isLogin = pathname === '/login';
  const isSignup = pathname === '/signup';
  const isHome = pathname === '/';

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: isHome ? '#pricing' : '/#pricing' },
    { label: 'How it works', href: isHome ? '#how-it-works' : '/#how-it-works' },
    { label: 'FAQ', href: isHome ? '#faq' : '/#faq' },
  ];

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
          label={siteConfig.nav.mainAriaLabel}
          heading={
            <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-90">
              <HStack
                width={34}
                height={34}
                className="rounded-lg bg-accent-bg text-xs font-bold text-blue-vivid"
                hAlign="center"
                vAlign="center"
              >
                {siteConfig.brandInitials}
              </HStack>
              <Text weight="bold">{siteConfig.name}</Text>
            </Link>
          }
          startContent={
            <HStack className="max-md:hidden" gap={0.5}>
              {navLinks.map((link) => (
                <TopNavItem key={link.href} label={link.label} href={link.href} />
              ))}
            </HStack>
          }
          endContent={
            <HStack gap={2}>
              <span className="md:hidden">
                <MobileNavToggle label="Open menu" />
              </span>
              {isLogin ? null : (
                <Button label="Sign in" variant="ghost" href="/login" size="sm" className="max-sm:hidden" />
              )}
              {isSignup ? null : (
                <Button label="Sign up" variant="primary" href="/signup" size="sm" />
              )}
            </HStack>
          }
        />

        <MobileNav isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} header="Menu">
          <SideNavSection title="Explore">
            {navLinks.map((link) => (
              <SideNavItem
                key={link.href}
                label={link.label}
                href={link.href}
                onClick={closeMenu}
              />
            ))}
          </SideNavSection>
          <SideNavSection title="Account">
            {isLogin ? null : (
              <SideNavItem label="Sign in" href="/login" onClick={closeMenu} />
            )}
            {isSignup ? null : (
              <SideNavItem label="Create free account" href="/signup" onClick={closeMenu} />
            )}
          </SideNavSection>
        </MobileNav>
      </HStack>
    </AppShellMobileContext.Provider>
  );
}
