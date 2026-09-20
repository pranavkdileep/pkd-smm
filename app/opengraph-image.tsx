import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const alt = `${siteConfig.name} – Affordable Social Media Boost Platform`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: '#0b0f19',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Header with Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            }}
          >
            {siteConfig.brandInitials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {siteConfig.name}
            </span>
            <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 500 }}>
              {siteConfig.domain}
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '54px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#f8fafc',
            }}
          >
            Boost Every Social Platform From One Unified Panel
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '22px',
              lineHeight: 1.4,
              color: '#cbd5e1',
              fontWeight: 400,
            }}
          >
            Real followers, views, likes & engagement for Instagram, Telegram, TikTok, YouTube, X, and Facebook. Transparent pricing, instant delivery & refill guarantees.
          </div>
        </div>

        {/* Footer badges and platforms */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Instagram', 'Telegram', 'TikTok', 'YouTube', 'X (Twitter)', 'Facebook'].map((p) => (
              <div
                key={p}
                style={{
                  display: 'flex',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#93c5fd',
                }}
              >
                {p}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              color: '#38bdf8',
              fontWeight: 700,
            }}
          >
            <span>★ 4.9 / 5 Rating</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span>128K+ Orders</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
