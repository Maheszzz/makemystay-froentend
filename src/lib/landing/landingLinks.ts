/**
 * Tech Park Landing Page Generator: Internal Links Generator
 * Generates deduplicated internal linking clusters for Related Localities,
 * Related Tech Parks, Related Blogs, Nearby Metro, and Nearby Companies.
 */

import type { TechParkEntry } from '@/data/techParks';
import { getHydratedLocality } from '@/data/localities';
import { METRO_STATIONS } from '@/data/metroStations';

export interface InternalLinkItem {
    name: string;
    path: string;
}

export interface BlogLinkItem {
    title: string;
    path: string;
}

export interface TechParkLandingLinks {
    relatedLocalities: InternalLinkItem[];
    relatedTechParks: InternalLinkItem[];
    relatedBlogs: BlogLinkItem[];
    nearbyMetro: InternalLinkItem[];
    nearbyCompanies: InternalLinkItem[];
}

export function generateTechParkLandingLinks(
    park: TechParkEntry,
    allParks: TechParkEntry[]
): TechParkLandingLinks {
    const seenPaths = new Set<string>();
    const addUnique = (list: InternalLinkItem[], item: InternalLinkItem) => {
        if (!seenPaths.has(item.path)) {
            seenPaths.add(item.path);
            list.push(item);
        }
    };

    // 1. Related Localities
    const relatedLocalities: InternalLinkItem[] = [];
    const locSlugs = (park.localitySlugs && park.localitySlugs.length > 0)
        ? park.localitySlugs
        : [park.hubSlug || 'whitefield', 'bellandur', 'hsr-layout', 'koramangala', 'marathahalli'];

    for (const s of locSlugs) {
        if (!s) continue;
        const hyd = getHydratedLocality(s);
        if (hyd) {
            addUnique(relatedLocalities, {
                name: `PG in ${hyd.name}`,
                path: `/pg/${hyd.slug}`
            });
        } else {
            addUnique(relatedLocalities, {
                name: `PG in ${s.charAt(0).toUpperCase() + s.slice(1)}`,
                path: `/pg/${s}`
            });
        }
    }

    // 2. Related Tech Parks
    const relatedTechParks: InternalLinkItem[] = [];
    for (const tp of allParks) {
        if (tp.path === park.path) continue;
        const targetPath = tp.path ? (tp.path.startsWith('/') ? tp.path : `/${tp.path}`) : `/pg-near-${tp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        addUnique(relatedTechParks, {
            name: `PG near ${tp.name}`,
            path: targetPath
        });
        if (relatedTechParks.length >= 6) break;
    }

    // 3. Related Blogs
    const relatedBlogs: BlogLinkItem[] = [
        {
            title: `Ultimate PG Rental Guide in Bangalore (2026 Edition)`,
            path: `/blog/ultimate-pg-rental-guide-bangalore`
        },
        {
            title: `Top Coliving Spaces for IT Working Professionals`,
            path: `/blog/top-coliving-spaces-it-professionals-bangalore`
        },
        {
            title: `How to Save Daily Traffic Commute in Bangalore IT Corridors`,
            path: `/blog/how-to-save-daily-commute-bangalore-it-corridors`
        }
    ];

    // 4. Nearby Metro
    const nearbyMetro: InternalLinkItem[] = [];
    const metroMatches = (park.metroStations && park.metroStations.length > 0)
        ? park.metroStations
        : METRO_STATIONS.filter(m => m.locality === (park.hubSlug || 'whitefield')).slice(0, 3);
    for (const ms of metroMatches) {
        addUnique(nearbyMetro, {
            name: `${ms.name} Metro Connectivity`,
            path: `/pg/${park.hubSlug || 'whitefield'}#nearby-metro`
        });
    }

    // 5. Nearby Companies
    const nearbyCompanies: InternalLinkItem[] = [];
    for (const comp of park.companies || []) {
        addUnique(nearbyCompanies, {
            name: `${comp} Careers & Stays`,
            path: `/${park.path || 'pg-near-itpl'}#nearby-companies`
        });
        if (nearbyCompanies.length >= 6) break;
    }

    return {
        relatedLocalities,
        relatedTechParks,
        relatedBlogs,
        nearbyMetro,
        nearbyCompanies
    };
}
