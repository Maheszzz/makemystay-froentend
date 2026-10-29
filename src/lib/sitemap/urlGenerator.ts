/**
 * Automated Sitemap & Indexing Engine: Dynamic URL Generator
 * Discovers and builds 100% canonical, non-duplicated SitemapUrlEntry objects
 * across Home, Locality, Tech Park Landing, Blog, Property, Rent, Buy, Office,
 * and Category pages from centralized data sources and the Topic Graph.
 */

import { SITE_URL } from '@/lib/siteConfig';
import { SEO_LOCALITIES } from '@/data/localities';
import { PG_LOCATIONS } from '@/data/pgLocations';
import { TECH_PARKS } from '@/data/techParks';
import { OFFICES } from '@/data/offices';
import { BLOG_POSTS } from '@/data/blogPosts';
import { getProgrammaticBlogSlugs } from '@/lib/blog';
import { getGlobalTopicGraph } from '@/lib/topicGraph';
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
    /** Optional ISO 8601 date string (only set when a real timestamp exists) */
    lastmod?: string;
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
    if (path.startsWith('/property/')) return false; // Non-canonical redirect to /pg/:id-:slug or /rent/:id-:slug
    if (path.startsWith('/buy/') && !path.startsWith('/buy/in/')) return false; // Only /buy/in/[city] exists
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
        lastmod?: string,
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
            ...(lastmod ? { lastmod } : {}),
            changefreq,
            priority,
            category,
            images
        });
    };

    // 1. Home
    registerEntry('/', 'home', undefined, [
        {
            loc: `${SITE_URL}/og-image.jpg`,
            title: 'MakeMyStay Bangalore Coliving & PG Rentals',
            caption: 'Verified Paying Guest stays across Bangalore'
        }
    ]);

    // 2. Static Core & Category Pages
    const staticPaths = [
        { path: '/properties', category: 'static' as const },
        { path: '/pg', category: 'static' as const },
        { path: '/rent', category: 'static' as const },
        { path: '/contact-us', category: 'static' as const },
        { path: '/about', category: 'static' as const },
        { path: '/faq', category: 'static' as const },
        { path: '/how-we-verify', category: 'static' as const },
        { path: '/research', category: 'static' as const },
        { path: '/reports', category: 'static' as const },
        { path: '/statistics', category: 'static' as const },
        { path: '/pg-vs-flat-bangalore', category: 'static' as const },
        { path: '/flats-in-bangalore', category: 'static' as const },
        { path: '/pg/bangalore', category: 'locality' as const },
        { path: '/pg/hyderabad', category: 'locality' as const },
        { path: '/pg/pune', category: 'locality' as const },
        { path: '/rent/bangalore', category: 'rent' as const },
        { path: '/rent/hyderabad', category: 'rent' as const },
        { path: '/rent/pune', category: 'rent' as const },
        { path: '/buy/in/bangalore', category: 'buy' as const },
        { path: '/plots/in/bangalore', category: 'static' as const },
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

    // 3. Locality & Rent Hubs
    for (const loc of SEO_LOCALITIES) {
        registerEntry(`/pg/${loc.slug}`, 'locality', undefined, [
            {
                loc: `${SITE_URL}/images/localities/${loc.slug}.jpg`,
                title: `PG in ${loc.name}`,
                caption: `Coliving stays and rental rooms in ${loc.name}, Bangalore`
            }
        ]);
        registerEntry(`/rent/${loc.slug}`, 'rent');
    }
    for (const loc of PG_LOCATIONS) {
        registerEntry(`/pg/${loc.slug}`, 'locality');
        registerEntry(`/pg-for-boys-in-${loc.slug}`, 'locality');
        registerEntry(`/pg-for-girls-in-${loc.slug}`, 'locality');
    }

    // 4. Tech Park Landing Pages
    for (const tp of TECH_PARKS) {
        registerEntry(`/${tp.path}`, 'landing', undefined, [
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

    // 6. Blog Articles (Editorial + Programmatic)
    for (const post of BLOG_POSTS) {
        registerEntry(`/blog/${post.slug}`, 'blog');
    }
    const blogSlugs = getProgrammaticBlogSlugs();
    for (const slug of blogSlugs) {
        registerEntry(`/blog/${slug}`, 'blog', undefined, [
            {
                loc: `${SITE_URL}/images/blog/${slug}.jpg`,
                title: `${slug.replace(/-/g, ' ')}`,
                caption: `MakeMyStay 2026 Guide: ${slug.replace(/-/g, ' ')}`
            }
        ]);
    }

    // 7. Auto-discover from Topic Graph (excluding non-canonical /property/* and /buy/:slug)
    const graph = getGlobalTopicGraph();
    for (const node of graph.getAllNodes()) {
        if (node.type === 'property' || node.type === 'buy_page') continue;
        const categoryMap: Record<string, SitemapCategory> = {
            locality: 'locality',
            tech_park: 'landing',
            rent_page: 'rent',
            office_page: 'office',
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
