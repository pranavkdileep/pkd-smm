'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Badge } from '@astryxdesign/core/Badge';
import { Switch } from '@astryxdesign/core/Switch';
import { Divider } from '@astryxdesign/core/Divider';
import { siteConfig } from '@/lib/config';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = siteConfig.legal.cookieConsentKey;

export function CookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as CookiePreferences;
          setPreferences(parsed);
          setHasConsent(true);
        } else {
          setHasConsent(false);
        }
      } catch {
        setHasConsent(false);
      }
    }, 0);

    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener(siteConfig.legal.eventCookieSettings, handleOpen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(siteConfig.legal.eventCookieSettings, handleOpen);
    };
  }, []);

  const saveConsent = (prefs: Omit<CookiePreferences, 'timestamp'>) => {
    const fullPrefs: CookiePreferences = {
      ...prefs,
      necessary: true,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPrefs));
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setPreferences(fullPrefs);
    setHasConsent(true);
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectNonEssential = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (hasConsent === null) return null;

  return (
    <>
      {/* Banner on first visit */}
      {!hasConsent && !isModalOpen && (
        <aside
          aria-label="Cookie consent banner"
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface p-4 shadow-2xl md:p-6"
        >
          <VStack maxWidth={1280} gap={4} className="mx-auto">
            <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
              <VStack gap={1} align="start" className="max-w-3xl">
                <HStack gap={2} vAlign="center">
                  <Badge variant="blue" label="Privacy & Cookies" />
                  <Text size="sm" weight="bold" color="primary">
                    Your choice regarding cookies and tracking on {siteConfig.name}
                  </Text>
                </HStack>
                <Text size="xsm" color="secondary">
                  We use cookies to maintain your login session, prevent fraud, and ensure platform
                  reliability. With your permission, we also use optional analytics and marketing cookies
                  to improve service delivery and track referral commissions. You can change your choice anytime in{' '}
                  <Link href="/cookies" className="underline hover:text-blue-vivid">
                    Cookie Policy
                  </Link>
                  .
                </Text>
              </VStack>

              <HStack gap={2} wrap="wrap" vAlign="center">
                <Button
                  label="Reject non-essential"
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectNonEssential}
                />
                <Button
                  label="Preferences"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                />
                <Button
                  label="Accept all"
                  variant="primary"
                  size="sm"
                  onClick={handleAcceptAll}
                />
              </HStack>
            </HStack>
          </VStack>
        </aside>
      )}

      {/* Preferences Dialog */}
      {isModalOpen && (
        <aside
          aria-label="Cookie preferences modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <VStack
            maxWidth={640}
            gap={6}
            className="w-full rounded-2xl border border-border bg-surface p-6 shadow-2xl md:p-8"
          >
            <HStack justify="between" vAlign="center">
              <VStack gap={1} align="start">
                <Heading level={3}>Manage Cookie Preferences</Heading>
                <Text size="xsm" color="secondary">
                  Configure which categories of cookies and identifiers you allow {siteConfig.name} to use.
                </Text>
              </VStack>
              <Button
                label="✕"
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              />
            </HStack>

            <Divider />

            <VStack gap={4} className="w-full">
              {/* Essential Cookies */}
              <VStack gap={2} className="rounded-xl border border-border bg-card p-4">
                <HStack justify="between" vAlign="center">
                  <VStack gap={0} align="start">
                    <HStack gap={2} vAlign="center">
                      <Text size="sm" weight="bold">
                        Strictly Necessary Cookies
                      </Text>
                      <Badge variant="neutral" label="Always Active" />
                    </HStack>
                    <Text size="xsm" color="secondary">
                      Required for basic functions: authenticated sessions ({siteConfig.auth.sessionCookie}), CSRF security,
                      and storing consent settings. Cannot be turned off.
                    </Text>
                  </VStack>
                  <Switch
                    label="Necessary"
                    isLabelHidden
                    value={true}
                    isDisabled
                    disabledMessage="Essential for security and authentication"
                  />
                </HStack>
              </VStack>

              {/* Analytics Cookies */}
              <VStack gap={2} className="rounded-xl border border-border bg-card p-4">
                <HStack justify="between" vAlign="center">
                  <VStack gap={0} align="start">
                    <HStack gap={2} vAlign="center">
                      <Text size="sm" weight="bold">
                        Performance & Analytics Cookies
                      </Text>
                      <Badge variant="blue" label="Optional" />
                    </HStack>
                    <Text size="xsm" color="secondary">
                      Helps us count page visits, analyze user flow, and identify order processing
                      bottlenecks to optimize platform speed and uptime.
                    </Text>
                  </VStack>
                  <Switch
                    label="Analytics"
                    isLabelHidden
                    value={preferences.analytics}
                    onChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, analytics: checked }))
                    }
                  />
                </HStack>
              </VStack>

              {/* Marketing & Affiliate Cookies */}
              <VStack gap={2} className="rounded-xl border border-border bg-card p-4">
                <HStack justify="between" vAlign="center">
                  <VStack gap={0} align="start">
                    <HStack gap={2} vAlign="center">
                      <Text size="sm" weight="bold">
                        Marketing & Referral Tracking
                      </Text>
                      <Badge variant="blue" label="Optional" />
                    </HStack>
                    <Text size="xsm" color="secondary">
                      Attributes referral registrations to affiliate partners and measures promotional
                      campaign reach without profiling personal identities.
                    </Text>
                  </VStack>
                  <Switch
                    label="Marketing"
                    isLabelHidden
                    value={preferences.marketing}
                    onChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, marketing: checked }))
                    }
                  />
                </HStack>
              </VStack>
            </VStack>

            <Divider />

            <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
              <Button
                label="Reject non-essential"
                variant="ghost"
                size="sm"
                onClick={handleRejectNonEssential}
              />
              <HStack gap={2}>
                <Button
                  label="Accept all"
                  variant="secondary"
                  size="sm"
                  onClick={handleAcceptAll}
                />
                <Button
                  label="Save preferences"
                  variant="primary"
                  size="sm"
                  onClick={handleSaveCustom}
                />
              </HStack>
            </HStack>
          </VStack>
        </aside>
      )}
    </>
  );
}
