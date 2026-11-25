import type { Metadata } from 'next';
import ForOwners from '@/views/ForOwners';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
    title: { absolute: 'For PG & Property Owners | MakeMyStay' },
    description:
        'List your PG, coliving space or rental flats on MakeMyStay.ai. Get direct tenant inquiries and a verified listing page, with no broker commissions.',
    alternates: {
        canonical: `${SITE_URL}/for-owners`,
    },
};

export default function ForOwnersPage() {
    return <ForOwners />;
}
