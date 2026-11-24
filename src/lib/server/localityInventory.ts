import type { Metadata } from 'next';
import { getLocalityBySlug } from '@/data/localities';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import { SITE_URL } from '@/lib/siteConfig';
import { computePgLocalityStats, type PgLocalityStats } from '@/lib/listingInventoryStats';

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

export type LocalityInventoryCategory = 'pg' | 'rent';

export interface SitemapLocalityTarget {
    slug: string;
    category: LocalityInventoryCategory;
}

/**
 * Resolves a URL locality slug (e.g. "hsr-layout", "btm") to the canonical human-readable
 * locality name (e.g. "HSR Layout", "BTM Layout") expected by the backend `city` filter.
 */
export function resolveLocalityQueryCity(citySlug: string): string {
    const raw = (citySlug || '').trim().toLowerCase();
    if (!raw) return '';
    const canonicalSlug = resolveLegacyPgSlug(raw) ?? raw;
    const loc = getPgLocationBySlug(canonicalSlug) ?? getLocalityBySlug(canonicalSlug) ?? getLocalityBySlug(raw);
    return loc?.name ?? canonicalSlug.replace(/-/g, ' ');
}

/**
 * Single source of truth for whether a locality has active inventory in the backend API.
 * Used by both `routeMetadata.ts` (for page `noindex`) and `sitemap.ts` (for sitemap inclusion).
 */
export async function hasLocalityInventory(
    citySlug: string,
    category: LocalityInventoryCategory = 'pg',
): Promise<boolean> {
    const queryCity = resolveLocalityQueryCity(citySlug);
    if (!queryCity) return false;
    const { items } = await fetchPropertiesServer({
        category,
        city: queryCity,
        is_available: true,
        limit: 1,
    });
    return items.length > 0;
}

/**
 * Shared metadata helper: adds `robots: { index: false, follow: true }` when a locality has 0 available listings.
 */
export async function applyNoindexIfEmptyLocality(
    meta: Metadata,
    citySlug: string,
    category: LocalityInventoryCategory = 'pg',
): Promise<Metadata> {
    const hasInventory = await hasLocalityInventory(citySlug, category);
    if (!hasInventory) {
        return {
            ...meta,
            robots: { index: false, follow: true },
        };
    }
    return meta;
}

/**
 * Extracts `{ slug, category }` if a sitemap URL is a locality page (`/pg/:slug`, `/rent/:slug`, `/pg-for-*-in-:slug`).
 * Returns `null` for non-locality URLs (home, city hubs, blogs, tech parks, etc.).
 */
export function extractSitemapLocalityTarget(url: string): SitemapLocalityTarget | null {
    const path = url.replace(SITE_URL, '');

    const pgMatch = path.match(/^\/pg\/([^/]+)$/);
    if (pgMatch) {
        const raw = pgMatch[1].toLowerCase();
        if (NON_LOCALITY_PG_SLUGS.has(raw) || /^\d+(-|$)/.test(raw)) return null;
        const slug = resolveLegacyPgSlug(raw) ?? raw;
        return { slug, category: 'pg' };
    }

    const rentMatch = path.match(/^\/rent\/([^/]+)$/);
    if (rentMatch) {
        const raw = rentMatch[1].toLowerCase();
        if (CITY_SLUGS.has(raw) || /^\d+(-|$)/.test(raw)) return null;
        const slug = resolveLegacyPgSlug(raw) ?? raw;
        return { slug, category: 'rent' };
    }

    const genderMatch = path.match(/^\/pg-for-(?:boys|girls|men|women)-in(?:-|\/)([^/]+)$/);
    if (genderMatch) {
        const raw = genderMatch[1].toLowerCase();
        const slug = resolveLegacyPgSlug(raw) ?? raw;
        return { slug, category: 'pg' };
    }

    return null;
}

/**
 * Evaluates active inventory for a set of locality targets using `hasLocalityInventory` in bounded concurrency batches.
 * Returns a Set of `"${category}:${slug}"` keys that have >= 1 available listing.
 */
export async function resolveActiveLocalityKeys(
    targets: SitemapLocalityTarget[],
    concurrency = 6,
): Promise<Set<string>> {
    const uniqueKeys = Array.from(new Set(targets.map((t) => `${t.category}:${t.slug}`)));
    const activeKeys = new Set<string>();

    for (let i = 0; i < uniqueKeys.length; i += concurrency) {
        const batch = uniqueKeys.slice(i, i + concurrency);
        const results = await Promise.all(
            batch.map(async (key) => {
                const [category, slug] = key.split(':') as [LocalityInventoryCategory, string];
                const active = await hasLocalityInventory(slug, category);
                return { key, active };
            }),
        );
        for (const { key, active } of results) {
            if (active) activeKeys.add(key);
        }
    }

    return activeKeys;
}

/**
 * Fetch live PG stats (count, lowest price, sharing ranges) for a locality.
 * Returns null on API failure so callers can fall back to static copy.
 */
export async function fetchPgLocalityStats(citySlug: string): Promise<PgLocalityStats | null> {
    const queryCity = resolveLocalityQueryCity(citySlug);
    if (!queryCity) return null;
    try {
        const { items, total } = await fetchPropertiesServer({
            category: 'pg',
            city: queryCity,
            is_available: true,
            limit: 100,
            sort_by: 'newest',
        });
        return computePgLocalityStats(items, total);
    } catch {
        return null;
    }
}
