import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildServiceApartmentForRentSEO } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(buildServiceApartmentForRentSEO());

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
            key="service-apartment-for-rent"
            initialCategory="rent"
            initialCity="Bangalore"
            pageTitle="Service Apartment for Rent in Bangalore"
            pageSubtitle="Fully furnished serviced apartments for rent in Bangalore with WiFi, housekeeping, and flexible stays."
            initialProperties={initialProperties}
            initialTotalCount={total}
            initialPropertyCounts={propertyCounts}
        />
    );
}
