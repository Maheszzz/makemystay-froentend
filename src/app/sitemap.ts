import type { MetadataRoute } from 'next';
import { SEO_LOCALITIES } from '@/data/localities';
import { findPgLocationForArea, PG_LOCATIONS } from '@/data/pgLocations';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import { SITE_URL } from '@/lib/siteConfig';
import { getAppRouterSitemap } from '@/lib/sitemap';
import type { Property } from '@/types/api';

export const revalidate = 3600;

const CITY_SLUGS = new Set(['bangalore', 'hyderabad', 'pune']);
const NON_LOCALITY_PG_SLUGS = new Set([
    'bangalore',
    'hyderabad',
    'pune',
    'pg-with-wifi',
    'pg-with-food',
    'pg-with-ac',
    'pg-vs-flat-bangalore',
]);

function extractLocalitySlugFromUrl(url: string): string | null {
    const path = url.replace(SITE_URL, '');
    const pgMatch = path.match(/^\/pg\/([^/]+)$/);
    if (pgMatch) {
        const slug = pgMatch[1].toLowerCase();
        if (NON_LOCALITY_PG_SLUGS.has(slug) || /^\d+(-|$)/.test(slug)) return null;
        return slug;
    }
    const rentMatch = path.match(/^\/rent\/([^/]+)$/);
    if (rentMatch) {
        const slug = rentMatch[1].toLowerCase();
        if (CITY_SLUGS.has(slug) || /^\d+(-|$)/.test(slug)) return null;
        return slug;
    }
    const genderMatch = path.match(/^\/pg-for-(?:boys|girls|men|women)-in-([^/]+)$/);
    if (genderMatch) {
        return genderMatch[1].toLowerCase();
    }
    return null;
}

function buildActiveLocalitySlugs(properties: Property[]): Set<string> {
    const active = new Set<string>();
    const allKnownLocalities = [
        ...PG_LOCATIONS.map((l) => ({ slug: l.slug.toLowerCase(), name: l.name.toLowerCase() })),
        ...SEO_LOCALITIES.map((l) => ({ slug: l.slug.toLowerCase(), name: l.name.toLowerCase() })),
    ];

    for (const prop of properties) {
        const matched = findPgLocationForArea(prop.location);
        if (matched) active.add(matched.slug.toLowerCase());

        const haystack = `${prop.location || ''} ${prop.title || ''} ${prop.slug || ''}`.toLowerCase();
        for (const loc of allKnownLocalities) {
            const slugWords = loc.slug.replace(/-/g, ' ');
            if (
                (loc.name && haystack.includes(loc.name)) ||
                (slugWords && haystack.includes(slugWords))
            ) {
                active.add(loc.slug);
            }
        }
    }
    return active;
}

/**
 * Next.js App Router Dynamic Sitemap (single source of truth for /sitemap.xml).
 * Throws on API error so ISR preserves the last valid cached sitemap instead of caching an incomplete one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const limit = 100;
    let skip = 0;
    let total = Infinity;
    const availableProperties: Property[] = [];

    while (skip < total) {
        const { items: pageItems, total: apiTotal } = await fetchPropertiesServer({
            skip,
            limit,
            is_available: true,
            sort_by: 'review_count_desc',
        });
        total = apiTotal;
        for (const prop of pageItems) {
            if (!prop || !prop.id || prop.is_available === false) continue;
            availableProperties.push(prop);
        }
        if (pageItems.length === 0) break;
        skip += pageItems.length;
    }

    const activeLocalitySlugs = buildActiveLocalitySlugs(availableProperties);
    const baseItems = getAppRouterSitemap().filter((item) => {
        const localitySlug = extractLocalitySlugFromUrl(item.url);
        if (!localitySlug) return true;
        return activeLocalitySlugs.has(localitySlug);
    });

    const seen = new Set<string>(baseItems.map((item) => item.url));
    const entries: MetadataRoute.Sitemap = baseItems.map((item) => ({
        url: item.url,
        ...(item.lastModified ? { lastModified: item.lastModified } : {}),
        changeFrequency: item.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: item.priority,
    }));

    for (const prop of availableProperties) {
        const detailPath = getPropertyDetailPath(prop);
        const loc = `${SITE_URL}${detailPath}`;
        if (seen.has(loc)) continue;
        seen.add(loc);

        const parsedDate = prop.updated_at ? new Date(prop.updated_at) : null;
        const lastModified =
            parsedDate && !Number.isNaN(parsedDate.getTime())
                ? parsedDate.toISOString().split('T')[0]
                : undefined;

        entries.push({
            url: loc,
            ...(lastModified ? { lastModified } : {}),
            changeFrequency: 'daily',
            priority: 0.88,
        });
    }

    return entries;
}
