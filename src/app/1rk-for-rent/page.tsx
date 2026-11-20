import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { build1RkSEO } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(build1RkSEO());

export const dynamic = 'force-dynamic';

export default async function Page() {
    let initialProperties;
    let total;
    let propertyCounts;
    try {
        const res = await fetchPropertiesServer({
            category: 'rent',
            city: 'bangalore',
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
            key="1rk-for-rent"
            initialCategory="rent"
            initialTypeFilter="1RK"
            initialCity="Bangalore"
            pageTitle="1RK for Rent in Bangalore"
            pageSubtitle="Verified studio and 1RK flats for rent across Bangalore — transparent pricing and instant visit booking."
            initialProperties={initialProperties}
            initialTotalCount={total}
            initialPropertyCounts={propertyCounts}
        />
    );
}
