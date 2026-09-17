import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: false,
    images: {
        // Admin-entered resort photo URLs can point at any HTTPS host, not just
        // picsum.photos — this is a single-admin CMS, so the tradeoff is fine.
        remotePatterns: [{ protocol: 'https', hostname: '**' }],
    },
};

export default nextConfig;
