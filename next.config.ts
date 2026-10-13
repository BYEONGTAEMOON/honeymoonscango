import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: false,
    images: {
        // Admin-entered resort photo URLs can point at any HTTPS host, not just
        // picsum.photos — this is a single-admin CMS, so the tradeoff is fine.
        remotePatterns: [{ protocol: 'https', hostname: '**' }],
        // Default is 4h. Resort photos get replaced on banhanatour.kr under the
        // same filename, and there's no way to purge the optimizer cache, so a
        // short TTL is what lets swapped images show up within about a minute.
        minimumCacheTTL: 60,
    },
};

export default nextConfig;
