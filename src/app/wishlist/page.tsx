import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Wishlist | MakeMyStay',
    robots: {
        index: false,
        follow: false,
    },
};

export const dynamic = 'force-dynamic';

export { default } from '@/views/Wishlist';
