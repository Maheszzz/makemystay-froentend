import type { Metadata } from 'next';
import { HeroImagePreload } from '@/components/sections/HeroImagePreload';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildHomeSEO } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import Home from '@/views/Home';

export const metadata: Metadata = pageSeoToMetadata(buildHomeSEO());

/** Homepage shell is static/ISR; client islands hydrate listings/search. */
export const revalidate = 3600;

export default async function HomePage() {
    const { items: initialProperties } = await fetchPropertiesServer({
        city: 'bangalore',
        category: 'pg',
        is_available: true,
        limit: 24,
        sort_by: 'review_count_desc',
    });

    const webpageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'MakeMyStay.ai - Verified PGs and Flats in Bangalore',
        description:
            'Find verified PGs, co-living spaces, rental homes, 1 BHK, 2 BHK and furnished apartments in Bangalore with makemystay.ai.',
        url: 'https://makemystay.ai',
    };

    return (
        <>
            <script
                id="homepage-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
            />
            <HeroImagePreload />
            <Home initialProperties={initialProperties} />
        </>
    );
}
