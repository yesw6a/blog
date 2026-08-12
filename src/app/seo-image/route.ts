import { createElement } from 'react';

import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
  const image = createElement(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '72px 80px',
        background: 'linear-gradient(135deg, #09090b 0%, #111827 58%, #172554 100%)',
        color: '#f8fafc',
        fontFamily: 'Arial, sans-serif',
      },
    },
    createElement('div', {
      style: {
        position: 'absolute',
        top: '-220px',
        right: '-100px',
        width: '620px',
        height: '620px',
        border: '2px solid rgba(96, 165, 250, 0.28)',
        borderRadius: '50%',
      },
    }),
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '22px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: '#93c5fd',
        },
      },
      createElement('span', {
        style: {
          width: '48px',
          height: '4px',
          display: 'flex',
          background: '#60a5fa',
        },
      }),
      'PERSONAL TECHNOLOGY BLOG',
    ),
    createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: '88px',
            fontWeight: 700,
            letterSpacing: '-0.055em',
            lineHeight: 1,
          },
        },
        'Clovemu Blog',
      ),
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: '30px',
            color: '#cbd5e1',
            letterSpacing: '0.02em',
          },
        },
        'AI · Engineering · Essays',
      ),
    ),
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(148, 163, 184, 0.32)',
          paddingTop: '28px',
          fontSize: '22px',
          color: '#94a3b8',
        },
      },
      createElement(
        'span',
        { style: { display: 'flex' } },
        siteConfig.url.replace(/^https?:\/\//, ''),
      ),
      createElement('span', { style: { display: 'flex' } }, 'Ideas worth keeping.'),
    ),
  );

  return new ImageResponse(image, {
    width: 1200,
    height: 630,
  });
}
