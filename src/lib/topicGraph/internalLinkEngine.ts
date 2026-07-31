/**
 * Global Topic Graph Engine: Master Internal Linking Facade
 * Provides unified, high-performance API methods to connect
 * Locality, Tech Park, Blog, Property, Rent, Buy, and Office pages.
 *
 * All links are relationship-driven from the underlying graph,
 * guaranteeing zero duplicate URLs and automatic future-proofing.
 */

import { getGlobalTopicGraph, invalidateTopicGraph } from './relationships';
import { generateTopicEngineOutput, type TopicEngineOutput } from './relatedContent';
import { generateAutoInternalLinks, type AutoInternalLinks } from './relatedQueries';
import { generateTopicalClusterMap, type TopicalClusterMap } from './clusterGenerator';
import { getLocalityBySlug } from '@/data/localities';

export interface CrossLinkItem {
    name: string;
    path: string;
    category: string;
}

/**
 * Returns the full 14-category TopicEngineOutput for any locality or entity slug.
 */
export function getTopicEngineOutput(slug: string): TopicEngineOutput {
    return generateTopicEngineOutput(slug);
}

/**
 * Returns deduplicated AutoInternalLinks across 5 high-intent query categories.
 */
export function getAutoInternalLinks(slug: string): AutoInternalLinks {
    const clean = (slug || 'whitefield').toLowerCase().trim();
    const loc = getLocalityBySlug(clean);
    const hubName = loc?.name || clean.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return generateAutoInternalLinks(clean, hubName);
}

/**
 * Returns the hierarchical authority cluster map for any locality.
 */
export function getTopicalClusterMap(slug: string): TopicalClusterMap {
    return generateTopicalClusterMap(slug);
}

/**
 * Force refresh of the in-memory topic graph (useful after dynamic content updates).
 */
export function refreshTopicGraph(): void {
    invalidateTopicGraph();
    getGlobalTopicGraph();
}

/**
 * Given any application pathname (e.g. "/pg/whitefield", "/blog/cost-of-living-whitefield", "/rent/bellandur"),
 * automatically resolves the underlying locality slug and generates deduplicated cross-links across all 7 page types:
 * - Locality Pages
 * - Tech Park Pages
 * - Blog Pages
 * - Property Pages
 * - Rent Pages
 * - Buy Pages
 * - Office Pages
 */
export function resolveCrossLinksForPath(pathname: string): CrossLinkItem[] {
    const clean = (pathname || '').toLowerCase();
    const graph = getGlobalTopicGraph();
    const allNodes = graph.getAllNodes();

    // 1. Identify which locality slug is mentioned in the pathname
    let matchedSlug = 'whitefield';
    for (const node of allNodes) {
        if (node.type === 'locality' && clean.includes(node.slug)) {
            matchedSlug = node.slug;
            break;
        }
    }

    const output = generateTopicEngineOutput(matchedSlug);
    const seenPaths = new Set<string>();
    seenPaths.add(clean.replace(/\/+$/, ''));

    const results: CrossLinkItem[] = [];

    const addLinks = (links: { name: string; path: string }[], category: string, limit: number) => {
        let count = 0;
        for (const link of links) {
            const normalized = link.path.replace(/\/+$/, '');
            if (!seenPaths.has(normalized)) {
                seenPaths.add(normalized);
                results.push({
                    name: link.name,
                    path: normalized,
                    category
                });
                count++;
                if (count >= limit) break;
            }
        }
    };

    addLinks(output.relatedLocalities, 'Locality Pages', 3);
    addLinks(output.relatedTechParks, 'Tech Park Pages', 3);
    addLinks(output.relatedBlogs, 'Blog Pages', 3);
    addLinks(output.relatedProperties, 'Property Pages', 2);
    addLinks(output.relatedRentPages, 'Rent Pages', 2);
    addLinks(output.relatedOfficePages, 'Office Pages', 2);
    addLinks(output.relatedLandingPages, 'Buy Pages', 2);

    return results;
}
