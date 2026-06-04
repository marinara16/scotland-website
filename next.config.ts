import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [
      // Never cache HTML pages — always fetch fresh from server
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      // Service worker
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

export default nextConfig;
