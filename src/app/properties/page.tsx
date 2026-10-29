import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(listingsPageSeo({
    pathname: '/properties',
    pageTitle: 'Properties in Bangalore — PG, Flats & Plots',
    pageSubtitle: 'Verified PGs, coliving spaces, 1BHK/2BHK rental homes & plots in Bangalore',
    category: 'all',
    cityLabel: 'Bangalore',
}));

export const revalidate = 3600;

export default async function Page() {
    const { items: initialProperties } = await fetchPropertiesServer({
        city: 'bangalore',
        is_available: true,
        limit: 24,
        sort_by: 'review_count_desc',
    });

    return (
        <Properties
            key="all"
            initialCity="Bangalore"
            pageTitle="Properties in Bangalore — PG, Flats & Plots"
            pageSubtitle="Browse verified PGs, coliving spaces, 1BHK/2BHK rental homes, and plots across Bangalore"
            initialProperties={initialProperties}
        />
    );
}
