import { findPgLocationForArea } from '@/data/pgLocations';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import type { Property } from '@/types/api';

export interface HomeMosaicPhoto {
    url: string;
    alt: string;
    href: string;
}

export interface HomePgStats {
    count: number;
    minStartingPrice: number | null;
    medianStartingPrice: number | null;
    wifiCount: number;
    foodCount: number;
    lastUpdatedLabel: string | null;
}

export interface HomeInventorySummary {
    totalListings: number | null;
    pgCount: number | null;
    rentCount: number | null;
    areaCount: number | null;
    mosaicPhotos: HomeMosaicPhoto[];
    pgStats: HomePgStats | null;
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

function parseTimestampMs(raw?: string): number {
    if (!raw) return 0;
    const ms = new Date(raw).getTime();
    return Number.isFinite(ms) ? ms : 0;
}

function formatInrDate(ms: number): string | null {
    if (!Number.isFinite(ms) || ms <= 0) return null;
    try {
        return new Date(ms).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Kolkata',
        });
    } catch {
        return null;
    }
}

function extractPgStartingPrice(p: Property): number | null {
    const candidates = [p.starting_price, p.triple_price, p.double_price, p.single_price, p.private_price];
    for (const c of candidates) {
        if (typeof c === 'number' && Number.isFinite(c) && c > 0) return c;
    }
    if (typeof p.price === 'string') {
        const cleaned = parseFloat(p.price.replace(/[₹,\s]/g, ''));
        if (Number.isFinite(cleaned) && cleaned > 0) return cleaned;
    }
    return null;
}

/**
 * Computes real homepage intro stats, 2x2 verified listing mosaic photos,
 * and active PG pricing/amenity stats strictly from live API inventory.
 */
export function computeHomeInventorySummary(
    activeBangaloreItems: Property[],
    propertyCounts?: Record<string, number>,
    reportedAllTotal?: number,
): HomeInventorySummary {
    const active = activeBangaloreItems.filter((p) => p && p.is_available !== false);

    // Areas with at least one active listing (canonicalized so variants don't double-count)
    const areaKeys = new Set<string>();
    for (const p of active) {
        const loc = typeof p.location === 'string' ? p.location.trim() : '';
        if (!loc) continue;
        const rawHead = loc.split(',')[0].trim();
        if (rawHead.length <= 1) continue;
        const canonical = findPgLocationForArea(rawHead)?.name ?? rawHead;
        areaKeys.add(canonical.toLowerCase());
    }

    const totalListingsRaw = propertyCounts?.all ?? reportedAllTotal ?? active.length;
    const pgCountRaw =
        propertyCounts?.pg ?? active.filter((p) => p.category === 'pg' || p.type === 'PG').length;
    const rentCountRaw =
        propertyCounts?.rent ?? active.filter((p) => p.category === 'rent').length;

    // 4 newest verified listings with real cover photos (hide mosaic if fewer than 4)
    const verifiedSorted = active
        .filter((p) => Boolean(p.last_verified_at))
        .sort(
            (a, b) =>
                parseTimestampMs(b.last_verified_at || b.created_at) -
                parseTimestampMs(a.last_verified_at || a.created_at),
        );

    const mosaicPhotos: HomeMosaicPhoto[] = [];
    const seenUrls = new Set<string>();
    const seenIds = new Set<Property['id']>();
    for (const p of verifiedSorted) {
        if (mosaicPhotos.length >= 4) break;
        if (seenIds.has(p.id)) continue;
        const candidates = [...(Array.isArray(p.images) ? p.images : []), p.image];
        const validUrl = candidates.find((u): u is string => isRealListingPhoto(u) && !seenUrls.has(u));
        if (!validUrl) continue;
        seenUrls.add(validUrl);
        seenIds.add(p.id);
        const area = p.location?.split(',')[0]?.trim() || 'Bangalore';
        mosaicPhotos.push({
            url: validUrl,
            alt: `${p.title} in ${area}`,
            href: getPropertyDetailPath(p),
        });
    }

    // Active PG pricing + amenity coverage
    const activePgs = active.filter((p) => p.category === 'pg' || p.type === 'PG');
    const pgPrices = activePgs
        .map(extractPgStartingPrice)
        .filter((n): n is number => n !== null && n > 0)
        .sort((a, b) => a - b);

    let minStartingPrice: number | null = null;
    let medianStartingPrice: number | null = null;
    if (pgPrices.length > 0) {
        minStartingPrice = pgPrices[0];
        const mid = Math.floor(pgPrices.length / 2);
        medianStartingPrice =
            pgPrices.length % 2 === 1
                ? pgPrices[mid]
                : Math.round((pgPrices[mid - 1] + pgPrices[mid]) / 2);
    }

    let latestMs = 0;
    let wifiCount = 0;
    let foodCount = 0;
    for (const p of activePgs) {
        if (p.wifi) wifiCount += 1;
        if (p.food) foodCount += 1;
        const ms = Math.max(
            parseTimestampMs(p.last_verified_at),
            parseTimestampMs(p.updated_at),
            parseTimestampMs(p.created_at),
        );
        if (ms > latestMs) latestMs = ms;
    }

    const pgStats: HomePgStats | null =
        activePgs.length > 0
            ? {
                  count: activePgs.length,
                  minStartingPrice,
                  medianStartingPrice,
                  wifiCount,
                  foodCount,
                  lastUpdatedLabel: formatInrDate(latestMs),
              }
            : null;

    return {
        totalListings: totalListingsRaw > 0 ? totalListingsRaw : null,
        pgCount: pgCountRaw > 0 ? pgCountRaw : null,
        rentCount: rentCountRaw > 0 ? rentCountRaw : null,
        areaCount: areaKeys.size > 0 ? areaKeys.size : null,
        mosaicPhotos: mosaicPhotos.length >= 4 ? mosaicPhotos : [],
        pgStats,
    };
}
