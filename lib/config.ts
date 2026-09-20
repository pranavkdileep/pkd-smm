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
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pkd-smm.com',
  adminName: 'PKD-SMM Admin',
  nav: {
    mainAriaLabel: 'PKD-SMM Panel main navigation',
  },
  email: {
    defaultFrom: 'PKD-SMM Panel <onboarding@resend.dev>',
    verificationSubject: 'Verify your PKD-SMM Panel account',
    support: 'support@pkd-smm.panel',
    privacy: 'privacy@pkd-smm.panel',
    dmca: 'dmca@pkd-smm.panel',
    accessibility: 'accessibility@pkd-smm.panel',
    affiliates: 'affiliates@pkd-smm.panel',
  },
  seo: {
    title: 'PKD-SMM Panel – Affordable Social Media Boost Platform',
    titleTemplate: '%s | PKD-SMM Panel',
    defaultDescription:
      'Affordable SMM panel for creators, agencies, and marketing teams. Boost Instagram followers, Telegram members, TikTok views, YouTube watch hours, and X engagement with instant start and refill guarantee.',
    keywords: [
      'SMM panel',
      'social media marketing panel',
      'buy Instagram followers',
      'buy Instagram likes',
      'buy Telegram members',
      'buy TikTok views',
      'buy TikTok followers',
      'buy YouTube views',
      'buy YouTube subscribers',
      'buy YouTube watch hours',
      'buy X followers',
      'buy Twitter retweets',
      'buy Facebook page likes',
      'cheap SMM panel',
      'social media growth service',
      'instant SMM panel',
      'SMM reseller panel',
      'PKD SMM',
    ] as const,
    openGraph: {
      type: 'website' as const,
      locale: 'en_US' as const,
      siteName: 'PKD-SMM Panel',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'PKD-SMM Panel – Affordable Social Media Boost Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      handle: '@pkdsmm',
      creator: '@pkdsmm',
    },
    rating: {
      ratingValue: '4.9',
      reviewCount: '9340',
      bestRating: '5',
      worstRating: '1',
    },
    services: {
      title: 'Social Media Marketing Services & Pricing Catalog',
      description:
        'Explore our complete catalog of verified social media growth services. Instant delivery, competitive rates from ₹0.02/1K, and refill guarantees across six networks.',
      keywords: [
        'SMM services list',
        'social media service pricing',
        'buy social media engagement',
        'SMM panel pricing table',
        'bulk social media marketing',
      ] as const,
    },
    platforms: {
      instagram: {
        name: 'Instagram',
        title: 'Buy Instagram Followers, Likes, Views & Comments',
        eyebrow: 'Instagram Growth Services',
        description:
          'Boost your Instagram presence safely with real & premium followers, high-retention reels views, and fast post likes. Instant delivery with up to 60-day refill guarantee.',
        keywords: [
          'buy Instagram followers',
          'buy Instagram likes',
          'Instagram reels views',
          'buy Instagram comments',
          'cheap Instagram followers',
          'Instagram growth panel',
        ] as const,
        heroBadge: 'Top-rated Instagram SMM Panel',
        summary:
          'Grow your Instagram presence organically with high-retention followers, genuine post likes, and explore-boosting reels views. All services are delivered via public profile and post links with zero password requirements and transparent refill protection.',
      },
      telegram: {
        name: 'Telegram',
        title: 'Buy Telegram Members, Post Views & Emoji Reactions',
        eyebrow: 'Telegram Growth Services',
        description:
          'Scale your Telegram channels and supergroups with real and online members, automatic post views, and custom emoji reactions. Instant start with 365-day refill options.',
        keywords: [
          'buy Telegram members',
          'Telegram channel members',
          'buy Telegram post views',
          'Telegram emoji reactions',
          'cheap Telegram members',
          'Telegram group boost',
        ] as const,
        heroBadge: 'Fast Telegram Channel Booster',
        summary:
          'Attract active readers and build social credibility for your crypto, news, or community channels with verified real and online members, high-frequency post views, and interactive reactions.',
      },
      tiktok: {
        name: 'TikTok',
        title: 'Buy TikTok Followers, Likes, Video Views & Shares',
        eyebrow: 'TikTok Viral Services',
        description:
          'Accelerate TikTok viral reach with high-retention video views, authentic likes, and drip-feed followers. Safe, fast, algorithm-friendly, and refill protected.',
        keywords: [
          'buy TikTok followers',
          'buy TikTok views',
          'buy TikTok likes',
          'TikTok FYP boost',
          'cheap TikTok followers',
          'TikTok live stream views',
        ] as const,
        heroBadge: 'Viral TikTok Marketing',
        summary:
          'Feed the TikTok For You Page algorithm with steady watch-time retention, profile followers, and organic-paced post likes designed to enhance discovery and creator monetization.',
      },
      youtube: {
        name: 'YouTube',
        title: 'Buy YouTube Views, Subscribers, Likes & Watch Hours',
        eyebrow: 'YouTube Growth Services',
        description:
          'Monetization-safe YouTube views, gradual channel subscribers, and 4,000 watch hours packages. Compliant delivery with 60-day refill guarantee.',
        keywords: [
          'buy YouTube views',
          'buy YouTube subscribers',
          'buy YouTube watch hours',
          'YouTube monetization packages',
          'high retention YouTube views',
          'cheap YouTube panel',
        ] as const,
        heroBadge: 'Monetization-Safe YouTube Services',
        summary:
          'Qualify for the YouTube Partner Program faster and boost video search rankings with gradual, natural-pacing subscribers, high-retention views, and full 4,000 watch hour acceleration.',
      },
      x: {
        name: 'X (Twitter)',
        title: 'Buy X (Twitter) Followers, Likes, Reposts & Impressions',
        eyebrow: 'X (Twitter) Growth Services',
        description:
          'Build executive authority and social proof on X with targeted handle followers, high-engagement reposts, and tweet impression boosts delivered to public links.',
        keywords: [
          'buy X followers',
          'buy Twitter followers',
          'buy X reposts',
          'buy Twitter retweets',
          'buy X impressions',
          'cheap Twitter SMM',
        ] as const,
        heroBadge: 'High-Impact X (Twitter) Promotion',
        summary:
          'Establish thought leadership and amplify your message across X feeds. Boost tweet reach, bookmark counts, quote reposts, and handle followers safely without risk to your account.',
      },
      facebook: {
        name: 'Facebook',
        title: 'Buy Facebook Page Likes, Followers & Video Views',
        eyebrow: 'Facebook Marketing Services',
        description:
          'Strengthen business trust on Facebook with active page likes, profile followers, and high-retention video views. Safe delivery with lifetime refill options.',
        keywords: [
          'buy Facebook page likes',
          'buy Facebook followers',
          'Facebook reels views',
          'Facebook post likes',
          'cheap Facebook panel',
          'Facebook business page boost',
        ] as const,
        heroBadge: 'Trusted Facebook Growth',
        summary:
          'Enhance brand legitimacy and reach potential customers on Facebook. Boost business page followers, event interest, and native video watch time with reliable, refill-backed orders.',
      },
    },
  },
  auth: {
    sessionCookie: 'pkd_session',
  },
  database: {
    defaultDbName: 'pkd-smm',
  },
  legal: {
    companyName: 'PKD-SMM Panel',
    cookieConsentKey: 'pkd_cookie_consent_v1',
    eventCookieSettings: 'pkd:open-cookie-settings',
    affiliateCookieKey: 'pkd_ref_id',
    effectiveDate: 'September 20, 2026',
  },
} as const;

export default siteConfig;
