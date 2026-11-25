import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';
import { LEGACY_PG_SLUG_REDIRECTS, PG_LOCATIONS } from '@/data/pgLocations';
import { BLOG_POSTS } from '@/data/blogPosts';
import { OFFICES } from '@/data/offices';
import { TECH_PARKS } from '@/data/techParks';
import { STATIC_410_GONE_PATHS } from '@/lib/seoPropertyRedirects';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';

export const revalidate = 3600; // Revalidate every hour

const base = SITE_URL.replace(/\/+$/, '');

const DISALLOWED_PREFIXES = [
    '/_next/',
    '/api/',
    '/admin',
    '/login',
    '/quick-pay',
    '/wishlist',
    '/schedule-demo',
];

function isValidSitemapPath(rawPath: string): boolean {
    if (!rawPath || !rawPath.startsWith('/')) return false;
    // Exclude query parameters, fragments, spaces, and percent-encoded spaces
    if (/[?#=\s]/.test(rawPath) || /%20/i.test(rawPath)) return false;

    const clean = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
    const lower = clean.toLowerCase();
    let decoded = lower;
    try {
        decoded = decodeURIComponent(lower);
    } catch {
        return false;
    }

    if (/\s/.test(decoded)) return false;

    // Exclude all 410 Gone paths
    if (
        STATIC_410_GONE_PATHS.has(rawPath) ||
        STATIC_410_GONE_PATHS.has(clean) ||
        STATIC_410_GONE_PATHS.has(lower) ||
        STATIC_410_GONE_PATHS.has(decoded)
    ) {
        return false;
    }

    // Exclude internal/private/non-canonical prefixes
    if (DISALLOWED_PREFIXES.some((prefix) => lower.startsWith(prefix))) return false;
    if (lower.startsWith('/pg-in-')) return false;

    return true;
}

/** Hyderabad / Pune localities in PG_LOCATIONS (their hub pages stay in the sitemap). */
const NON_BANGALORE_LOCALITY_SLUGS = new Set(['hafeezpet', 'gachibowli', 'nanakramguda', 'kondapur', 'viman-nagar']);

const TOP_BHK_LOCALITIES = [
    'whitefield',
    'marathahalli',
    'bellandur',
    'hsr-layout',
    'koramangala',
    'btm',
    'electronic-city',
    'indiranagar',
    'sarjapur-road',
    'hebbal',
    'jp-nagar',
    'jayanagar',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const seen = new Set<string>();
    const entries: MetadataRoute.Sitemap = [];

    const add = (
        path: string,
        changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: number,
        lastModified?: string,
    ) => {
        if (!isValidSitemapPath(path)) return;
        const normalized = path === '/' ? '/' : path.replace(/\/+$/, '');
        const url = normalized === '/' ? `${base}/` : `${base}${normalized}`;
        if (seen.has(url)) return;
        seen.add(url);
        // Only emit lastmod when we have a real date; a build-date lastmod on every URL is ignored by Google
        entries.push(lastModified ? { url, lastModified, changeFrequency, priority } : { url, changeFrequency, priority });
    };

    // 1. Core static & hub pages (all verified 200 canonical routes)
    add('/', 'daily', 1.0);
    add('/pg', 'daily', 0.95);
    add('/rent', 'daily', 0.95);
    add('/properties', 'daily', 0.9);
    add('/buy', 'weekly', 0.8);
    add('/plots', 'weekly', 0.8);
    add('/pg/bangalore', 'daily', 0.95);
    add('/pg/hyderabad', 'daily', 0.85);
    add('/pg/pune', 'daily', 0.85);
    add('/rent/bangalore', 'daily', 0.95);
    add('/rent/hyderabad', 'daily', 0.85);
    add('/rent/pune', 'daily', 0.85);
    add('/buy/in/bangalore', 'weekly', 0.8);
    add('/plots/in/bangalore', 'weekly', 0.8);

    // 2. Category & feature landing pages
    add('/1bhk', 'daily', 0.9);
    add('/2bhk', 'daily', 0.9);
    add('/1rk-for-rent', 'daily', 0.85);
    add('/apartment-for-rent', 'daily', 0.85);
    add('/service-apartment-for-rent', 'weekly', 0.8);
    add('/flats-in-bangalore', 'weekly', 0.85);
    add('/pg-vs-flat-bangalore', 'monthly', 0.75);
    add('/pg-for-boys', 'daily', 0.85);
    add('/pg-for-girls', 'daily', 0.85);
    add('/pg-with-wifi', 'weekly', 0.8);
    add('/pg-with-food', 'weekly', 0.8);
    add('/pg-with-ac', 'weekly', 0.8);
    add('/pg-near-me', 'weekly', 0.8);
    add('/pg-nearby', 'weekly', 0.8);
    add('/pg-single-room', 'weekly', 0.8);

    // 3. Locality PG, Rent, and Gender hubs (from PG_LOCATIONS, excluding legacy redirects & 410 list)
    for (const loc of PG_LOCATIONS) {
        if (LEGACY_PG_SLUG_REDIRECTS[loc.slug]) continue;
        // Boys/girls hubs for Hyderabad/Pune localities are thin duplicates of /pg/{slug}
        const genderHubs = !NON_BANGALORE_LOCALITY_SLUGS.has(loc.slug);
        add(`/pg/${loc.slug}`, 'daily', 0.88);
        add(`/rent/${loc.slug}`, 'daily', 0.85);
        if (genderHubs) {
            add(`/pg-for-boys-in-${loc.slug}`, 'weekly', 0.8);
            add(`/pg-for-girls-in-${loc.slug}`, 'weekly', 0.8);
        }
    }

    // 4. BHK locality pages (/1bhk/[slug], /2bhk/[slug], /3bhk/[slug])
    const validLocSlugs = new Set(PG_LOCATIONS.map((l) => l.slug));
    for (const slug of TOP_BHK_LOCALITIES) {
        if (!validLocSlugs.has(slug)) continue;
        add(`/1bhk/${slug}`, 'daily', 0.85);
        add(`/2bhk/${slug}`, 'daily', 0.85);
        add(`/3bhk/${slug}`, 'weekly', 0.8);
    }

    // 5. Tech park & office pages
    for (const tp of TECH_PARKS) {
        if (tp.path) add(`/${tp.path.replace(/^\/+/, '')}`, 'weekly', 0.8);
    }
    for (const off of OFFICES) {
        if (off.slug) add(`/office/${off.slug}`, 'weekly', 0.75);
    }

    // 6. Blog posts
    add('/blog', 'weekly', 0.8);
    for (const post of BLOG_POSTS) {
        if (post.slug) add(`/blog/${post.slug}`, 'monthly', 0.8, post.updatedAt);
    }

    // 7. Static informational pages
    add('/about', 'monthly', 0.6);
    add('/contact-us', 'monthly', 0.6);
    add('/faq', 'monthly', 0.7);
    add('/how-we-verify', 'monthly', 0.7);
    add('/for-owners', 'monthly', 0.7);
    add('/research', 'monthly', 0.7);
    add('/reports', 'monthly', 0.7);
    add('/statistics', 'monthly', 0.7);

    // 8. Dynamic individual listings from database/API -> canonical /property/[slug]
    try {
        const first = await fetchPropertiesServer({ is_available: true, limit: 500, skip: 0 }, 8000);
        const allItems = [...first.items];
        let skip = first.items.length;
        while (first.total > allItems.length && skip < first.total && skip < 2000) {
            const nextBatch = await fetchPropertiesServer(
                { is_available: true, limit: 500, skip },
                8000,
            );
            if (nextBatch.items.length === 0) break;
            allItems.push(...nextBatch.items);
            skip += nextBatch.items.length;
        }
        for (const prop of allItems) {
            if (prop.is_available === false) continue;
            const detailPath = getPropertyDetailPath(prop);
            if (detailPath.startsWith('/property/')) {
                const updated = (prop as { updated_at?: string }).updated_at;
                add(detailPath, 'daily', 0.85, updated ? new Date(updated).toISOString().split('T')[0] : undefined);
            }
        }
    } catch {
        // Non-fatal during offline builds: static & locality routes still populate sitemap
    }

    return entries;
}
