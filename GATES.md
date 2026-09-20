# Gates: Update Branding to Social Geeks SMM

OWNS: lib/config.ts, app/services/page.tsx, scripts/verify-legal-pages.mjs, scripts/verify-branding.mjs, README.md, env.example, package.json

Scope: Update site branding, domain, names, and references to Social Geeks SMM and socialgeeksmm.com while keeping db name pkd-smm.

- [ ] G1: Central siteConfig in lib/config.ts reflects Social Geeks SMM and socialgeeksmm.com
  CHECK: node scripts/verify-branding.mjs --check-config
  EXPECT: branding config verification passed
  EVIDENCE: pending

- [ ] G2: Verification of legal and compliance pages passes
  CHECK: node scripts/verify-legal-pages.mjs
  EXPECT: all legal gates verification passed
  EVIDENCE: pending

- [ ] G3: No stale public-facing PKD-SMM branding references in app/ or lib/
  CHECK: node scripts/verify-branding.mjs --check-clean
  EXPECT: branding clean verification passed
  EVIDENCE: pending
