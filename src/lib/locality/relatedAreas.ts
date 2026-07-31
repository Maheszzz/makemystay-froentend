/**
 * Locality SEO Engine: Related Areas
 * Automatically determines nearby residential localities, IT corridors,
 * and commercial business districts from the SEO data layer.
 */

import type { HydratedLocality, Locality } from '@/data/localities';
import { getAllLocalities } from '@/data/localities';
import { getAllSeoTechParks, type TechPark } from '@/data/techParks';

export interface BusinessDistrictLink {
    /** Name of the business district or corridor */
    name: string;
    /** URL slug */
    slug: string;
    /** Whether it represents a residential locality or corporate tech park */
    type: 'locality' | 'tech-park';
    /** Short summary description */
    description: string;
    /** Relative canonical URL path */
    url: string;
}

export interface RelatedLocalitiesSection {
    /** Adjacent residential localities for internal linking clusters */
    nearbyAreas: Locality[];
    /** Nearby IT corridors and SEZ parks */
    nearbyItCorridors: TechPark[];
    /** Prominent commercial business districts in the broader city zone */
    nearbyBusinessDistricts: BusinessDistrictLink[];
}

/**
 * Determine nearby localities, IT corridors, and business districts for a locality.
 */
export function generateRelatedAreas(locality: HydratedLocality): RelatedLocalitiesSection {
    const nearbyAreas = locality.nearbyLocalities;
    const nearbyItCorridors = locality.nearbyTechParks;

    // Collect broader business districts from adjacent localities or major city hubs
    const allLocalities = getAllLocalities();
    const allTechParks = getAllSeoTechParks();

    const nearbyBusinessDistricts: BusinessDistrictLink[] = [];

    // Add top tech parks from adjacent areas
    for (const tp of allTechParks) {
        if (nearbyBusinessDistricts.length >= 6) break;
        if (locality.nearbyTechParks.some((localTp) => localTp.id === tp.id)) continue;
        if (locality.nearbyLocalities.some((loc) => loc.slug === tp.locality)) {
            nearbyBusinessDistricts.push({
                name: tp.name,
                slug: tp.slug,
                type: 'tech-park',
                description: tp.description,
                url: `/office/${tp.slug}`
            });
        }
    }

    // Add major localities if needed to ensure rich internal links
    for (const loc of allLocalities) {
        if (nearbyBusinessDistricts.length >= 8) break;
        if (loc.id === locality.id) continue;
        if (nearbyAreas.some((na) => na.id === loc.id)) continue;
        nearbyBusinessDistricts.push({
            name: loc.name,
            slug: loc.slug,
            type: 'locality',
            description: loc.description.slice(0, 110) + '...',
            url: `/pg/${loc.slug}`
        });
    }

    return {
        nearbyAreas,
        nearbyItCorridors,
        nearbyBusinessDistricts
    };
}
