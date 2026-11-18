import type { Metadata } from 'next';
import ForOwners from '@/views/ForOwners';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
    title: `For PG & Property Owners | ${SITE_NAME}`,
    description:
        'List your PG, coliving space, or rental flats on MakeMyStay.ai. Get direct tenant inquiries, verified listing pages, and visit scheduling without broker commissions.',
    alternates: {
        canonical: `${SITE_URL}/for-owners`,
    },
};

export default function ForOwnersPage() {
    return <ForOwners />;
}
