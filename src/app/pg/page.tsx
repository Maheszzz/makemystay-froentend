import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(listingsPageSeo({
    pathname: '/pg',
    pageTitle: 'PGs in Bangalore',
    pageSubtitle: 'Paying guest stays and coliving spaces in Bangalore',
    category: 'pg',
    cityLabel: 'Bangalore',
}));

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { items: initialProperties, total, propertyCounts } = await fetchPropertiesServer({
        category: 'pg',
        city: 'bangalore',
        is_available: true,
        limit: 24,
        sort_by: 'newest',
    });

    return (
        <Properties
            key="pg"
            initialCategory="pg"
            initialCity="Bangalore"
            pageTitle="PGs in Bangalore"
            pageSubtitle="Paying guest stays and coliving spaces across Bangalore, ordered cleanly by what matters."
            initialProperties={initialProperties}
            initialTotalCount={total}
            initialPropertyCounts={propertyCounts}
        />
    );
}
