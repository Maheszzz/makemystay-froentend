import type { Metadata } from 'next';
import { resolvePgGenderLocalityMetadata } from '@/lib/routeMetadata';
import { applyQueryNoindex } from '@/lib/nextMetadata';
import { notFound } from 'next/navigation';
import { getPgLocationBySlug } from '@/data/pgLocations';

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const sp = searchParams ? await searchParams : undefined;
    const meta = await resolvePgGenderLocalityMetadata(slug, 'boys');
    return applyQueryNoindex(meta, sp);
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
    return <PgGenderLocalityPage overrideSlug={param} variant="boys" />;
}
