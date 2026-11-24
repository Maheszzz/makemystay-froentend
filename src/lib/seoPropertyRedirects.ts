import pgLocations from '@/data/pg-locations.json';

/** Longest-first so `koramangala-4th-block` wins over `koramangala`. */
const PG_LOCALITY_SLUGS = [...pgLocations.map((r) => r.slug)].sort((a, b) => b.length - a.length);

/**
 * Static 301 Permanent Redirect map for known removed/renamed property URLs.
 * Populate this from your SEO audit CSV for Priority 1 & Priority 2 URLs.
 */
export const STATIC_301_REDIRECTS: Record<string, string> = {
    // Example old property / plot URLs
    '68-premium-residential-plot-upcoming-development-area-bangalore': '/properties/bangalore',
    'pro4-laavish': '/pg/bangalore',
    'silver-storm': '/pg/whitefield',
    'pg-for-boys-in-magadi-road': '/pg/rajajinagar',
};

/**
 * Static 410 Gone set for truly deleted/invalid URLs.
 * Populate this from your SEO audit CSV for Priority 4 removed pages.
 */
export const STATIC_410_GONE_PATHS: Set<string> = new Set([
    '/rent/undefined',
    '/undefined',
    // Dead URLs from Google Search Console — 404 audit (Nov 2026)
    '/pg/7-hills-1rk-marathahalli-bangalore',
    '/pg/baner',
    '/pg/bilekahalli-under-15000',
    '/pg/kharadi',
    '/pg/madhapur',
    '/pg/madhapur-under-10000',
    '/pg/munnekolala',
    '/pg/nagawara-under-10000',
    '/pg/sgr-enclave',
    '/pg/urban-living',
    '/pg-for-boys-in-baner',
    '/pg-for-boys-in-mysore-road',
    '/pg-for-boys-in-nayandahalli',
    '/pg-for-girls-in-hebbal-kempapura',
    '/pg-for-girls-in-hinjewadi',
    '/pg-for-girls-in-hitech-city',
    '/pg-for-girls-in-kaikondrahalli',
    '/pg-for-girls-in-koramangala-4th-block',
    '/pg-for-girls-in-madhapur',
    '/pg-for-girls-in-mysore-road',
    '/pg-for-girls-in-richmond-town',
    '/pg-for-girls-in-tumkur-road',
    '/pg-for-girls-in-wakad',
    '/pg-in-madhapur-under-10000',
    '/rent/cv raman nagar',
    '/rent/cv%20raman%20nagar',
]);

/**
 * Infer `/pg/{locality}` hub from a property slug segment (e.g. `202-foo-pg-marathahalli`).
 */
export function inferPgLocalityHubFromPropertySlug(slugParam: string | undefined): string | null {
    if (!slugParam) return null;
    const tail = slugParam.replace(/^\d+-/, '').toLowerCase();
    if (!tail) return null;
    for (const locSlug of PG_LOCALITY_SLUGS) {
        if (tail.includes(locSlug)) {
            return `/pg/${locSlug}`;
        }
    }
    return null;
}

/** Static 301 map for known removed listings (extend as needed). */
export function getStaticPgPropertyRedirect(slugParam: string): string | null {
    const key = slugParam.toLowerCase();
    return STATIC_301_REDIRECTS[key] ?? null;
}

/**
 * Smart redirect resolver for missing or removed properties.
 * Returns a 301 replacement destination ONLY when there is a clear equivalent replacement
 * (e.g. same property moved, category renamed, or explicit map entry).
 * Returns `null` if no meaningful replacement exists, allowing 410 Gone / 404 handling.
 */
export function resolveMissingPropertyRedirect(
    _category: 'pg' | 'rent' | 'property' | 'properties',
    slugParam: string
): string | null {
    const key = (slugParam || '').toLowerCase().trim();

    // 1. Check explicit static 301 map (e.g., property moved, category renamed, locality renamed)
    const explicit = STATIC_301_REDIRECTS[key];
    if (explicit) return explicit;

    // 2. We do NOT automatically redirect missing properties to broad city hubs (/properties/bangalore)
    // to avoid soft 404s. If no explicit replacement exists, return null so the system
    // can return 410 Gone (if in STATIC_410_GONE_PATHS) or 404 Not Found.
    return null;
}

