/**
 * Global Topic Graph Engine: Auto Internal Linking & Query Generator
 * Dynamically constructs 5 high-intent internal link categories:
 * - Related Searches
 * - People Also Search For
 * - Nearby Areas
 * - Popular Searches
 * - Explore More
 *
 * Strictly deduplicates URLs across all categories so Google crawls unique hubs.
 */

import { SEO_LOCALITIES } from '@/data/localities';
import { TECH_PARKS } from '@/data/techParks';

export interface AutoInternalLinkItem {
    label: string;
    path: string;
}

export interface AutoInternalLinks {
    relatedSearches: AutoInternalLinkItem[];
    peopleAlsoSearchFor: AutoInternalLinkItem[];
    nearbyAreas: AutoInternalLinkItem[];
    popularSearches: AutoInternalLinkItem[];
    exploreMore: AutoInternalLinkItem[];
}

/**
 * Generates deduplicated high-intent search and area link clusters.
 */
export function generateAutoInternalLinks(slug: string, hubName: string): AutoInternalLinks {
    const cleanSlug = (slug || 'whitefield').toLowerCase().trim();
    const seenPaths = new Set<string>();

    const registerLink = (label: string, path: string): AutoInternalLinkItem | null => {
        const p = path.replace(/\/+$/, '');
        if (seenPaths.has(p)) {
            return null;
        }
        seenPaths.add(p);
        return { label, path: p };
    };

    // 1. Related Searches
    const relatedSearches: AutoInternalLinkItem[] = [
        registerLink(`Luxury Coliving in ${hubName}`, `/blog/luxury-pg-${cleanSlug}`),
        registerLink(`Single Sharing Rooms in ${hubName}`, `/blog/single-sharing-pg-${cleanSlug}`),
        registerLink(`Cost of Living Breakdown for ${hubName}`, `/blog/cost-of-living-${cleanSlug}`),
        registerLink(`Verified Men's PG in ${hubName}`, `/pg/${cleanSlug}?gender=men`),
        registerLink(`Verified Ladies PG in ${hubName}`, `/pg/${cleanSlug}?gender=women`)
    ].filter((item): item is AutoInternalLinkItem => item !== null);

    // 2. People Also Search For
    const peopleAlsoSearchFor: AutoInternalLinkItem[] = [
        registerLink(`Best PG in ${hubName} with Food`, `/blog/best-pg-in-${cleanSlug}`),
        registerLink(`Zero Brokerage Rentals in ${hubName}`, `/rent/${cleanSlug}`),
        registerLink(`Walkable PGs Near IT Parks in ${hubName}`, `/blog/tech-park-guide-${cleanSlug}`),
        registerLink(`Budget PG Stays Under ₹8500 in ${hubName}`, `/blog/budget-pg-${cleanSlug}`)
    ].filter((item): item is AutoInternalLinkItem => item !== null);

    // 3. Nearby Areas
    const nearbyAreas: AutoInternalLinkItem[] = [];
    for (const loc of SEO_LOCALITIES) {
        if (loc.slug === cleanSlug) continue;
        const link = registerLink(`PG in ${loc.name}`, `/pg/${loc.slug}`);
        if (link) {
            nearbyAreas.push(link);
            if (nearbyAreas.length >= 6) break;
        }
    }

    // 4. Popular Searches (Tech Parks & Major Hubs)
    const popularSearches: AutoInternalLinkItem[] = [];
    for (const tp of TECH_PARKS) {
        const link = registerLink(`PG near ${tp.name}`, `/${tp.path}`);
        if (link) {
            popularSearches.push(link);
            if (popularSearches.length >= 5) break;
        }
    }

    // 5. Explore More (Hub guides, rental guides, property listings)
    const exploreMore: AutoInternalLinkItem[] = [
        registerLink(`All Bangalore PG Directory`, `/pg/bangalore`),
        registerLink(`2026 Bangalore Rent Benchmark Guide`, `/blog/pg-in-bangalore-guide`),
        registerLink(`Whitefield Coliving Corridors`, `/pg/whitefield`),
        registerLink(`Bellandur Outer Ring Road Stays`, `/pg/bellandur`),
        registerLink(`Koramangala Student & Professional PGs`, `/pg/koramangala`)
    ].filter((item): item is AutoInternalLinkItem => item !== null);

    return {
        relatedSearches,
        peopleAlsoSearchFor,
        nearbyAreas,
        popularSearches,
        exploreMore
    };
}
