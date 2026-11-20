import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { build1BhkLocalitySEO } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const loc = getPgLocationBySlug(slug);
    if (!loc) return {};
    return pageSeoToMetadata(build1BhkLocalitySEO(loc.name, loc.slug));
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const loc = getPgLocationBySlug(slug);
    if (!loc) notFound();

    let initialProperties;
    let total;
    let propertyCounts;
    try {
        const res = await fetchPropertiesServer({
            category: 'rent',
            city: loc.name,
            is_available: true,
            limit: 24,
            sort_by: 'newest',
        });
        initialProperties = res.items;
        total = res.total;
        propertyCounts = res.propertyCounts;
    } catch {
        // Client-side fallback
    }

    return (
        <Properties
            key={`1bhk-${loc.slug}`}
            initialCategory="rent"
            initialTypeFilter="1BHK"
            initialCity={loc.name}
            pageTitle={`1BHK in ${loc.name}`}
            pageSubtitle={`Verified 1BHK flats for rent in ${loc.name} — real photos, transparent rent, and instant visits.`}
            initialProperties={initialProperties}
            initialTotalCount={total}
            initialPropertyCounts={propertyCounts}
        />
    );
}
