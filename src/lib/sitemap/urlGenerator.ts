/**
 * Automated Sitemap & Indexing Engine: Dynamic URL Generator
 * Discovers and builds 100% canonical, non-duplicated SitemapUrlEntry objects
 * across Home, Locality, Tech Park Landing, Blog, Property, Rent, Buy, Office,
 * and Category pages from centralized data sources and the Topic Graph.
 */

import { SITE_URL } from '@/lib/siteConfig';
import { SEO_LOCALITIES } from '@/data/localities';
import { TECH_PARKS } from '@/data/techParks';
import { OFFICES } from '@/data/offices';
import { getProgrammaticBlogSlugs } from '@/lib/blog';
import { getGlobalTopicGraph } from '@/lib/topicGraph';
import { FEATURED_PROPERTIES } from '@/config/featuredProperties';
import { titleToSlug } from '@/lib/propertyRouting';
import { resolveChangeFrequency, type ChangeFreq, type SitemapCategory } from './changeFrequency';
import { resolvePriority } from './priority';

export type { SitemapCategory };

export interface SitemapImageEntry {
    loc: string;
    title?: string;
    caption?: string;
}

export interface SitemapUrlEntry {
    /** Absolute canonical URL e.g. "https://makemystay.ai/pg/whitefield" */
    loc: string;
    /** ISO 8601 date string e.g. "2026-05-15" */
    lastmod: string;
    /** Change frequency classification */
    changefreq: ChangeFreq;
    /** Priority score (0.0 to 1.0) */
    priority: number;
    /** Content category classification */
    category: SitemapCategory;
    /** Optional image metadata for image-sitemap.xml */
    images?: SitemapImageEntry[];
}

/**
 * Validates whether a relative path is canonical and eligible for XML indexing.
 * Skips parameterized queries, duplicate prefixes (/pg-in-*), and blocked paths.
 */
export function isCanonicalIndexablePath(path: string): boolean {
    if (!path) return false;
    if (path.includes('?') || path.includes('#') || path.includes('=')) return false;
    if (path.startsWith('/pg-in-')) return false; // Non-canonical duplicate of /pg/*
    if (path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/admin')) return false;
    return true;
}

/**
 * Formats a relative path into an absolute canonical URL.
 */
function toCanonicalUrl(path: string): string {
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${clean.replace(/\/+$/, '')}` || `${SITE_URL}/`;
}

/**
 * Master discovery function that generates all indexable canonical URLs across all categories.
 */
export function generateAllSitemapUrls(): SitemapUrlEntry[] {
    const seenUrls = new Set<string>();
    const entries: SitemapUrlEntry[] = [];

    const registerEntry = (
        path: string,
        category: SitemapCategory,
        lastmod = '2026-05-15',
        images?: SitemapImageEntry[]
    ) => {
        if (!isCanonicalIndexablePath(path)) return;
        const loc = toCanonicalUrl(path);
        if (seenUrls.has(loc)) return;
        seenUrls.add(loc);

        const changefreq = resolveChangeFrequency(category);
        const priority = resolvePriority(category, path);

        entries.push({
            loc,
            lastmod,
            changefreq,
            priority,
            category,
            images
        });
    };

    // 1. Home
    registerEntry('/', 'home', '2026-05-15', [
        {
            loc: `${SITE_URL}/images/og-default.jpg`,
            title: 'MakeMyStay Bangalore Coliving & PG Rentals',
            caption: 'Verified Paying Guest stays across Bangalore'
        }
    ]);

    // 2. Static Core & Category Pages
    const staticPaths = [
        { path: '/properties', category: 'static' as const },
        { path: '/contact-us', category: 'static' as const },
        { path: '/about', category: 'static' as const },
        { path: '/faq', category: 'static' as const },
        { path: '/how-we-verify', category: 'static' as const },
        { path: '/flats-in-bangalore', category: 'static' as const },
        { path: '/pg/bangalore', category: 'locality' as const },
        { path: '/rent/bangalore', category: 'rent' as const },
        { path: '/buy/in/bangalore', category: 'buy' as const },
        { path: '/blog', category: 'blog' as const }
    ];
    for (const item of staticPaths) {
        registerEntry(item.path, item.category);
    }

    const categoryPaths = [
        '/pg-with-wifi',
        '/pg-with-food',
        '/pg-with-ac',
        '/pg-near-me',
        '/1-bhk',
        '/2bhk'
    ];
    for (const p of categoryPaths) {
        registerEntry(p, 'category');
    }

    // 3. Locality, Rent Hubs & Buy Hubs
    for (const loc of SEO_LOCALITIES) {
        registerEntry(`/pg/${loc.slug}`, 'locality', '2026-05-15', [
            {
                loc: `${SITE_URL}/images/localities/${loc.slug}.jpg`,
                title: `PG in ${loc.name}`,
                caption: `Coliving stays and rental rooms in ${loc.name}, Bangalore`
            }
        ]);
        registerEntry(`/rent/${loc.slug}`, 'rent');
        registerEntry(`/buy/${loc.slug}`, 'buy');
    }

    // 4. Tech Park Landing Pages
    for (const tp of TECH_PARKS) {
        registerEntry(`/${tp.path}`, 'landing', '2026-05-15', [
            {
                loc: `${SITE_URL}/images/tech-parks/${tp.path}.jpg`,
                title: `PG near ${tp.name}`,
                caption: `Walking distance coliving stays around ${tp.name}`
            }
        ]);
    }

    // 5. Office Pages
    for (const off of OFFICES) {
        registerEntry(`/office/${off.slug}`, 'office');
    }

    // 6. Programmatic Blog Articles
    const blogSlugs = getProgrammaticBlogSlugs();
    for (const slug of blogSlugs) {
        registerEntry(`/blog/${slug}`, 'blog', '2026-05-15', [
            {
                loc: `${SITE_URL}/images/blog/${slug}.jpg`,
                title: `${slug.replace(/-/g, ' ')}`,
                caption: `MakeMyStay 2026 Guide: ${slug.replace(/-/g, ' ')}`
            }
        ]);
    }

    // 7. Featured & Existing Properties
    for (const propTitle of FEATURED_PROPERTIES) {
        const slug = titleToSlug(propTitle);
        if (slug) {
            registerEntry(`/property/${slug}`, 'property');
        }
    }

    // 8. Auto-discover from Topic Graph (future-proofing)
    const graph = getGlobalTopicGraph();
    for (const node of graph.getAllNodes()) {
        const categoryMap: Record<string, SitemapCategory> = {
            locality: 'locality',
            tech_park: 'landing',
            rent_page: 'rent',
            buy_page: 'buy',
            office_page: 'office',
            property: 'property',
            blog: 'blog'
        };
        const mappedCat = categoryMap[node.type] || 'static';
        registerEntry(node.path, mappedCat);
    }

    return entries;
}

/**
 * Filters generated sitemap URLs by their assigned SitemapCategory.
 */
export function generateCategorySitemapUrls(category: SitemapCategory): SitemapUrlEntry[] {
    const all = generateAllSitemapUrls();
    return all.filter(item => item.category === category);
}
