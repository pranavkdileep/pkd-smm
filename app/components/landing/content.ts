import { siteConfig } from '@/lib/config';

export const SITE = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  fromPrice: "₹0.02/1K",
};

export type PlatformId =
  | "instagram"
  | "telegram"
  | "tiktok"
  | "youtube"
  | "x"
  | "facebook";

export interface Platform {
  id: PlatformId;
  name: string;
}

export const PLATFORMS: Platform[] = [
  { id: "instagram", name: "Instagram" },
  { id: "telegram", name: "Telegram" },
  { id: "tiktok", name: "TikTok" },
  { id: "youtube", name: "YouTube" },
  { id: "x", name: "X" },
  { id: "facebook", name: "Facebook" },
];

/* Placeholder numbers  edit freely, they render straight to the page. */
export const STATS = [
  {
    label: "Orders Completed",
    value: "128,400+",
    note: "Delivered since launch",
    icon: "shield-check" as const,
    tint: "blue" as const,
  },
  {
    label: "Customers",
    value: "9,300+",
    note: "Individuals and teams",
    icon: "users" as const,
    tint: "purple" as const,
  },
  {
    label: "Services",
    value: "1,200+",
    note: "Across six platforms",
    icon: "list-checks" as const,
    tint: "green" as const,
  },
  {
    label: "Account Access",
    value: "No Passwords",
    note: "Public links only, ever",
    icon: "lock" as const,
    tint: "orange" as const,
  },
  {
    label: "Payments",
    value: "Cards, Crypto & UPI",
    note: "Instant balance credit",
    icon: "credit-card" as const,
    tint: "yellow" as const,
  },
];

export const HERO_BENEFITS = [
  { text: "Free test balance for new accounts", icon: "check-circle" as const, tint: "green" as const },
  { text: "Clear refund & refill policy", icon: "file-text" as const, tint: "blue" as const },
  { text: "24/7 live customer support", icon: "headphones" as const, tint: "purple" as const },
  { text: "Secure payments, cards, crypto, UPI", icon: "shield-check" as const, tint: "orange" as const },
  { text: "Transparent quality tiers", icon: "star" as const, tint: "pink" as const },
  { text: `From ${SITE.fromPrice} per order`, icon: "badge-indian-rupee" as const, tint: "cyan" as const },
];

export interface ServiceCard {
  platform: PlatformId;
  name: string;
  blurb: string;
  fromPrice: string;
}

export const SERVICES: ServiceCard[] = [
  { platform: "instagram", name: "Instagram Followers", blurb: "Real and premium tiers with refill windows up to 60 days.", fromPrice: "from ₹49/1K" },
  { platform: "instagram", name: "Instagram Likes", blurb: "Fast likes spread naturally across your posts.", fromPrice: "from ₹0.09/1K" },
  { platform: "instagram", name: "Reels Views", blurb: "Video views that push your reach on explore.", fromPrice: "from ₹0.05/1K" },
  { platform: "telegram", name: "Telegram Members", blurb: "Real, online and premium members for channels & groups.", fromPrice: "from ₹0.15/1K" },
  { platform: "telegram", name: "Post Views", blurb: "Views on every post with auto options for new drops.", fromPrice: "from ₹0.02/1K" },
  { platform: "telegram", name: "Emoji Reactions", blurb: "Any emoji you pick, premium set included.", fromPrice: "from ₹0.10/1K" },
  { platform: "tiktok", name: "TikTok Followers", blurb: "Followers that hold, with drip-feed pacing.", fromPrice: "from ₹0.30/1K" },
  { platform: "tiktok", name: "TikTok Views", blurb: "High-retention views for videos and lives.", fromPrice: "from ₹0.04/1K" },
  { platform: "youtube", name: "YouTube Subscribers", blurb: "Channel subs with gradual, safe delivery.", fromPrice: "from ₹4.50/1K" },
  { platform: "youtube", name: "YouTube Views", blurb: "Monetization-safe views with watch time.", fromPrice: "from ₹0.60/1K" },
  { platform: "x", name: "X Followers", blurb: "Grow a credible audience around your handle.", fromPrice: "from ₹1.20/1K" },
  { platform: "x", name: "X Impressions", blurb: "Push posts into more feeds and searches.", fromPrice: "from ₹0.08/1K" },
  { platform: "facebook", name: "Facebook Page Likes", blurb: "Page likes that strengthen social proof.", fromPrice: "from ₹0.80/1K" },
  { platform: "facebook", name: "Facebook Video Views", blurb: "Views for reels and native video posts.", fromPrice: "from ₹0.12/1K" },
];

export const FREE_SERVICES = [
  "Free Instagram Likes",
  "Free Telegram Members",
  "Free TikTok Views",
  "Free YouTube Views",
];

export interface PricingRow {
  service: string;
  rate: string;
  quantity: string;
  guarantee: string;
}

export const PRICING: Record<PlatformId, PricingRow[]> = {
  instagram: [
    { service: "Real Followers", rate: "₹0.49 / 1K", quantity: "100 – 100,000", guarantee: "30-day refill" },
    { service: "Premium Followers", rate: "₹1.20 / 1K", quantity: "100 – 50,000", guarantee: "60-day refill" },
    { service: "Post Likes", rate: "₹0.09 / 1K", quantity: "50 – 50,000", guarantee: "Lifetime guarantee" },
    { service: "Reels Views", rate: "₹0.05 / 1K", quantity: "500 – 1,000,000", guarantee: "Delivery in 24h" },
    { service: "Story Views", rate: "₹0.15 / 1K", quantity: "100 – 50,000", guarantee: "Delivery before expiry" },
  ],
  telegram: [
    { service: "Real Members", rate: "₹0.15 / 1K", quantity: "500 – 50,000", guarantee: "30-day refill" },
    { service: "Online Members", rate: "₹0.35 / 1K", quantity: "500 – 20,000", guarantee: "7-day refill" },
    { service: "Post Views", rate: "₹0.02 / 1K", quantity: "500 – 25,000", guarantee: "365-day refill" },
    { service: "Emoji Reactions", rate: "₹0.10 / 1K", quantity: "100 – 25,000", guarantee: "1-year guarantee" },
    { service: "Comments", rate: "₹1.00 / 1K", quantity: "10 – 2,500", guarantee: "Custom or smart random" },
  ],
  tiktok: [
    { service: "Followers", rate: "₹0.30 / 1K", quantity: "100 – 100,000", guarantee: "30-day refill" },
    { service: "Likes", rate: "₹0.06 / 1K", quantity: "100 – 250,000", guarantee: "Lifetime guarantee" },
    { service: "Video Views", rate: "₹0.04 / 1K", quantity: "1,000 – 5,000,000", guarantee: "Delivery in 12h" },
    { service: "Live Stream Views", rate: "₹0.90 / 1K", quantity: "50 – 20,000", guarantee: "Live-minute based" },
  ],
  youtube: [
    { service: "Subscribers", rate: "₹4.50 / 1K", quantity: "50 – 20,000", guarantee: "60-day refill" },
    { service: "Views", rate: "₹0.60 / 1K", quantity: "1,000 – 500,000", guarantee: "Monetization-safe" },
    { service: "Likes", rate: "₹0.40 / 1K", quantity: "50 – 50,000", guarantee: "Lifetime guarantee" },
    { service: "Watch Hours", rate: "₹8.00 / 1K hrs", quantity: "1,000 – 4,000 hrs", guarantee: "Gradual delivery" },
  ],
  x: [
    { service: "Followers", rate: "₹1.20 / 1K", quantity: "100 – 50,000", guarantee: "30-day refill" },
    { service: "Likes", rate: "₹0.25 / 1K", quantity: "50 – 50,000", guarantee: "Lifetime guarantee" },
    { service: "Reposts", rate: "₹0.45 / 1K", quantity: "50 – 25,000", guarantee: "Lifetime guarantee" },
    { service: "Impressions", rate: "₹0.08 / 1K", quantity: "1,000 – 1,000,000", guarantee: "Delivery in 24h" },
  ],
  facebook: [
    { service: "Page Likes", rate: "₹0.80 / 1K", quantity: "100 – 50,000", guarantee: "30-day refill" },
    { service: "Page Followers", rate: "₹0.55 / 1K", quantity: "100 – 100,000", guarantee: "30-day refill" },
    { service: "Post Likes", rate: "₹0.10 / 1K", quantity: "50 – 50,000", guarantee: "Lifetime guarantee" },
    { service: "Video Views", rate: "₹0.12 / 1K", quantity: "1,000 – 500,000", guarantee: "3-second+ retention" },
  ],
};

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your free account",
    body: "Sign up with an email in under a minute. No contracts, no minimum deposits  the dashboard is open the moment you confirm.",
  },
  {
    step: "02",
    title: "Add funds your way",
    body: "Top up by card through Stripe or Checkout, or pay with crypto. Balances are credited instantly so you can order right away.",
  },
  {
    step: "03",
    title: "Place your first order",
    body: "Pick a platform and service, paste the public link, choose a quantity, and review the total before you submit.",
  },
  {
    step: "04",
    title: "Track results live",
    body: "Follow start counts and completion from the orders page. Refill-eligible services restore drops free inside their window.",
  },
];

export const PAYMENTS = [
  { name: "Visa", detail: "Card payment" },
  { name: "Mastercard", detail: "Card payment" },
  { name: "Stripe", detail: "Secure card flow" },
  { name: "PayPal", detail: "Wallet payments" },
  { name: "Binance Pay", detail: "Instant crypto" },
  { name: "Crypto", detail: "BTC · USDT · ETH" },
];

export const FEATURE_TABS = [
  {
    id: "teams",
    label: "Teams & Collaboration",
    headline: "Built for marketing teams",
    body: "Run every client brand from one balance. Shared wallets, separate order history per brand, and exportable reports keep campaigns tidy without spreadsheets.",
    points: ["Shared team balance", "Per-brand order history", "Exportable receipts"],
  },
  {
    id: "payments",
    label: "Payments & Bonuses",
    headline: "Pay your way",
    body: "Cards run through Stripe and Checkout, crypto through Binance Pay and direct wallet transfers. Every payment credits your balance instantly.",
    points: ["Cards & crypto accepted", "Instant balance credit", "Invoices for teams"],
  },
  {
    id: "mobile",
    label: "Works Everywhere",
    headline: "The panel in your pocket",
    body: "The dashboard is built mobile-first: check statuses, top up, and place repeat orders from any device  no app install required.",
    points: ["Mobile-first dashboard", "One-tap reorder", "No app needed"],
  },
  {
    id: "security",
    label: "Security & Privacy",
    headline: "Public links only, passwords never",
    body: "No service asks for your account password or login session. Orders run on public links, refund rules are written before you pay, and terms are shown on every service.",
    points: ["No passwords, ever", "Written refund policy", "Terms shown pre-order"],
  },
] as const;

export const REVIEWS = [
  {
    name: "Aiden M.",
    role: "Content creator",
    initials: "A",
    text: "The service notes are clear before ordering. I can pick the right tier instead of guessing and hoping it works.",
  },
  {
    name: "Marina K.",
    role: "Agency user",
    initials: "M",
    text: "Easy to reuse across client brands. I add balance, pick the service, paste the link, and track it all from the dashboard.",
  },
  {
    name: "Owen R.",
    role: "Community admin",
    initials: "O",
    text: "Support helped me understand which service made sense before I ordered. That saved me from choosing the wrong one.",
  },
  {
    name: "Daniel S.",
    role: "Campaign buyer",
    initials: "D",
    text: "Refill details, order status, and support replies make the whole process feel controlled. I always know where an order stands.",
  },
  {
    name: "Sofia L.",
    role: "Small business owner",
    initials: "S",
    text: "Prices are genuinely affordable and delivery starts fast. My page finally looks as active as it actually is.",
  },
  {
    name: "Priya R.",
    role: "Marketing lead",
    initials: "P",
    text: "We manage six brand accounts here. One balance, clear history per brand, and invoices our finance team accepts.",
  },
];

export const FAQS = [
  {
    q: "What is an SMM panel used for?",
    a: "Ordering social media growth services  followers, likes, views, reactions and comments  from one dashboard with one balance. Each service has its own page describing tiers, prices, and guarantees.",
  },
  {
    q: `Which platforms does ${siteConfig.name} support?`,
    a: "Six platforms: Instagram, Telegram, TikTok, YouTube, X (Twitter), and Facebook. You are never locked into one network  mix services wherever your audience lives.",
  },
  {
    q: "Do you need my account password?",
    a: "Never, on any platform. Orders run on public profile, post, and video links only. Your logins stay yours.",
  },
  {
    q: "How do payments work?",
    a: "Add balance by card through Stripe or Checkout, or with crypto through Binance Pay and wallet transfers. Orders then spend from your balance instantly.",
  },
  {
    q: "What happens if a service drops?",
    a: "Every service states its refill or guarantee terms before you order  from 7-day windows up to lifetime coverage  and drops inside the window are restored free.",
  },
  {
    q: "Is there a way to test before paying?",
    a: "Yes. Free services let you try real delivery at zero cost, and new accounts get a small test balance for paid services.",
  },
  {
    q: "Can marketing teams manage multiple brands?",
    a: `That's what ${siteConfig.shortName} is built for. Use one shared balance across brands, keep per-brand order history, and export receipts for accounting.`,
  },
  {
    q: "How fast do orders start?",
    a: "Most services begin within minutes of submission; larger quantities deliver gradually to stay natural. The estimated start time shows on each service before you pay.",
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "All services", href: "/services" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "About us", href: "/#about" },
      { label: "Contact", href: "/#faq" },
    ],
  },
  {
    heading: "Legal & Compliance",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Cookie policy", href: "/cookies" },
      { label: "Refund policy", href: "/refund" },
      { label: "Delivery policy", href: "/delivery" },
    ],
  },
  {
    heading: "Policies & Standards",
    links: [
      { label: "Accessibility statement", href: "/accessibility" },
      { label: "Affiliate disclosure", href: "/affiliate-disclosure" },
      { label: "DMCA copyright", href: "/dmca" },
    ],
  },
];
