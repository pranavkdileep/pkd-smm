#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = process.cwd();

const LEGAL_ROUTES = [
  { path: 'app/privacy/page.tsx', name: 'Privacy Policy', url: '/privacy' },
  { path: 'app/terms/page.tsx', name: 'Terms of Service', url: '/terms' },
  { path: 'app/cookies/page.tsx', name: 'Cookie Policy', url: '/cookies' },
  { path: 'app/refund/page.tsx', name: 'Refund Policy', url: '/refund' },
  { path: 'app/delivery/page.tsx', name: 'Delivery Policy', url: '/delivery' },
  { path: 'app/accessibility/page.tsx', name: 'Accessibility Statement', url: '/accessibility' },
  { path: 'app/affiliate-disclosure/page.tsx', name: 'Affiliate Disclosure', url: '/affiliate-disclosure' },
  { path: 'app/dmca/page.tsx', name: 'DMCA Policy', url: '/dmca' },
];

function read(relPath) {
  const full = resolve(ROOT, relPath);
  if (!existsSync(full)) {
    throw new Error(`File not found: ${relPath}`);
  }
  return readFileSync(full, 'utf8');
}

function checkRoutes() {
  for (const route of LEGAL_ROUTES) {
    const content = read(route.path);
    if (!content.includes('export default') && !content.includes('export default function')) {
      throw new Error(`${route.path} does not export default React component`);
    }
    if (!content.includes('metadata')) {
      throw new Error(`${route.path} does not export metadata`);
    }
  }
  console.log('routes verification passed');
}

function checkPrivacy() {
  const privacy = read('app/privacy/page.tsx');
  const requiredTerms = [
    'GDPR',
    'CCPA',
    'CPRA',
    'DPDP',
    'Privacy Act',
    'PIPEDA',
    'LGPD',
    'Do Not Sell',
    'passwords', // explicit statement that passwords are never collected
    'Contract',
    'Legitimate Interest',
    'Consent',
    'Retention',
    'Standard Contractual Clauses',
    'COPPA',
    'siteConfig.email.privacy',
  ];

  for (const term of requiredTerms) {
    if (!privacy.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`Privacy policy missing required topic: "${term}"`);
    }
  }
  console.log('privacy disclosures verification passed');
}

function checkTerms() {
  const terms = read('app/terms/page.tsx');
  const requiredTerms = [
    'Acceptance of Terms',
    'Eligibility',
    'Services Description',
    'User Conduct',
    'Independent Third-Party',
    'Instagram',
    'TikTok',
    'Warranty',
    'Limitation of Liability',
    'Governing Law',
    'Dispute Resolution',
    'Refill',
  ];

  for (const term of requiredTerms) {
    if (!terms.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`Terms of Service missing required topic: "${term}"`);
    }
  }
  console.log('terms verification passed');
}

function checkCookies() {
  const cookiesPage = read('app/cookies/page.tsx');
  const cookieConsent = read('app/components/legal/CookieConsent.tsx');

  const pageTerms = ['Strictly Necessary', 'Analytics', 'Marketing', 'Manage Cookie Preferences'];
  for (const term of pageTerms) {
    if (!cookiesPage.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`Cookie policy missing required topic: "${term}"`);
    }
  }

  const consentTerms = ['Accept all', 'Reject non-essential', 'cookieConsentKey', 'localStorage'];
  for (const term of consentTerms) {
    if (!cookieConsent.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`CookieConsent component missing required functionality: "${term}"`);
    }
  }

  console.log('cookie consent verification passed');
}

function checkCommerce() {
  const refund = read('app/refund/page.tsx');
  const delivery = read('app/delivery/page.tsx');

  const refundTerms = [
    'cooling-off',
    'Consumer Rights Directive',
    'Digital',
    'Wallet',
    'Refill',
    'Chargeback',
  ];
  for (const term of refundTerms) {
    if (!refund.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`Refund policy missing required topic: "${term}"`);
    }
  }

  const deliveryTerms = [
    'Public link',
    'Start time',
    'Drip-feed',
    'Real-time status',
    'Stalled',
  ];
  for (const term of deliveryTerms) {
    if (!delivery.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`Delivery policy missing required topic: "${term}"`);
    }
  }

  console.log('commerce policies verification passed');
}

function checkRegulatory() {
  const accessibility = read('app/accessibility/page.tsx');
  const affiliate = read('app/affiliate-disclosure/page.tsx');
  const dmca = read('app/dmca/page.tsx');

  const accessTerms = ['WCAG 2.1', 'Level AA', 'EN 301 549', 'Screen reader', 'Feedback'];
  for (const term of accessTerms) {
    if (!accessibility.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`Accessibility statement missing required topic: "${term}"`);
    }
  }

  const affiliateTerms = ['FTC', '16 CFR Part 255', 'Commission', 'Referral'];
  for (const term of affiliateTerms) {
    if (!affiliate.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`Affiliate disclosure missing required topic: "${term}"`);
    }
  }

  const dmcaTerms = ['17 U.S.C. § 512', 'Designated Agent', 'Takedown', 'Counter-Notice', 'Repeat Infringer'];
  for (const term of dmcaTerms) {
    if (!dmca.toLowerCase().includes(term.toLowerCase())) {
      throw new Error(`DMCA policy missing required topic: "${term}"`);
    }
  }

  console.log('regulatory compliance verification passed');
}

function checkFooter() {
  const footer = read('app/components/landing/SiteFooter.tsx');
  const content = read('app/components/landing/content.ts');

  // Verify no dead # links for legal policies
  const expectedRoutes = ['/privacy', '/terms', '/refund', '/cookies', '/delivery', '/accessibility'];
  for (const r of expectedRoutes) {
    if (!content.includes(`'${r}'`) && !content.includes(`"${r}"`)) {
      throw new Error(`Footer content is missing link to ${r}`);
    }
  }

  if (content.includes(`href: "#", label: "Privacy policy"`) || content.includes(`href: '#', label: 'Privacy policy'`)) {
    throw new Error('Footer content still contains dead hash link for Privacy policy');
  }

  console.log('footer navigation verification passed');
}

function checkDesignSystem() {
  const scannedPaths = [
    'app/components/legal/LegalPageShell.tsx',
    'app/components/legal/CookieConsent.tsx',
    'app/privacy/page.tsx',
    'app/terms/page.tsx',
    'app/cookies/page.tsx',
    'app/refund/page.tsx',
    'app/delivery/page.tsx',
    'app/accessibility/page.tsx',
    'app/affiliate-disclosure/page.tsx',
    'app/dmca/page.tsx',
  ];

  for (const p of scannedPaths) {
    const text = read(p);
    // Disallow raw <div> and <span layout according to CLAUDE.md:
    // "No <div>  components do all layout/spacing, page frame included."
    const divMatch = text.match(/<div[\s>]/g);
    if (divMatch) {
      throw new Error(`${p} violates CLAUDE.md: raw <div> found (${divMatch.length} occurrences). Use Astryx components (VStack, HStack, Grid, etc.)`);
    }
    // Check for hardcoded arbitrary hex or px values like bg-[#...] or p-[12px]
    const arbitraryStyleMatch = text.match(/(bg|text|p|m|gap|border)-\[[^\]]+\]/g);
    if (arbitraryStyleMatch) {
      throw new Error(`${p} violates token rules: arbitrary styles found: ${arbitraryStyleMatch.join(', ')}`);
    }
  }

  console.log('design system compliance verification passed');
}

function checkBrandingConfig() {
  const scannedPaths = [
    'app/components/legal/LegalPageShell.tsx',
    'app/components/legal/CookieConsent.tsx',
    'app/privacy/page.tsx',
    'app/terms/page.tsx',
    'app/cookies/page.tsx',
    'app/refund/page.tsx',
    'app/delivery/page.tsx',
    'app/accessibility/page.tsx',
    'app/affiliate-disclosure/page.tsx',
    'app/dmca/page.tsx',
  ];

  for (const p of scannedPaths) {
    const text = read(p);
    if (!text.includes("import { siteConfig } from '@/lib/config'") && !text.includes('import { siteConfig }')) {
      throw new Error(`${p} must import siteConfig from @/lib/config for centralized branding values`);
    }
    // Verify no hardcoded email addresses with @pkd-smm.panel
    if (text.includes('@pkd-smm.panel')) {
      throw new Error(`${p} contains hardcoded email string '@pkd-smm.panel'. Sourced values must come from siteConfig.email.* or siteConfig.domain`);
    }
  }

  console.log('branding config verification passed');
}

const arg = process.argv[2] || '--all';

try {
  switch (arg) {
    case '--check-routes':
      checkRoutes();
      break;
    case '--check-privacy':
      checkPrivacy();
      break;
    case '--check-terms':
      checkTerms();
      break;
    case '--check-cookies':
      checkCookies();
      break;
    case '--check-commerce':
      checkCommerce();
      break;
    case '--check-regulatory':
      checkRegulatory();
      break;
    case '--check-footer':
      checkFooter();
      break;
    case '--check-design-system':
      checkDesignSystem();
      break;
    case '--check-branding':
      checkBrandingConfig();
      break;
    case '--all':
      checkRoutes();
      checkPrivacy();
      checkTerms();
      checkCookies();
      checkCommerce();
      checkRegulatory();
      checkFooter();
      checkDesignSystem();
      checkBrandingConfig();
      console.log('all legal gates verification passed');
      break;
    default:
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
  }
} catch (err) {
  console.error(`Verification error: ${err.message}`);
  process.exit(1);
}
