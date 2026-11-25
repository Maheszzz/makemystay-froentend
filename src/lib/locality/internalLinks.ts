/**
 * Locality SEO Engine: Internal Links Generator
 * Builds high-relevance internal linking clusters (Nearby Localities,
 * Nearby Tech Parks, Popular PG Areas, and Related Landing Pages)
 * with zero duplicate URLs to maximize crawlability and PageRank flow.
 */

import type { HydratedLocality } from '@/data/localities';
import { getAllLocalities } from '@/data/localities';
import { OFFICES } from '@/data/offices';

const OFFICE_SLUGS = new Set<string>(OFFICES.map((o) => o.slug));

export interface InternalLinkItem {
    /** Anchor link text */
    name: string;
    /** Relative canonical destination URL */
    url: string;
    /** Short context snippet for tooltip or subtitle */
    description?: string;
}

export interface LocalityInternalLinks {
    /** Adjacent residential localities */
    nearbyLocalities: InternalLinkItem[];
    /** Nearby corporate tech parks and IT campuses */
    nearbyTechParks: InternalLinkItem[];
    /** Top popular PG localities across Bangalore */
    popularPgAreas: InternalLinkItem[];
    /** Essential site-wide conversion and authority landing pages */
    relatedLandingPages: InternalLinkItem[];
}

/**
 * Generate deduplicated internal linking clusters for a locality page.
 */
export function generateLocalityInternalLinks(locality: HydratedLocality): LocalityInternalLinks {
    const seenUrls = new Set<string>();
    const addUrl = (url: string) => {
        if (seenUrls.has(url)) return false;
        seenUrls.add(url);
        return true;
    };

    // 1. Nearby Localities
    const nearbyLocalities: InternalLinkItem[] = [];
    for (const loc of locality.nearbyLocalities) {
        const url = `/pg/${loc.slug}`;
        if (addUrl(url)) {
            nearbyLocalities.push({
                name: `PG in ${loc.name}`,
                url,
                description: `Explore coliving stays in ${loc.name}`
            });
        }
    }

    // 2. Nearby Tech Parks
    const nearbyTechParks: InternalLinkItem[] = [];
    for (const tp of locality.nearbyTechParks) {
        if (!OFFICE_SLUGS.has(tp.slug)) continue; // only link to office pages that exist
        const url = `/office/${tp.slug}`;
        if (addUrl(url)) {
            nearbyTechParks.push({
                name: `PG near ${tp.name}`,
                url,
                description: `Walkable accommodations near ${tp.name}`
            });
        }
    }

    // 3. Popular PG Areas (excluding current and already linked nearby localities)
    const allLocalities = getAllLocalities();
    const popularPgAreas: InternalLinkItem[] = [];
    const popularSlugs = ['whitefield', 'bellandur', 'hsr-layout', 'koramangala', 'sarjapur-road', 'electronic-city'];

    for (const slug of popularSlugs) {
        if (slug === locality.slug) continue;
        const loc = allLocalities.find((item) => item.slug === slug);
        if (!loc) continue;
        const url = `/pg/${loc.slug}`;
        if (addUrl(url)) {
            popularPgAreas.push({
                name: `PG in ${loc.name}`,
                url,
                description: `Verified PGs in ${loc.name}, Bangalore`
            });
        }
    }

    // 4. Related Landing Pages
    const landingCandidates: InternalLinkItem[] = [
        { name: 'All Bangalore PGs & Coliving', url: '/properties', description: 'Browse all verified properties' },
        { name: 'Managed Rentals in Bangalore', url: '/rent', description: 'Flats & independent rental homes' },
        { name: 'Bangalore PG Market Research', url: '/research', description: 'Rental trends & yield reports' },
        { name: 'How We Verify Properties', url: '/how-we-verify', description: '100% physical verification process' },
        { name: 'Contact MakeMyStay', url: '/contact-us', description: 'Get assistance from our team' }
    ];

    const relatedLandingPages: InternalLinkItem[] = [];
    for (const item of landingCandidates) {
        if (addUrl(item.url)) {
            relatedLandingPages.push(item);
        }
    }

    return {
        nearbyLocalities,
        nearbyTechParks,
        popularPgAreas,
        relatedLandingPages
    };
}
