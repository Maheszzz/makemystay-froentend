import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(
    listingsPageSeo({
        pathname: '/rent',
        pageTitle: 'Flats & Houses for Rent in Bangalore',
        pageSubtitle: 'Verified 1BHK, 2BHK & furnished rental homes in Bangalore with zero brokerage',
        category: 'rent',
        cityLabel: 'Bangalore',
    }),
);

export const revalidate = 3600;

export default async function Page() {
    const { items: rentItems } = await fetchPropertiesServer({
        category: 'rent',
        city: 'bangalore',
        is_available: true,
        limit: 24,
        sort_by: 'review_count_desc',
    });

    const initialProperties =
        rentItems.length > 0
            ? rentItems
            : (
                  await fetchPropertiesServer({
                      city: 'bangalore',
                      is_available: true,
                      limit: 24,
                      sort_by: 'review_count_desc',
                  })
              ).items;

    return (
        <Properties
            key="rent"
            initialCategory="rent"
            initialCity="Bangalore"
            pageTitle="Flats & Houses for Rent in Bangalore"
            pageSubtitle="Verified 1BHK, 2BHK & furnished rental homes in Bangalore with transparent pricing"
            initialProperties={initialProperties}
        />
    );
}
