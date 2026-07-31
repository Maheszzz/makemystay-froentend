/**
 * Global Topic Graph Engine: Related Content Generator
 * Queries the semantic Topic Graph to generate strongly typed, relationship-driven
 * internal link clusters across 14 distinct content categories.
 */

import { getLocalityBySlug } from '@/data/localities';
import { getGlobalTopicGraph } from './relationships';
import type { NodeType, TopicNode } from './graph';

export interface RelatedContentLink {
    name: string;
    path: string;
    description?: string;
    type: NodeType;
}

export interface TopicEngineOutput {
    localitySlug: string;
    localityName: string;
    relatedLocalities: RelatedContentLink[];
    relatedTechParks: RelatedContentLink[];
    relatedCompanies: RelatedContentLink[];
    relatedBlogs: RelatedContentLink[];
    relatedMetro: RelatedContentLink[];
    relatedHospitals: RelatedContentLink[];
    relatedColleges: RelatedContentLink[];
    relatedProperties: RelatedContentLink[];
    relatedRentPages: RelatedContentLink[];
    relatedOfficePages: RelatedContentLink[];
    relatedLandingPages: RelatedContentLink[];
    peopleAlsoSearchFor: string[];
    frequentlyComparedAreas: RelatedContentLink[];
    nearbyCommuteGuides: RelatedContentLink[];
}

/**
 * Transforms a raw TopicNode into a standardized RelatedContentLink.
 */
function nodeToLink(node: TopicNode, description?: string): RelatedContentLink {
    return {
        name: node.name,
        path: node.path,
        description,
        type: node.type
    };
}

/**
 * Generates the complete, strongly typed 14-category TopicEngineOutput
 * for any locality or hub slug by querying the global semantic graph.
 */
export function generateTopicEngineOutput(slug: string): TopicEngineOutput {
    const cleanSlug = (slug || 'whitefield').toLowerCase().trim();
    const loc = getLocalityBySlug(cleanSlug);
    const locName = loc?.name || cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const graph = getGlobalTopicGraph();
    const locId = `locality:${cleanSlug}`;

    // Helper to fetch nodes of a specific type from graph with fallback to all nodes of that type
    const fetchNodesOfType = (type: NodeType, maxCount = 6): RelatedContentLink[] => {
        const related = graph.getBidirectionalRelatedNodes(locId, type);
        const links: RelatedContentLink[] = [];
        const seen = new Set<string>();

        for (const node of related) {
            if (!seen.has(node.path)) {
                seen.add(node.path);
                links.push(nodeToLink(node));
                if (links.length >= maxCount) break;
            }
        }

        // Fill with global top nodes of this type if graph count is low
        if (links.length < maxCount) {
            for (const n of graph.getAllNodes()) {
                if (n.type === type && !seen.has(n.path) && n.slug !== cleanSlug) {
                    seen.add(n.path);
                    links.push(nodeToLink(n));
                    if (links.length >= maxCount) break;
                }
            }
        }
        return links;
    };

    const relatedLocalities = fetchNodesOfType('locality', 6);
    const relatedTechParks = fetchNodesOfType('tech_park', 5);
    const relatedCompanies = fetchNodesOfType('company', 5);
    const relatedBlogs = fetchNodesOfType('blog', 6);
    const relatedMetro = fetchNodesOfType('metro', 4);
    const relatedHospitals = fetchNodesOfType('hospital', 4);
    const relatedColleges = fetchNodesOfType('college', 4);
    const relatedProperties = fetchNodesOfType('property', 4);
    const relatedRentPages = fetchNodesOfType('rent_page', 4);
    const relatedOfficePages = fetchNodesOfType('office_page', 4);
    const relatedLandingPages = fetchNodesOfType('buy_page', 4);

    // Dynamic AEO queries & comparisons
    const peopleAlsoSearchFor: string[] = [
        `Best PG in ${locName} for IT Working Professionals`,
        `Single Sharing Private PG in ${locName} under ₹15000`,
        `Coliving accommodation near IT Tech Parks in ${locName}`,
        `Luxury PG with Gym, Food and 200 Mbps Wi-Fi in ${locName}`,
        `Zero Brokerage PG with 3 Meals in ${locName}`
    ];

    const frequentlyComparedAreas: RelatedContentLink[] = [
        {
            name: `${locName} vs Marathahalli Coliving Guide`,
            path: `/blog/${cleanSlug}-vs-marathahalli`,
            type: 'blog'
        },
        {
            name: `${locName} vs Bellandur IT Corridor Stays`,
            path: `/blog/${cleanSlug}-vs-bellandur`,
            type: 'blog'
        },
        {
            name: `${locName} vs HSR Layout Rent Comparison`,
            path: `/blog/${cleanSlug}-vs-hsr-layout`,
            type: 'blog'
        }
    ];

    const nearbyCommuteGuides: RelatedContentLink[] = [
        {
            name: `Commuting from ${locName}: Metro & BMTC Routes`,
            path: `/blog/commute-guide-${cleanSlug}`,
            type: 'blog'
        },
        {
            name: `Walkable PGs Near Major IT Tech Parks in ${locName}`,
            path: `/blog/tech-park-guide-${cleanSlug}`,
            type: 'blog'
        },
        {
            name: `2026 Traffic & Commute Matrix for ${locName} Residents`,
            path: `/blog/area-guide-${cleanSlug}`,
            type: 'blog'
        }
    ];

    return {
        localitySlug: cleanSlug,
        localityName: locName,
        relatedLocalities,
        relatedTechParks,
        relatedCompanies,
        relatedBlogs,
        relatedMetro,
        relatedHospitals,
        relatedColleges,
        relatedProperties,
        relatedRentPages,
        relatedOfficePages,
        relatedLandingPages,
        peopleAlsoSearchFor,
        frequentlyComparedAreas,
        nearbyCommuteGuides
    };
}
