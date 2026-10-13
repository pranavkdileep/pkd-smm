import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  // Matches --color-background-body in app/theme/source.ts.
  themeColor: '#f5f4f0',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.seo.title,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [...siteConfig.seo.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: siteConfig.seo.openGraph.type,
    locale: siteConfig.seo.openGraph.locale,
    url: siteConfig.siteUrl,
    siteName: siteConfig.seo.openGraph.siteName,
    title: siteConfig.seo.title,
    description: siteConfig.seo.defaultDescription,
    images: [...siteConfig.seo.openGraph.images],
  },
  twitter: {
    card: siteConfig.seo.twitter.card,
    title: siteConfig.seo.title,
    description: siteConfig.seo.defaultDescription,
    creator: siteConfig.seo.twitter.creator,
    site: siteConfig.seo.twitter.handle,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Server-render the theme scope so the warm canvas paints before
      // <Theme> hydrates and syncs these same attributes.
      data-astryx-theme="social-geeks"
      data-theme="light"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-body text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
