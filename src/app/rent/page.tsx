import type { Metadata } from 'next';
import { applyQueryNoindex, pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

type PageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const sp = searchParams ? await searchParams : undefined;
    const base = pageSeoToMetadata(
        listingsPageSeo({
            pathname: '/rent',
            pageTitle: 'Flats for rent in Bangalore',
            pageSubtitle: 'Apartments and independent homes for rent across Bangalore',
            category: 'rent',
            cityLabel: 'Bangalore',
        }),
    );
    return applyQueryNoindex(base, sp, '/rent');
}

export const dynamic = 'force-dynamic';

export default async function Page() {
    const rentRes = await fetchPropertiesServer({
        category: 'rent',
        city: 'bangalore',
        is_available: true,
        limit: 24,
        sort_by: 'newest',
    });

    const fallbackRes =
        rentRes.items.length > 0
            ? rentRes
            : await fetchPropertiesServer({
                  city: 'bangalore',
                  is_available: true,
                  limit: 24,
                  sort_by: 'newest',
              });

    return (
        <Properties
            key="rent"
            initialCategory="rent"
            initialCity="Bangalore"
            pageTitle="Flats for rent in Bangalore"
            pageSubtitle="Flats and independent homes for rent across Bangalore — filter by area, BHK, and budget."
            initialProperties={fallbackRes.items}
            initialTotalCount={fallbackRes.total}
            initialPropertyCounts={fallbackRes.propertyCounts}
        />
    );
}
