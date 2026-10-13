import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: false,
    images: {
        // Admin-entered resort photo URLs can point at any HTTPS host, not just
        // picsum.photos — this is a single-admin CMS, so the tradeoff is fine.
        remotePatterns: [{ protocol: 'https', hostname: '**' }],
        // Next's default is 4h; 1h is the lowest Vercel applies to remote images
        // (a smaller value is still served as max-age=3600). Photos replaced on
        // banhanatour.kr under the same filename can be refreshed immediately
        // with the "이미지 새로고침" button in /admin/content.
        minimumCacheTTL: 3600,
    },
};

export default nextConfig;
