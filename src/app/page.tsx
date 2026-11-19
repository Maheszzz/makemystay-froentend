import type { Metadata } from 'next';
import { HeroImagePreload } from '@/components/sections/HeroImagePreload';
import { buildHomeFaqs } from '@/data/homePgSeo';
import { buildHomeInventorySummary } from '@/lib/homePageData';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import { buildHomeSEO } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import type { Property } from '@/types/api';
import Home, { type MarketplaceStats } from '@/views/Home';

export const metadata: Metadata = pageSeoToMetadata(buildHomeSEO());

/** Homepage shell is static/ISR; client islands hydrate listings/search. */
export const revalidate = 3600;

function countMatchingCity(items: Property[], cityToken: string, reportedTotal: number): number {
    const token = cityToken.toLowerCase();
    const matched = items.filter((p) => {
        const hay = `${p.city || ''} ${p.location || ''}`.toLowerCase();
        return hay.includes(token);
    });
    if (matched.length === 0) return 0;
    return reportedTotal > 0 ? reportedTotal : matched.length;
}

export default async function HomePage() {
    const [bangalorePgRes, bangaloreAllRes, hyderabadRes, puneRes] = await Promise.allSettled([
        fetchPropertiesServer({
            city: 'bangalore',
            category: 'pg',
            is_available: true,
            limit: 24,
            sort_by: 'review_count_desc',
        }),
        fetchPropertiesServer({
            city: 'bangalore',
            is_available: true,
            limit: 200,
            sort_by: 'newest',
        }),
        fetchPropertiesServer({
            city: 'hyderabad',
            is_available: true,
            limit: 10,
        }),
        fetchPropertiesServer({
            city: 'pune',
            is_available: true,
            limit: 10,
        }),
    ]);

    const initialProperties =
        bangalorePgRes.status === 'fulfilled' ? bangalorePgRes.value.items : [];
    const bangalorePgTotal =
        bangalorePgRes.status === 'fulfilled' ? bangalorePgRes.value.total : initialProperties.length;

    let bangaloreAllItems: Property[] =
        bangaloreAllRes.status === 'fulfilled' ? [...bangaloreAllRes.value.items] : [];
    const bangaloreAllTotal =
        bangaloreAllRes.status === 'fulfilled' ? bangaloreAllRes.value.total : bangalorePgTotal;
    const bangaloreCounts =
        bangaloreAllRes.status === 'fulfilled' ? bangaloreAllRes.value.propertyCounts : undefined;

    if (
        bangaloreAllRes.status === 'fulfilled' &&
        bangaloreAllRes.value.total > 200 &&
        bangaloreAllRes.value.items.length === 200
    ) {
        try {
            const secondBatch = await fetchPropertiesServer({
                city: 'bangalore',
                is_available: true,
                skip: 200,
                limit: 200,
                sort_by: 'newest',
            });
            bangaloreAllItems = [...bangaloreAllItems, ...secondBatch.items];
        } catch {
            // Keep first 200 items if second batch fails
        }
    }

    const homeInventory = buildHomeInventorySummary(
        bangaloreAllItems,
        bangaloreAllTotal,
        bangaloreCounts,
    );
    const homeFaqs = buildHomeFaqs(homeInventory.pgStats);

    const hyderabadCount =
        hyderabadRes.status === 'fulfilled'
            ? countMatchingCity(hyderabadRes.value.items, 'hyderabad', hyderabadRes.value.total)
            : 0;
    const puneCount =
        puneRes.status === 'fulfilled'
            ? countMatchingCity(puneRes.value.items, 'pune', puneRes.value.total)
            : 0;

    // Average only listings that meet MIN_REVIEWS_FOR_RATING; omit rating entirely if none qualify.
    let ratingWeightedSum = 0;
    let verifiedReviewCount = 0;
    for (const prop of initialProperties) {
        const q = getQualifiedRatingSummary(prop);
        if (q.showRating && q.reviewCount > 0) {
            ratingWeightedSum += q.rating * q.reviewCount;
            verifiedReviewCount += q.reviewCount;
        }
    }

    const marketplaceStats: MarketplaceStats = {
        totalListings: bangaloreAllTotal > 0 ? bangaloreAllTotal : initialProperties.length,
        verifiedReviewCount,
        averageRating:
            verifiedReviewCount > 0
                ? Number((ratingWeightedSum / verifiedReviewCount).toFixed(1))
                : null,
        cityCounts: {
            bangalore: bangaloreAllTotal > 0 ? bangaloreAllTotal : initialProperties.length,
            hyderabad: hyderabadCount,
            pune: puneCount,
        },
    };

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
            <Home
                initialProperties={initialProperties}
                marketplaceStats={marketplaceStats}
                homeInventory={homeInventory}
                homeFaqs={homeFaqs}
            />
        </>
    );
}
