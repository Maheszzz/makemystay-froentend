import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(
    listingsPageSeo({
        pathname: '/rent',
        pageTitle: 'Flats for rent in Bangalore',
        pageSubtitle: 'Apartments and independent homes for rent across Bangalore',
        category: 'rent',
        cityLabel: 'Bangalore',
    }),
);

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { items: rentItems } = await fetchPropertiesServer({
        category: 'rent',
        city: 'bangalore',
        is_available: true,
        limit: 24,
        sort_by: 'newest',
    });

    const initialProperties =
        rentItems.length > 0
            ? rentItems
            : (
                  await fetchPropertiesServer({
                      city: 'bangalore',
                      is_available: true,
                      limit: 24,
                      sort_by: 'newest',
                  })
              ).items;

    return (
        <Properties
            key="rent"
            initialCategory="rent"
            initialCity="Bangalore"
            pageTitle="Flats for rent in Bangalore"
            pageSubtitle="Apartments and independent homes for rent across Bangalore."
            initialProperties={initialProperties}
        />
    );
}
