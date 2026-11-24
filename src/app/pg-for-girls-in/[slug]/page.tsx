import type { Metadata } from 'next';
import { resolvePgGenderLocalityMetadata } from '@/lib/routeMetadata';
import { notFound } from 'next/navigation';
import { getPgLocationBySlug } from '@/data/pgLocations';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgGenderLocalityMetadata(slug, 'girls');
}

export const dynamic = 'force-dynamic';

import PgGenderLocalityPage from '@/views/PgGenderLocalityPage';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const param = (slug || '').toLowerCase();
    // Return a real 404 for unknown locality slugs — prevents soft 404 (200 redirect to hub)
    if (!getPgLocationBySlug(param)) {
        notFound();
    }
    return <PgGenderLocalityPage overrideSlug={param} />;
}
