import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(listingsPageSeo({
    pathname: '/pg',
    pageTitle: 'PG Accommodations in Bangalore',
    pageSubtitle: 'Verified paying guest stays & coliving spaces in Bangalore',
    category: 'pg',
    cityLabel: 'Bangalore',
}));

export const revalidate = 3600;

export default async function Page() {
    const { items: initialProperties } = await fetchPropertiesServer({
        category: 'pg',
        city: 'bangalore',
        is_available: true,
        limit: 24,
        sort_by: 'review_count_desc',
    });

    return (
        <Properties
            key="pg"
            initialCategory="pg"
            initialCity="Bangalore"
            pageTitle="PG Accommodations in Bangalore"
            pageSubtitle="Comfortable & verified PG options in Bangalore with zero brokerage"
            initialProperties={initialProperties}
        />
    );
}
