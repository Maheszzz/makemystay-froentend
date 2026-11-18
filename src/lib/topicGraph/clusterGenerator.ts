/**
 * Global Topic Graph Engine: Topical Cluster Generator
 * Automatically constructs hierarchical authority clusters for any locality,
 * mapping the primary hub to all related pillar pages, blogs, and listing paths.
 */

import { getLocalityBySlug } from '@/data/localities';
import { TECH_PARKS } from '@/data/techParks';

export interface TopicalClusterNode {
    id: string;
    label: string;
    path: string;
    level: number;
    children?: TopicalClusterNode[];
}

export interface TopicalClusterMap {
    rootSlug: string;
    rootName: string;
    clusterHierarchy: TopicalClusterNode;
    allClusterPaths: string[];
}

/**
 * Builds the hierarchical authority tree for a given locality slug.
 */
export function generateTopicalClusterMap(localitySlug: string): TopicalClusterMap {
    const cleanSlug = (localitySlug || 'whitefield').toLowerCase().trim();
    const loc = getLocalityBySlug(cleanSlug);
    const locName = loc?.name || cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const allPaths = new Set<string>();
    const registerPath = (path: string): string => {
        const clean = path.replace(/\/+$/, '');
        allPaths.add(clean);
        return clean;
    };

    // Find first matching tech park in this locality
    const matchPark = TECH_PARKS.find(tp => tp.hubSlug === cleanSlug) || TECH_PARKS[0];
    const techParkPath = matchPark ? `/${matchPark.path}` : '/pg-near-itpl';
    const techParkName = matchPark ? matchPark.name : 'ITPL';

    const rootPath = registerPath(`/pg/${cleanSlug}`);

    const clusterHierarchy: TopicalClusterNode = {
        id: `root:${cleanSlug}`,
        label: `PG in ${locName}`,
        path: rootPath,
        level: 0,
        children: [
            {
                id: `pillar:best-pg`,
                label: `Best PG in ${locName}`,
                path: registerPath(`/blog/best-pg-in-${cleanSlug}`),
                level: 1,
                children: [
                    {
                        id: `leaf:luxury-pg`,
                        label: `Luxury PG ${locName}`,
                        path: registerPath(`/blog/luxury-pg-${cleanSlug}`),
                        level: 2
                    },
                    {
                        id: `leaf:budget-pg`,
                        label: `Budget PG ${locName}`,
                        path: registerPath(`/blog/budget-pg-${cleanSlug}`),
                        level: 2
                    }
                ]
            },
            {
                id: `pillar:cost-of-living`,
                label: `Cost of Living in ${locName}`,
                path: registerPath(`/blog/cost-of-living-${cleanSlug}`),
                level: 1,
                children: [
                    {
                        id: `leaf:single-sharing`,
                        label: `Single Sharing PG in ${locName}`,
                        path: registerPath(`/blog/single-sharing-pg-${cleanSlug}`),
                        level: 2
                    },
                    {
                        id: `leaf:working-professional`,
                        label: `Working Professional Guide`,
                        path: registerPath(`/blog/working-professional-guide-${cleanSlug}`),
                        level: 2
                    }
                ]
            },
            {
                id: `pillar:tech-park-hub`,
                label: `PG near ${techParkName}`,
                path: registerPath(techParkPath),
                level: 1,
                children: [
                    {
                        id: `leaf:metro-guide`,
                        label: `Metro & Commute Guide`,
                        path: registerPath(`/blog/commute-guide-${cleanSlug}`),
                        level: 2
                    },
                    {
                        id: `leaf:property-listings`,
                        label: `${locName} Property Listings`,
                        path: registerPath(`/rent/${cleanSlug}`),
                        level: 2
                    }
                ]
            }
        ]
    };

    return {
        rootSlug: cleanSlug,
        rootName: locName,
        clusterHierarchy,
        allClusterPaths: Array.from(allPaths)
    };
}
