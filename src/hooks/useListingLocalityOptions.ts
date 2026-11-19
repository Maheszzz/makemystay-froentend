import { useState, useEffect } from 'react';
import { propertyApi } from '@/lib/api';
import { findPgLocationForArea } from '@/data/pgLocations';
import { getRealImages } from '@/lib/listingCardData';
import type { Property } from '@/types/api';

export interface AreaInventoryCount {
    name: string;
    count: number;
    slug?: string;
    /** Real cover photo of the newest listing in this area (absent when that listing has no photo). */
    coverImage?: string;
}

/** Coverage of real data across the fetched inventory (used to keep hero claims truthful). */
export interface ListingInventoryStats {
    total: number;
    withVerifiedDate: number;
}

interface LocalityAggregate {
    areas: string[];
    areaCounts: AreaInventoryCount[];
    stats: ListingInventoryStats;
}

const localityCache = new Map<string, LocalityAggregate>();

function createdAtMs(p: Property): number {
    const t = p.created_at ? new Date(p.created_at).getTime() : NaN;
    return Number.isNaN(t) ? 0 : t;
}

function aggregateAreas(rows: Property[], seedArea?: string): LocalityAggregate {
    const countMap = new Map<string, { name: string; count: number; slug?: string; newestAt: number; coverImage?: string }>();
    const stats: ListingInventoryStats = { total: 0, withVerifiedDate: 0 };
    for (const p of rows) {
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
        const at = createdAtMs(p);
        const cover = getRealImages(p, 1)[0];
        if (existing) {
            existing.count += 1;
            if (at > existing.newestAt) {
                existing.newestAt = at;
                existing.coverImage = cover;
            }
        } else {
            countMap.set(key, {
                name: displayName,
                count: 1,
                slug: canonical?.slug,
                newestAt: at,
                coverImage: cover,
            });
        }
    }

    const areaCounts: AreaInventoryCount[] = Array.from(countMap.values())
        .filter((item) => item.count > 0)
        .map(({ name, count, slug, coverImage }) => ({ name, count, slug, coverImage }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'en-IN'));

    let areas = areaCounts.map((a) => a.name).sort((a, b) => a.localeCompare(b, 'en-IN'));
    if (seedArea?.trim()) {
        const s = seedArea.trim();
        if (!areas.some((x) => x.toLowerCase() === s.toLowerCase())) {
            areas = [s, ...areas];
        }
    }
    return { areas, areaCounts, stats };
}

/**
 * Distinct locality names and live listing counts derived from backend API inventory.
 * Excludes areas with zero active listings.
 */
export function useListingLocalityOptions(
    seedArea?: string,
    category: 'all' | 'pg' | 'rent' | 'buy' | 'plot' = 'pg',
    citySlug = 'bangalore',
) {
    const cacheKey = `${category}::${citySlug}::${seedArea || ''}`;
    const cached = localityCache.get(cacheKey);
    const [areas, setAreas] = useState<string[]>(cached?.areas ?? []);
    const [areaCounts, setAreaCounts] = useState<AreaInventoryCount[]>(cached?.areaCounts ?? []);
    const [stats, setStats] = useState<ListingInventoryStats | null>(cached?.stats ?? null);
    const [loading, setLoading] = useState(!cached);

    useEffect(() => {
        let cancelled = false;
        if (localityCache.has(cacheKey)) {
            const hit = localityCache.get(cacheKey)!;
            setAreas(hit.areas);
            setAreaCounts(hit.areaCounts);
            setStats(hit.stats);
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const res = await propertyApi.getAll({
                    category: category === 'all' ? undefined : category,
                    city: citySlug || undefined,
                    is_available: true,
                    limit: 200,
                    skip: 0,
                });
                const rows = Array.isArray(res.items) ? res.items : [];
                const aggregated = aggregateAreas(rows, seedArea);
                localityCache.set(cacheKey, aggregated);
                if (!cancelled) {
                    setAreas(aggregated.areas);
                    setAreaCounts(aggregated.areaCounts);
                    setStats(aggregated.stats);
                }
            } catch {
                if (!cancelled) {
                    setAreas(seedArea ? [seedArea] : []);
                    setAreaCounts([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [cacheKey, seedArea, category, citySlug]);

    return { areas, areaCounts, stats, loading };
}
