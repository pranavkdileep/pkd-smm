#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { globSync } from 'node:fs';

const ROOT = process.cwd();

function read(relPath) {
  return readFileSync(resolve(ROOT, relPath), 'utf8');
}

function checkConfig() {
  const configText = read('lib/config.ts');

  if (!configText.includes("name: 'Social Geeks SMM Panel'") && !configText.includes("name: 'Social Geeks SMM'")) {
    throw new Error("lib/config.ts: 'name' must be 'Social Geeks SMM' or 'Social Geeks SMM Panel'");
  }
  if (!configText.includes("shortName: 'Social Geeks SMM'") && !configText.includes("shortName: 'Social Geeks'")) {
    throw new Error("lib/config.ts: 'shortName' must be 'Social Geeks SMM' or 'Social Geeks'");
  }
  if (!configText.includes("domain: 'socialgeeksmm.com'")) {
    throw new Error("lib/config.ts: 'domain' must be 'socialgeeksmm.com'");
  }
  if (!configText.includes('https://socialgeeksmm.com')) {
    throw new Error("lib/config.ts: 'siteUrl' must fallback to 'https://socialgeeksmm.com'");
  }
  if (!configText.includes("support: 'support@socialgeeksmm.com'")) {
    throw new Error("lib/config.ts: support email must be 'support@socialgeeksmm.com'");
  }
  if (!configText.includes("brandInitials: 'SG'")) {
    throw new Error("lib/config.ts: brandInitials must be 'SG'");
  }
  if (!configText.includes("handle: '@socialgeeksmm'")) {
    throw new Error("lib/config.ts: twitter handle must be '@socialgeeksmm'");
  }

  console.log('branding config verification passed');
}

function checkClean() {
  // Check that no user-facing files in app/ or lib/ contain stale PKD-SMM branding
  const filesToCheck = [
    'lib/config.ts',
    'app/layout.tsx',
    'app/opengraph-image.tsx',
    'app/components/landing/content.ts',
    'app/components/landing/SiteHeader.tsx',
    'app/components/landing/SiteFooter.tsx',
    'app/services/page.tsx',
    'app/privacy/page.tsx',
    'app/terms/page.tsx',
    'app/cookies/page.tsx',
    'app/refund/page.tsx',
    'app/delivery/page.tsx',
    'app/accessibility/page.tsx',
    'app/affiliate-disclosure/page.tsx',
    'app/dmca/page.tsx',
    'app/login/LoginForm.tsx',
    'app/signup/SignupForm.tsx',
  ];

  const stalePatterns = [
    /PKD-SMM Panel/i,
    /PKD-SMM Admin/i,
    /pkd-smm\.panel/i,
    /pkd-smm\.com/i,
    /@pkdsmm/i,
  ];

  for (const file of filesToCheck) {
    const content = read(file);
    for (const pattern of stalePatterns) {
      if (pattern.test(content)) {
        throw new Error(`${file} still contains stale branding matching ${pattern}`);
      }
    }
  }

  console.log('branding clean verification passed');
}

const arg = process.argv[2] || '--all';

try {
  switch (arg) {
    case '--check-config':
      checkConfig();
      break;
    case '--check-clean':
      checkClean();
      break;
    case '--all':
      checkConfig();
      checkClean();
      console.log('all branding gates verification passed');
      break;
    default:
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
  }
} catch (err) {
  console.error(`Verification error: ${err.message}`);
  process.exit(1);
}
