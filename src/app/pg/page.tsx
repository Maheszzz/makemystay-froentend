import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import { fetchCuratedPgPropertiesServer } from '@/lib/server/fetchPropertiesServer';
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
    const { items: initialProperties, total, propertyCounts } = await fetchCuratedPgPropertiesServer();

    return (
        <Properties
            key="pg"
            curatedPgOnly
            initialCategory="pg"
            initialCity="Bangalore"
            pageTitle="PGs in Bangalore"
            pageSubtitle="PGs and coliving homes across Bangalore — filter by area, budget, and amenities."
            initialProperties={initialProperties}
            initialTotalCount={total}
            initialPropertyCounts={propertyCounts}
        />
    );
}
