import type { Metadata } from 'next';
import { resolvePgSlugMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgSlugMetadata(slug);
}

export const dynamic = 'force-dynamic';

import PgSlugRoute from '@/routes/PgSlugRoute';
import PGLocationPage from '@/views/PGLocationPage';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const param = (slug || '').toLowerCase();

    // Map properties, hubs, and features to the client-side PgSlugRoute
    if (/^(\d+)(-|$)/.test(param) || 
        ['bangalore', 'hyderabad', 'pune'].includes(param) ||
        ['pg-with-wifi', 'pg-with-food', 'pg-with-ac'].includes(param) ||
        param === 'pg-vs-flat-bangalore') {
        return <PgSlugRoute />;
    }

    // Map locality pages to the server-side PGLocationPage
    return <PGLocationPage slug={param} />;
}
