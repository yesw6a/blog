import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === 'production',
  images: {
    domains: ['media.steampowered.com'],
  },
};

export default nextConfig;
