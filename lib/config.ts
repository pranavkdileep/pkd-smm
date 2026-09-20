/**
 * Application branding and configuration.
 * Central source of truth for site name, metadata, navigation, and brand assets.
 */

export const siteConfig = {
  name: 'PKD-SMM Panel',
  shortName: 'PKD-SMM',
  brandInitials: 'PKD',
  tagline: 'Affordable social media boost platform for individuals and marketing teams',
  description:
    'Affordable SMM panel for individuals and marketing teams. Boost Instagram, Telegram, TikTok, YouTube, X and Facebook from one dashboard with live tracking.',
  title: 'PKD-SMM Panel  Affordable Social Media Boost Platform',
  domain: 'pkd-smm.panel',
  adminName: 'PKD-SMM Admin',
  nav: {
    mainAriaLabel: 'PKD-SMM Panel main navigation',
  },
  email: {
    defaultFrom: 'PKD-SMM Panel <onboarding@resend.dev>',
    verificationSubject: 'Verify your PKD-SMM Panel account',
  },
  auth: {
    sessionCookie: 'pkd_session',
  },
  database: {
    defaultDbName: 'pkd-smm',
  },
} as const;

export default siteConfig;
