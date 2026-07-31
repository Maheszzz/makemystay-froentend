/**
 * Global Topic Graph Engine: Relationship Builder
 * Automatically populates the TopicGraph from centralized data sources
 * (Localities, Tech Parks, Companies, Metro Stations, Hospitals, Colleges,
 * Blogs, Offices, and Property/Rent/Buy landing hubs).
 *
 * Fully automatic: when new data entries are added to any source,
 * nodes and semantic edges are created without manual intervention.
 */

import { SEO_LOCALITIES } from '@/data/localities';
import { TECH_PARKS } from '@/data/techParks';
import { COMPANIES } from '@/data/companies';
import { METRO_STATIONS } from '@/data/metroStations';
import { HOSPITALS } from '@/data/hospitals';
import { COLLEGES } from '@/data/colleges';
import { BLOG_POSTS } from '@/data/blogPosts';
import { OFFICES } from '@/data/offices';
import { TopicGraph, type TopicNode } from './graph';

let globalGraphInstance: TopicGraph | null = null;

/**
 * Builds and returns the singleton Global Topic Graph.
 * Refreshes automatically in-memory on startup or whenever requested.
 */
export function getGlobalTopicGraph(): TopicGraph {
    if (globalGraphInstance) {
        return globalGraphInstance;
    }

    const graph = new TopicGraph();

    // 1. Add Localities & their Rent/Buy/Property hubs
    for (const loc of SEO_LOCALITIES) {
        const locNode: TopicNode = {
            id: `locality:${loc.slug}`,
            slug: loc.slug,
            name: loc.name,
            type: 'locality',
            path: `/pg/${loc.slug}`,
            metadata: { city: loc.city, state: loc.state }
        };
        graph.addNode(locNode);

        // Associated Rent Hub Node
        const rentNode: TopicNode = {
            id: `rent_page:${loc.slug}`,
            slug: loc.slug,
            name: `Rent in ${loc.name}`,
            type: 'rent_page',
            path: `/rent/${loc.slug}`
        };
        graph.addNode(rentNode);
        graph.addEdge({
            fromId: locNode.id,
            toId: rentNode.id,
            relationship: 'hub_of',
            weight: 10
        });
        graph.addEdge({
            fromId: rentNode.id,
            toId: locNode.id,
            relationship: 'hub_of',
            weight: 10
        });

        // Associated Buy Page Node
        const buyNode: TopicNode = {
            id: `buy_page:${loc.slug}`,
            slug: loc.slug,
            name: `Buy in ${loc.name}`,
            type: 'buy_page',
            path: `/buy/${loc.slug}`
        };
        graph.addNode(buyNode);
        graph.addEdge({
            fromId: locNode.id,
            toId: buyNode.id,
            relationship: 'hub_of',
            weight: 8
        });

        // Associated Property Listing Hub Node
        const propNode: TopicNode = {
            id: `property:${loc.slug}`,
            slug: loc.slug,
            name: `${loc.name} Verified PG Stays`,
            type: 'property',
            path: `/pg/${loc.slug}`
        };
        graph.addNode(propNode);
        graph.addEdge({
            fromId: locNode.id,
            toId: propNode.id,
            relationship: 'hub_of',
            weight: 9
        });
    }

    // 1b. Connect adjacent localities
    for (const loc of SEO_LOCALITIES) {
        const sourceId = `locality:${loc.slug}`;
        for (const adjSlug of loc.nearbyLocalities || []) {
            const targetId = `locality:${adjSlug}`;
            graph.addEdge({
                fromId: sourceId,
                toId: targetId,
                relationship: 'adjacent_to',
                weight: 9
            });
        }
    }

    // 2. Add Tech Parks & connect to Localities
    for (const tp of TECH_PARKS) {
        const tpSlug = tp.path.replace(/^pg-near-/, '');
        const tpNode: TopicNode = {
            id: `tech_park:${tpSlug}`,
            slug: tpSlug,
            name: tp.name,
            type: 'tech_park',
            path: `/${tp.path}`,
            metadata: { hubSlug: tp.hubSlug }
        };
        graph.addNode(tpNode);

        const hubId = `locality:${tp.hubSlug || 'whitefield'}`;
        graph.addEdge({
            fromId: hubId,
            toId: tpNode.id,
            relationship: 'near_tech_park',
            weight: 10
        });
        graph.addEdge({
            fromId: tpNode.id,
            toId: hubId,
            relationship: 'located_in',
            weight: 10
        });

        for (const locSlug of tp.localitySlugs || []) {
            graph.addEdge({
                fromId: `locality:${locSlug}`,
                toId: tpNode.id,
                relationship: 'near_tech_park',
                weight: 8
            });
        }
    }

    // 3. Add Companies & connect to Localities / Tech Parks
    for (const comp of COMPANIES) {
        const compNode: TopicNode = {
            id: `company:${comp.slug}`,
            slug: comp.slug,
            name: comp.name,
            type: 'company',
            path: `/company/${comp.slug}`,
            metadata: { industry: comp.industry }
        };
        graph.addNode(compNode);

        for (const locSlug of comp.localities || []) {
            graph.addEdge({
                fromId: `locality:${locSlug}`,
                toId: compNode.id,
                relationship: 'employs_at',
                weight: 8
            });
            graph.addEdge({
                fromId: compNode.id,
                toId: `locality:${locSlug}`,
                relationship: 'located_in',
                weight: 8
            });
        }
    }

    // 4. Add Metro Stations & connect to Localities
    for (const metro of METRO_STATIONS) {
        const metroNode: TopicNode = {
            id: `metro:${metro.slug}`,
            slug: metro.slug,
            name: `${metro.name} Metro Station`,
            type: 'metro',
            path: `/metro/${metro.slug}`,
            metadata: { line: metro.line, isOperational: metro.isOperational }
        };
        graph.addNode(metroNode);

        if (metro.locality) {
            graph.addEdge({
                fromId: `locality:${metro.locality}`,
                toId: metroNode.id,
                relationship: 'serviced_by_metro',
                weight: 9
            });
            graph.addEdge({
                fromId: metroNode.id,
                toId: `locality:${metro.locality}`,
                relationship: 'located_in',
                weight: 9
            });
        }
    }

    // 5. Add Hospitals & connect to Localities
    for (const hosp of HOSPITALS) {
        const hospNode: TopicNode = {
            id: `hospital:${hosp.slug}`,
            slug: hosp.slug,
            name: hosp.name,
            type: 'hospital',
            path: `/hospital/${hosp.slug}`
        };
        graph.addNode(hospNode);

        if (hosp.locality) {
            graph.addEdge({
                fromId: `locality:${hosp.locality}`,
                toId: hospNode.id,
                relationship: 'has_hospital',
                weight: 7
            });
        }
    }

    // 6. Add Colleges & connect to Localities
    for (const col of COLLEGES) {
        const colNode: TopicNode = {
            id: `college:${col.slug}`,
            slug: col.slug,
            name: col.name,
            type: 'college',
            path: `/college/${col.slug}`
        };
        graph.addNode(colNode);

        if (col.locality) {
            graph.addEdge({
                fromId: `locality:${col.locality}`,
                toId: colNode.id,
                relationship: 'has_college',
                weight: 8
            });
        }
    }

    // 7. Add Office Pages
    for (const off of OFFICES) {
        const offNode: TopicNode = {
            id: `office_page:${off.slug}`,
            slug: off.slug,
            name: `${off.name} Office Area`,
            type: 'office_page',
            path: `/office/${off.slug}`
        };
        graph.addNode(offNode);

        const matchLoc = SEO_LOCALITIES.find(l => l.slug === off.slug || l.name.toLowerCase().includes(off.name.toLowerCase()));
        const targetSlug = matchLoc?.slug || 'whitefield';
        graph.addEdge({
            fromId: `locality:${targetSlug}`,
            toId: offNode.id,
            relationship: 'hub_of',
            weight: 7
        });
    }

    // 8. Add Blog Posts & automatically build topic edges
    for (const post of BLOG_POSTS) {
        const blogNode: TopicNode = {
            id: `blog:${post.slug}`,
            slug: post.slug,
            name: post.title,
            type: 'blog',
            path: `/blog/${post.slug}`,
            metadata: { category: post.category }
        };
        graph.addNode(blogNode);

        // Check if slug or title references any locality
        for (const loc of SEO_LOCALITIES) {
            if (
                post.slug.includes(loc.slug) ||
                post.title.toLowerCase().includes(loc.name.toLowerCase())
            ) {
                graph.addEdge({
                    fromId: `locality:${loc.slug}`,
                    toId: blogNode.id,
                    relationship: 'covers_topic',
                    weight: 9
                });
                graph.addEdge({
                    fromId: blogNode.id,
                    toId: `locality:${loc.slug}`,
                    relationship: 'covers_topic',
                    weight: 9
                });
            }
        }
    }

    globalGraphInstance = graph;
    return globalGraphInstance;
}

/**
 * Invalidates the cached global topic graph so it is rebuilt on next access.
 */
export function invalidateTopicGraph(): void {
    globalGraphInstance = null;
}
