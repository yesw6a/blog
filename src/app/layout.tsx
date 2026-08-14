import type { Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import { absoluteUrl, rssFeedAlternates, siteConfig } from '@/config/site';
import AppLayout from '@/layouts/app-layout';
import * as stylex from '@stylexjs/stylex';

import './globals.css';

const defaultSeoImage = absoluteUrl('/seo-image.png');

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
    types: rssFeedAlternates,
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: 'zh_CN',
    images: [{ url: defaultSeoImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultSeoImage],
  },
};

const styles = stylex.create({
  body: {
    minHeight: '100dvh',
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body {...stylex.props(styles.body)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
