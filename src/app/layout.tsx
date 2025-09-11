import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import AppLayout from '@/layouts/app-layout';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import './tailwind.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '我的博客',
  description: '基于 Next.js 构建的现代化博客应用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class">
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
