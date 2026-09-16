import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: false,
    images: {
        remotePatterns: [new URL('https://picsum.photos/**')],
    },
};

export default nextConfig;
