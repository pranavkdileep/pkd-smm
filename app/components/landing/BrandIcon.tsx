'use client';

import type {SVGProps} from 'react';
import {Icon} from '@astryxdesign/core/Icon';

type SvgProps = SVGProps<SVGSVGElement>;

function InstagramIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TelegramIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.9 4.6 19 19.3c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6L18.8 7c.4-.3-.1-.5-.6-.2L7.9 13.2 3.5 11.8c-1-.3-1-1 .2-1.5l16.8-6.5c.8-.3 1.5.2 1.4.8Z" />
    </svg>
  );
}

function TikTokIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 3c.3 2.1 1.6 3.4 3.9 3.5v2.6c-1.4.1-2.7-.3-3.9-1.1v5.7c0 4.3-3.5 6.1-6.1 5.2-2.5-.9-3.8-3.5-3.1-6 .6-2.2 2.7-3.6 5-3.4v2.7c-1.2-.2-2.3.3-2.7 1.4-.5 1.4.4 2.9 1.9 3.1 1.4.2 2.6-.8 2.6-2.5V3h2.4Z" />
    </svg>
  );
}

function YoutubeIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function XIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.1h1.7L7.6 4.8H5.8l10.9 14.3Z" />
    </svg>
  );
}

function FacebookIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const BRAND_ICONS = {
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  tiktok: TikTokIcon,
  youtube: YoutubeIcon,
  x: XIcon,
  facebook: FacebookIcon,
} as const;

export type PlatformKey = keyof typeof BRAND_ICONS;

export interface BrandIconProps {
  platform: PlatformKey;
  size?: React.ComponentProps<typeof Icon>['size'];
  className?: string;
}

/** Renders a platform logo through Astryx Icon so color tokens apply. */
export function BrandIcon({platform, size = 'sm', className}: BrandIconProps) {
  const Svg = BRAND_ICONS[platform];
  return <Icon icon={Svg} size={size} className={className} />;
}
