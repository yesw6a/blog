import path from 'path';

import type { NextConfig } from 'next';

import withStylexTurbopack from '@stylexswc/nextjs-plugin/turbopack';

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactStrictMode: process.env.NODE_ENV === 'production',
  transpilePackages: ['next-mdx-remote'],
  images: {
    // images.domains 自 Next 15 起废弃、Next 16 仍接受但会告警，改用显式 remotePatterns。
    // steam 图片实际经 https://wsrv.nl/?url=... 中转，media.steampowered.com 作为原始来源保留。
    remotePatterns: [
      { protocol: 'https', hostname: 'wsrv.nl' },
      { protocol: 'http', hostname: 'media.steampowered.com' },
      { protocol: 'https', hostname: 'media.steampowered.com' },
    ],
  },
};

export default withStylexTurbopack({
  rsOptions: {
    dev: process.env.NODE_ENV !== 'production',
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['src/app/api/**'],
    aliases: {
      '@/*': [path.join(process.cwd(), 'src/*')],
    },
    unstable_moduleResolution: {
      type: 'commonJS',
    },
  },
  stylexImports: ['@stylexjs/stylex'],
})(nextConfig);

import('@opennextjs/cloudflare').then((module) => module.initOpenNextCloudflareForDev());
