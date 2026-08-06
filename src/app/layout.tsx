import type { Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/config/site';
import AppLayout from '@/layouts/app-layout';
import * as stylex from '@stylexjs/stylex';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
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
