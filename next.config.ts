import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: '**.amazonaws.com' },
        ],
    },
    async redirects() {
        return [
            { source: '/pg-in-bangalore', destination: '/pg/bangalore', permanent: true },
            { source: '/buy/bangalore', destination: '/buy/in/bangalore', permanent: true },
            { source: '/plot/bangalore', destination: '/plots/in/bangalore', permanent: true },
            { source: '/properties', has: [{ type: 'query', key: 'cat', value: 'pg' }], destination: '/pg/bangalore', permanent: true },
            { source: '/rent-in-whitefield', destination: '/rent/whitefield', permanent: true },
            { source: '/rent-in-marathahalli', destination: '/rent/marathahalli', permanent: true },
            { source: '/rent-in-btm-layout', destination: '/rent/btm', permanent: true },
            { source: '/rent-in-electronic-city', destination: '/rent/electronic-city', permanent: true },
            { source: '/rent-in-indiranagar', destination: '/rent/indiranagar', permanent: true },
            { source: '/rent-in-koramangala', destination: '/rent/koramangala', permanent: true },
            { source: '/rent-in-hsr-layout', destination: '/rent/hsr-layout', permanent: true },
            { source: '/rent-in-bellandur', destination: '/rent/bellandur', permanent: true },
            { source: '/rent-in-sarjapur-road', destination: '/rent/sarjapur-road', permanent: true },
            { source: '/rent-in-hebbal', destination: '/rent/hebbal', permanent: true },
            { source: '/rent-in-jp-nagar', destination: '/rent/jp-nagar', permanent: true },
            { source: '/rent-in-bannerghatta-road', destination: '/rent/bannerghatta-road', permanent: true },
            { source: '/properties/id/:id', destination: '/properties/:id', permanent: true },
            { source: '/properties/:type/:slug', destination: '/properties/:slug', permanent: true },
        ];
    },
    async rewrites() {
        return [
            { source: '/api/:path*', destination: 'http://127.0.0.1:8000/api/:path*' },
        ];
    },
};

export default nextConfig;
