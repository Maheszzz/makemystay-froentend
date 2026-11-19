import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    distDir: process.env.NEXT_DIST_DIR || '.next',
    output: 'standalone',
    reactStrictMode: true,
    experimental: {
        scrollRestoration: true,
    },
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: false },
    images: {
        formats: ['image/avif', 'image/webp'],
        qualities: [55, 60, 75, 85],
        deviceSizes: [640, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: '**.amazonaws.com' },
        ],
    },
    async headers() {
        return [
            {
                source: '/_next/static/:path*',
                headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
            },
            {
                source: '/manifest.json',
                headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
            },
            {
                source: '/sitemap(.*).xml',
                headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/images/blog/hero-sunset.jpg',
                destination: '/images/blog/hero-sunset.webp',
                permanent: true,
            },
            { source: '/hsr-layout-vs-koramangala', destination: '/compare/hsr-layout-vs-koramangala', permanent: true },
            { source: '/hsr-layout-vs-bellandur', destination: '/compare/hsr-layout-vs-bellandur', permanent: true },
            { source: '/whitefield-vs-marathahalli', destination: '/compare/whitefield-vs-marathahalli', permanent: true },
            { source: '/koramangala-vs-indiranagar', destination: '/compare/koramangala-vs-indiranagar', permanent: true },
            { source: '/buy/bangalore', destination: '/buy/in/bangalore', permanent: true },
            { source: '/plot/bangalore', destination: '/plots/in/bangalore', permanent: true },
            { source: '/properties/id/:id', destination: '/properties/:id', permanent: true },
        ];
    },
    async rewrites() {
        return [
            { source: '/api/v1/:path*', destination: 'http://127.0.0.1:8000/api/v1/:path*' },
        ];
    },
};

export default withBundleAnalyzer(nextConfig);
