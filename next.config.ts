import path from 'path';

import type { NextConfig } from 'next';

import withStylexTurbopack from '@stylexswc/nextjs-plugin/turbopack';

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === 'production',
  images: {
    domains: ['media.steampowered.com', 'wsrv.nl'],
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
