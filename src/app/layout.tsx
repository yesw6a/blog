import type { Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import AppLayout from '@/layouts/app-layout';
import * as stylex from '@stylexjs/stylex';

import './globals.css';

export const metadata: Metadata = {
  title: '我的博客',
  description: '基于 Next.js 构建的现代化博客应用',
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
    <html suppressHydrationWarning>
      <body {...stylex.props(styles.body)}>
        <ThemeProvider attribute="class">
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
