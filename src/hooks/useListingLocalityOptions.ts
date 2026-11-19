import { useState, useEffect } from 'react';
import { propertyApi } from '@/lib/api';
import { findPgLocationForArea } from '@/data/pgLocations';
import type { Property } from '@/types/api';

export interface AreaInventoryCount {
    name: string;
    count: number;
    slug?: string;
}

const localityCache = new Map<string, { areas: string[]; areaCounts: AreaInventoryCount[] }>();

function aggregateAreas(rows: Property[], seedArea?: string): { areas: string[]; areaCounts: AreaInventoryCount[] } {
    const countMap = new Map<string, { name: string; count: number; slug?: string }>();
    for (const p of rows) {
        if (!p || p.is_available === false) continue;
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

    let areas = areaCounts.map((a) => a.name).sort((a, b) => a.localeCompare(b, 'en-IN'));
    if (seedArea?.trim()) {
        const s = seedArea.trim();
        if (!areas.some((x) => x.toLowerCase() === s.toLowerCase())) {
            areas = [s, ...areas];
        }
    }
    return { areas, areaCounts };
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
    const [loading, setLoading] = useState(!cached);

    useEffect(() => {
        let cancelled = false;
        if (localityCache.has(cacheKey)) {
            const hit = localityCache.get(cacheKey)!;
            setAreas(hit.areas);
            setAreaCounts(hit.areaCounts);
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

    return { areas, areaCounts, loading };
}
