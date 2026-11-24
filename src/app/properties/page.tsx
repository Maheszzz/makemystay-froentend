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
    const base = pageSeoToMetadata(listingsPageSeo({
        pathname: '/properties',
        pageTitle: 'Properties in Bangalore',
        pageSubtitle: 'PGs, flats for rent, homes to buy, and plots across Bangalore',
        category: 'all',
        cityLabel: 'Bangalore',
    }));
    return applyQueryNoindex(base, sp, '/properties');
}

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { items: initialProperties, total, propertyCounts } = await fetchPropertiesServer({
        city: 'bangalore',
        is_available: true,
        limit: 24,
        sort_by: 'newest',
    });

    return (
        <Properties
            key="all"
            initialCity="Bangalore"
            pageTitle="Properties in Bangalore"
            pageSubtitle="PGs, flats for rent, homes to buy, and plots across Bangalore."
            initialProperties={initialProperties}
            initialTotalCount={total}
            initialPropertyCounts={propertyCounts}
        />
    );
}
