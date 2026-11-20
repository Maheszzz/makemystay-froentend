import { findPgLocationForArea } from '@/data/pgLocations';
import { api } from '@/lib/api/client';
import {
    REALTY_PATH,
    mapRealtyToProperty,
    normalizePropertyListResponse,
    propertyApi,
} from '@/lib/api/properties';
import { parsePropertyPriceInr } from '@/lib/listingPageUtils';
import {
    propertyMatchesPgFeatureFilters,
    propertyMatchesPgGenderFilter,
    type PgGenderFilter,
} from '@/lib/propertySeoUtils';
import type { Property, RealtyProperty } from '@/types/api';

/**
 * Curated 16 PG / Coliving / Studio listings for the MakeMyStay.ai PG listing page,
 * mapped to verified database property IDs in exact display order.
 *
 *  1. 372 - Liv colive ("Liv Colive")
 *  2. 215 - Halo coliving pg ("Halo Coliving Pg")
 *  3. 249 - Slink INN Coliving PG ("Slink Inn Coliving Pg")
 *  4. 188 - We Live coliving pg ("We Live Coliving Pg")
 *  5.  96 - Signature Luxury Colive ("Signature Luxury Colive")
 *  6.  77 - Cherry Blossom ("Cherry Blossom")
 *  7. 275 - Hive Coliving ("Hive Coliving")
 *  8. 153 - Orchid House ("Orchid House")
 *  9. 218 - Eden premium studio rooms and eden premium Coliving pg
 * 10. 103 - Flux Coliving ("Flux Coliving")
 * 11.  95 - Vow Coliving ("Vow Coliving")
 * 12. 106 - Cozy Ladies PG ("Cozy Ladies Pg")
 * 13. 107 - Cozy Rooms Gents PG ("Cozy Rooms Gents Pg")
 * 14. 143 - Cozy Homes ("Cozy Homes")
 * 15. 104 - Orion Coliving ("Orion Coliving")
 * 16. 381 - Karthikey studio apartments ("Karthikey Studio Apartments")
 */
export const CURATED_PG_PROPERTY_IDS: readonly number[] = [
    372,
    215,
    249,
    188,
    96,
    77,
    275,
    153,
    218,
    103,
    95,
    106,
    107,
    143,
    104,
    381,
] as const;

const CURATED_PG_RANK = new Map<number, number>(
    CURATED_PG_PROPERTY_IDS.map((id, idx) => [id, idx]),
);

/**
 * Returns the 16 curated PG properties pinned at the top in exact `CURATED_PG_PROPERTY_IDS` order,
 * followed by all remaining PG properties (deduplicated, preserving API order).
 */
export function mergeCuratedFirstPgProperties(allProperties: Property[]): Property[] {
    const byId = new Map<number, Property>();
    for (const prop of allProperties) {
        if (!prop || prop.id == null) continue;
        const numId = Number(prop.id);
        if (!Number.isFinite(numId)) continue;
        if (!byId.has(numId)) {
            byId.set(numId, prop);
        }
    }

    const priority: Property[] = [];
    for (const id of CURATED_PG_PROPERTY_IDS) {
        const match = byId.get(id);
        if (match) priority.push(match);
    }

    const remaining: Property[] = [];
    const seenRemaining = new Set<number>();
    for (const prop of allProperties) {
        if (!prop || prop.id == null) continue;
        const numId = Number(prop.id);
        if (!Number.isFinite(numId) || CURATED_PG_RANK.has(numId) || seenRemaining.has(numId)) continue;
        const cat = (prop.category || '').toLowerCase();
        const pt = (prop.type || '').toLowerCase();
        if (cat === 'pg' || pt === 'pg' || pt === 'hostel' || pt === 'co-living') {
            seenRemaining.add(numId);
            remaining.push(prop);
        }
    }

    return [...priority, ...remaining];
}

/**
 * Selects only the 16 curated properties from a list of API records,
 * deduplicated by ID and ordered strictly according to `CURATED_PG_PROPERTY_IDS`.
 */
export function selectCuratedPgProperties(allProperties: Property[]): Property[] {
    return mergeCuratedFirstPgProperties(allProperties).filter((p) =>
        CURATED_PG_RANK.has(Number(p.id)),
    );
}

export interface CuratedPgFilterOptions {
    searchQuery?: string;
    area?: string;
    minPrice?: string;
    maxPrice?: string;
    priceTier?: string | null;
    genderFilter?: PgGenderFilter;
    sharingFilter?: string;
    furnishingFilter?: string;
    typeFilter?: string;
    wifiOn?: boolean;
    foodOn?: boolean;
    acOn?: boolean;
}

function normalizeAreaToken(raw: string): string {
    return raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function propertyMatchesSearch(property: Property, query: string): boolean {
    const raw = query.trim().toLowerCase();
    if (!raw) return true;

    const haystack = [
        property.title,
        property.location,
        property.city,
        property.description,
        property.type,
        property.slug,
        ...(property.features ?? []),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const commaParts = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    if (commaParts.length > 1) {
        return commaParts.some((part) => haystack.includes(part));
    }

    if (haystack.includes(raw)) return true;

    const words = raw.split(/\s+/).filter(Boolean);
    return words.length > 1 && words.every((w) => haystack.includes(w));
}

function propertyMatchesArea(property: Property, area: string): boolean {
    const normFilter = normalizeAreaToken(area);
    if (!normFilter || normFilter === 'all' || normFilter === 'bangalore' || normFilter === 'bengaluru') {
        return true;
    }

    const canonicalFilter = findPgLocationForArea(area)?.name;
    const loc = typeof property.location === 'string' ? property.location : '';
    const city = typeof property.city === 'string' ? property.city : '';
    const normLoc = normalizeAreaToken(loc);
    const normCity = normalizeAreaToken(city);
    const locHead = loc.split(',')[0]?.trim() || '';
    const canonicalLoc = locHead ? findPgLocationForArea(locHead)?.name : undefined;

    if (canonicalFilter && canonicalLoc && canonicalFilter.toLowerCase() === canonicalLoc.toLowerCase()) {
        return true;
    }
    if (normLoc.includes(normFilter) || normCity.includes(normFilter)) {
        return true;
    }
    if (canonicalFilter && normLoc.includes(normalizeAreaToken(canonicalFilter))) {
        return true;
    }
    return false;
}

/**
 * Filters within the curated 16 PG properties using all UI filters
 * without re-introducing excluded listings or dropping non-PG-typed curated items (e.g. Cozy Homes / Studio).
 */
export function filterCuratedPgProperties(
    properties: Property[],
    filters: CuratedPgFilterOptions,
): Property[] {
    const {
        searchQuery = '',
        area = '',
        minPrice = '',
        maxPrice = '',
        priceTier = null,
        genderFilter,
        sharingFilter = '',
        furnishingFilter = '',
        typeFilter = 'all',
        wifiOn = false,
        foodOn = false,
        acOn = false,
    } = filters;

    let minInr = minPrice ? parseFloat(minPrice) : undefined;
    let maxInr = maxPrice ? parseFloat(maxPrice) : undefined;
    if (minInr === undefined && maxInr === undefined && priceTier) {
        if (priceTier === 'low') maxInr = 12000;
        else if (priceTier === 'mid') {
            minInr = 8000;
            maxInr = 16000;
        } else if (priceTier === 'high') {
            minInr = 14000;
        }
    }

    const hasMin = typeof minInr === 'number' && Number.isFinite(minInr) && minInr > 0;
    const hasMax = typeof maxInr === 'number' && Number.isFinite(maxInr) && maxInr > 0;

    return properties.filter((p) => {
        if (!p) return false;

        if (searchQuery.trim() && !propertyMatchesSearch(p, searchQuery)) {
            return false;
        }

        if (area && !propertyMatchesArea(p, area)) {
            return false;
        }

        if (hasMin || hasMax) {
            const priceInr = parsePropertyPriceInr(p.price);
            if (priceInr == null) return false;
            if (hasMin && priceInr < (minInr as number)) return false;
            if (hasMax && priceInr > (maxInr as number)) return false;
        }

        if ((wifiOn || foodOn || acOn) && !propertyMatchesPgFeatureFilters(p, { wifi: wifiOn, food: foodOn, ac: acOn })) {
            return false;
        }

        if (genderFilter && !propertyMatchesPgGenderFilter(p, genderFilter)) {
            return false;
        }

        if (sharingFilter) {
            const target = sharingFilter.trim().toLowerCase();
            if (!Array.isArray(p.sharing) || !p.sharing.some((s) => s.trim().toLowerCase() === target)) {
                return false;
            }
        }

        if (furnishingFilter) {
            const target = furnishingFilter.trim().toLowerCase();
            if ((p.furnishing || '').trim().toLowerCase() !== target) {
                return false;
            }
        }

        if (typeFilter && typeFilter !== 'all') {
            const pt = (p.type || '').toUpperCase().trim();
            const target = typeFilter.toUpperCase().trim();
            if (pt !== target) return false;
        }

        return true;
    });
}

/**
 * Sorts curated-first PG properties:
 * - Default ('newest'): keeps the 16 priority properties pinned at top in exact 1-16 order,
 *   followed by remaining PG properties in their API order.
 * - 'price_asc' / 'price_desc': sorts all matching PG properties by price, breaking ties by priority rank.
 */
export function sortCuratedPgProperties(
    properties: Property[],
    sortBy: 'newest' | 'price_asc' | 'price_desc',
): Property[] {
    const list = [...properties];
    const rankOf = (p: Property) => CURATED_PG_RANK.get(Number(p.id)) ?? 999;

    if (sortBy === 'price_asc') {
        return list.sort((a, b) => {
            const pa = parsePropertyPriceInr(a.price);
            const pb = parsePropertyPriceInr(b.price);
            if (pa == null && pb == null) return rankOf(a) - rankOf(b);
            if (pa == null) return 1;
            if (pb == null) return -1;
            return pa - pb || rankOf(a) - rankOf(b);
        });
    }

    if (sortBy === 'price_desc') {
        return list.sort((a, b) => {
            const pa = parsePropertyPriceInr(a.price);
            const pb = parsePropertyPriceInr(b.price);
            if (pa == null && pb == null) return rankOf(a) - rankOf(b);
            if (pa == null) return 1;
            if (pb == null) return -1;
            return pb - pa || rankOf(a) - rankOf(b);
        });
    }

    const priority: Property[] = [];
    const remaining: Property[] = [];
    for (const p of list) {
        if (CURATED_PG_RANK.has(Number(p.id))) priority.push(p);
        else remaining.push(p);
    }
    priority.sort((a, b) => rankOf(a) - rankOf(b));
    return [...priority, ...remaining];
}

export function deriveCuratedPgAreas(properties: Property[]): {
    areas: string[];
    areaCounts: { name: string; count: number; slug?: string }[];
    stats: { total: number; withVerifiedDate: number };
} {
    const countMap = new Map<string, { name: string; count: number; slug?: string }>();
    const stats = { total: 0, withVerifiedDate: 0 };

    for (const p of properties) {
        if (!p || p.is_available === false) continue;
        stats.total += 1;
        if (p.last_verified_at) stats.withVerifiedDate += 1;

        const loc = typeof p.location === 'string' ? p.location.trim() : '';
        if (!loc) continue;
        const rawHead = loc.split(',')[0].trim();
        if (rawHead.length <= 1) continue;

        const canonical = findPgLocationForArea(rawHead);
        const displayName = canonical?.name ?? rawHead;
        const key = displayName.toLowerCase();
        const existing = countMap.get(key);
        if (existing) {
            existing.count += 1;
        } else {
            countMap.set(key, {
                name: displayName,
                count: 1,
                slug: canonical?.slug,
            });
        }
    }

    const areaCounts = Array.from(countMap.values())
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'en-IN'));

    const areas = areaCounts.map((a) => a.name).sort((a, b) => a.localeCompare(b, 'en-IN'));
    return { areas, areaCounts, stats };
}

/**
 * Client-side fetcher for the PG listing page:
 * Fetches Bangalore inventory (without narrow `category=pg` filter so curated studio/home stays
 * IDs 143 and 381 are included alongside all remaining PGs), ensures any missing curated IDs
 * are fetched individually, and returns the 16 priority properties first followed by all remaining PGs.
 */
export async function fetchCuratedPgPropertiesClient(): Promise<{
    items: Property[];
    total: number;
    propertyCounts?: Record<string, number>;
}> {
    const queryParams = new URLSearchParams({
        city: 'bangalore',
        is_available: 'true',
        limit: '500',
        skip: '0',
        sort_by: 'newest',
    });

    const response = await api.get<unknown>(REALTY_PATH, {
        params: queryParams,
        timeout: 45000,
    });

    const { rows, total } = normalizePropertyListResponse(response);
    const propertyCountsRaw =
        !Array.isArray(response) &&
        response &&
        typeof response === 'object' &&
        (response as Record<string, unknown>).property_counts &&
        typeof (response as Record<string, unknown>).property_counts === 'object'
            ? { ...((response as Record<string, unknown>).property_counts as Record<string, number>) }
            : undefined;

    const mapped: Property[] = [];
    for (const row of rows) {
        try {
            mapped.push(mapRealtyToProperty(row as RealtyProperty));
        } catch {
            // Skip malformed rows
        }
    }

    // Paginate if backend inventory exceeds 500 items
    let skip = rows.length;
    while (total > mapped.length && skip < total && skip < 2000) {
        const nextPage = await propertyApi.getAll({
            city: 'bangalore',
            is_available: true,
            limit: 500,
            skip,
            sort_by: 'newest',
        });
        if (nextPage.items.length === 0) break;
        mapped.push(...nextPage.items);
        skip += nextPage.items.length;
    }

    // Fetch any missing curated IDs individually (e.g. if outside city query)
    const foundIds = new Set(mapped.map((p) => Number(p.id)));
    const missingIds = CURATED_PG_PROPERTY_IDS.filter((id) => !foundIds.has(id));
    if (missingIds.length > 0) {
        const extras = await Promise.allSettled(missingIds.map((id) => propertyApi.getById(id)));
        for (const res of extras) {
            if (res.status === 'fulfilled' && res.value) {
                mapped.push(res.value);
            }
        }
    }

    const items = mergeCuratedFirstPgProperties(mapped);
    const propertyCounts = propertyCountsRaw
        ? { ...propertyCountsRaw, pg: items.length }
        : { pg: items.length };

    return {
        items,
        total: items.length,
        propertyCounts,
    };
}
