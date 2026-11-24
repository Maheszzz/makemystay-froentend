/**
 * Locality SEO Engine: Metadata Generator
 * Reuses the existing central metadata engine (pageSeoToMetadata & buildPageSEO)
 * to generate SEO Title, Meta Description, Canonical URL, Keywords, OpenGraph,
 * Twitter cards, and Robots directives for locality landing pages.
 */

import type { Metadata } from 'next';
import type { HydratedLocality } from '@/data/localities';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildPageSEO, type HelmetSEOProps, type PageSEOInput } from '@/lib/seo';
import { DEFAULT_OG_IMAGE } from '@/lib/siteConfig';
import type { PgLocalityStats } from '@/lib/listingInventoryStats';

const MAX_DESCRIPTION_LENGTH = 160;

function inr(n: number): string {
    return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * Title + description for a locality page. When live inventory stats are available, the
 * listing count and real lowest price are used (better CTR, and never contradicts the page).
 */
export function buildLocalityTitleAndDescription(
    locality: HydratedLocality,
    stats?: PgLocalityStats | null,
): { title: string; description: string } {
    const name = locality.name;
    const park = locality.nearbyTechParks[0]?.name;
    const hasCount = !!stats && stats.count > 0;
    const hasPrice = !!stats && stats.minPrice != null;

    // Brand suffix (" | MakeMyStay") is appended by buildPageSEO.
    const title = hasPrice
        ? `PG in ${name} Bangalore from ${inr(stats!.minPrice!)} – Verified`
        : `PG in ${name}, Bangalore – Verified, Zero Brokerage`;

    const lead = hasCount
        ? `${stats!.count} verified ${stats!.count === 1 ? 'PG' : 'PGs'} in ${name}, Bangalore${hasPrice ? ` from ${inr(stats!.minPrice!)}/mo` : ''}.`
        : `Find verified PGs in ${name}, Bangalore.`;
    const cta = 'Zero brokerage – book a free site visit today.';
    const rooms = stats && stats.count > 0 && !stats.single ? 'Shared rooms' : 'Shared & private rooms';
    const withPark = park ? `${lead} ${rooms} near ${park}. ${cta}` : `${lead} ${cta}`;
    const description = withPark.length <= MAX_DESCRIPTION_LENGTH ? withPark : `${lead} ${cta}`;

    return { title, description };
}

/**
 * Generate shared PageSEOInput for a locality page.
 */
export function generateLocalitySeoInput(locality: HydratedLocality, stats?: PgLocalityStats | null): PageSEOInput {
    const { title, description } = buildLocalityTitleAndDescription(locality, stats);

    const allKeywords = [
        locality.keywords.primary,
        ...locality.keywords.secondary,
        ...locality.keywords.commercial,
        ...locality.keywords.longTail
    ].join(', ');

    return {
        title,
        description,
        path: `/pg/${locality.slug}`,
        ogImage: DEFAULT_OG_IMAGE,
        keywords: allKeywords,
        noindex: false
    };
}

/**
 * Generate Next.js App Router Metadata object for a locality page.
 * Reuses pageSeoToMetadata to include OpenGraph, Twitter, canonical, and Robots tags.
 */
export function generateLocalityMetadata(locality: HydratedLocality, stats?: PgLocalityStats | null): Metadata {
    const input = generateLocalitySeoInput(locality, stats);
    return pageSeoToMetadata(input, { openGraphType: 'website' });
}

/**
 * Generate React Helmet SEO properties for client-side or legacy SPA rendering.
 */
export function generateLocalityHelmetSeo(locality: HydratedLocality, stats?: PgLocalityStats | null): HelmetSEOProps {
    const input = generateLocalitySeoInput(locality, stats);
    return buildPageSEO(input);
}
