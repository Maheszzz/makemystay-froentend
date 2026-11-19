import { findPgLocationForArea } from '@/data/pgLocations';
import { parsePropertyPriceInr } from '@/lib/listingPageUtils';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import type { Property } from '@/types/api';

export interface HomeMosaicPhoto {
    url: string;
    alt: string;
    href: string;
}

export interface HomePgStats {
    /** Count of active Bangalore PG listings with a valid positive starting price. */
    count: number;
    /** Total active Bangalore PG listings inspected. */
    totalActivePgs: number;
    minRentInr: number | null;
    medianRentInr: number | null;
    wifiCount: number;
    foodCount: number;
    lastUpdatedLabel: string;
}

export interface HomeInventorySummary {
    totalListings: number;
    pgCount: number;
    flatCount: number;
    areaCount: number;
    mosaicPhotos: HomeMosaicPhoto[];
    pgStats: HomePgStats | null;
    tokenEnabledCount: number;
}

function isRealListingPhoto(url: string | undefined): url is string {
    if (!url || !url.trim()) return false;
    const lower = url.toLowerCase();
    return (
        !lower.includes('images.unsplash.com') &&
        !lower.includes('default-property') &&
        !lower.includes('placeholder')
    );
}

function resolvePgStartingPriceInr(prop: Property): number | null {
    const candidates = [
        prop.starting_price,
        prop.triple_price,
        prop.double_price,
        prop.single_price,
        prop.private_price,
    ].filter((n): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0);
    if (candidates.length > 0) {
        return Math.min(...candidates);
    }
    return parsePropertyPriceInr(prop.price);
}

function formatDateEnIn(ms: number): string {
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    }).format(new Date(ms));
}

function timestampMs(raw: string | undefined): number {
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
}

/**
 * Computes real homepage intro, mosaic, and FAQ stats strictly from live API inventory.
 */
export function buildHomeInventorySummary(
    items: Property[],
    totalFromApi: number,
    propertyCounts?: Record<string, number>,
): HomeInventorySummary {
    const activeItems = items.filter((p) => p && p.is_available !== false);

    const totalListings =
        typeof propertyCounts?.all === 'number' && propertyCounts.all > 0
            ? propertyCounts.all
            : totalFromApi > 0
              ? totalFromApi
              : activeItems.length;

    const pgItems = activeItems.filter((p) => p.category === 'pg');
    const rentItems = activeItems.filter((p) => p.category === 'rent');

    const pgCount =
        typeof propertyCounts?.pg === 'number' && propertyCounts.pg > 0
            ? propertyCounts.pg
            : pgItems.length;

    const flatCount =
        typeof propertyCounts?.rent === 'number' && propertyCounts.rent > 0
            ? propertyCounts.rent
            : rentItems.length;

    const areaKeys = new Set<string>();
    for (const prop of activeItems) {
        const loc = typeof prop.location === 'string' ? prop.location.trim() : '';
        if (!loc) continue;
        const head = loc.split(',')[0].trim();
        if (head.length <= 1) continue;
        const canonical = findPgLocationForArea(head);
        areaKeys.add((canonical?.slug || canonical?.name || head).toLowerCase());
    }

    // 4 newest verified listings with distinct real cover photos
    const verifiedSorted = activeItems
        .filter((p) => Boolean(p.last_verified_at))
        .sort(
            (a, b) =>
                (timestampMs(b.last_verified_at) || timestampMs(b.created_at)) -
                (timestampMs(a.last_verified_at) || timestampMs(a.created_at)),
        );

    const mosaicPhotos: HomeMosaicPhoto[] = [];
    const usedUrls = new Set<string>();
    const usedIds = new Set<number | string>();
    for (const prop of verifiedSorted) {
        if (mosaicPhotos.length >= 4) break;
        if (usedIds.has(prop.id)) continue;
        const candidates = [
            ...(Array.isArray(prop.images) ? prop.images : []),
            prop.image,
        ];
        const validUrl = candidates.find(
            (u): u is string => isRealListingPhoto(u) && !usedUrls.has(u),
        );
        if (!validUrl) continue;
        usedUrls.add(validUrl);
        usedIds.add(prop.id);
        mosaicPhotos.push({
            url: validUrl,
            alt: `${prop.title} in ${prop.location || 'Bangalore'}`,
            href: getPropertyDetailPath(prop),
        });
    }

    // PG rent & amenity stats
    const pgPrices: number[] = [];
    let wifiCount = 0;
    let foodCount = 0;
    let latestUpdateMs = 0;

    for (const prop of pgItems) {
        const p = resolvePgStartingPriceInr(prop);
        if (p !== null && p > 0) pgPrices.push(p);
        if (prop.wifi) wifiCount += 1;
        if (prop.food) foodCount += 1;
        const t = Math.max(
            timestampMs(prop.last_verified_at),
            timestampMs(prop.updated_at),
            timestampMs(prop.created_at),
        );
        if (t > latestUpdateMs) latestUpdateMs = t;
    }

    pgPrices.sort((a, b) => a - b);
    const minRentInr = pgPrices.length > 0 ? pgPrices[0] : null;
    const medianRentInr =
        pgPrices.length > 0
            ? pgPrices.length % 2 === 1
                ? pgPrices[Math.floor(pgPrices.length / 2)]
                : Math.round(
                      (pgPrices[pgPrices.length / 2 - 1] + pgPrices[pgPrices.length / 2]) / 2,
                  )
            : null;

    const pgStats: HomePgStats | null =
        pgItems.length > 0
            ? {
                  count: pgPrices.length,
                  totalActivePgs: pgItems.length,
                  minRentInr,
                  medianRentInr,
                  wifiCount,
                  foodCount,
                  lastUpdatedLabel: formatDateEnIn(latestUpdateMs || Date.now()),
              }
            : null;

    const tokenEnabledCount = activeItems.filter((p) => p.token_amount != null).length;

    return {
        totalListings,
        pgCount,
        flatCount,
        areaCount: areaKeys.size,
        mosaicPhotos: mosaicPhotos.length >= 4 ? mosaicPhotos : [],
        pgStats,
        tokenEnabledCount,
    };
}
