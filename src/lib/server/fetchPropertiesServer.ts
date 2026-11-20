import { api } from '@/lib/api/client';
import {
    mapRealtyToProperty,
    normalizePropertyListResponse,
    REALTY_PATH,
} from '@/lib/api/properties';
import {
    CURATED_PG_PROPERTY_IDS,
    mergeCuratedFirstPgProperties,
} from '@/lib/curatedPgListings';
import type { Property, RealtyProperty } from '@/types/api';

export interface ServerPropertyQuery {
    skip?: number;
    limit?: number;
    category?: string;
    property_type?: string;
    listing_type?: string;
    is_available?: boolean;
    search?: string;
    exclude_property_type?: string;
    min_price?: number;
    max_price?: number;
    city?: string;
    sort_by?: string;
}

/**
 * Server-side property list fetcher using REALTY_PATH, normalizePropertyListResponse, and a timeout.
 * Throws on network/API failure so Next.js ISR/SSG never caches an empty fallback page.
 */
export async function fetchPropertiesServer(
    params: ServerPropertyQuery = {},
    timeoutMs = 15000,
): Promise<{ items: Property[]; total: number; propertyCounts?: Record<string, number> }> {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.property_type) queryParams.append('property_type', params.property_type);
    if (params.listing_type) queryParams.append('listing_type', params.listing_type);
    if (params.is_available !== undefined) queryParams.append('is_available', params.is_available.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.exclude_property_type) queryParams.append('exclude_property_type', params.exclude_property_type);
    if (params.min_price !== undefined) queryParams.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) queryParams.append('max_price', params.max_price.toString());
    if (params.city) queryParams.append('city', params.city);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);

    const response = await api.get<unknown>(REALTY_PATH, {
        params: queryParams,
        timeout: timeoutMs,
    });

    const isValidPayload =
        Array.isArray(response) ||
        (response !== null &&
            typeof response === 'object' &&
            (Array.isArray((response as Record<string, unknown>).items) ||
                Array.isArray((response as Record<string, unknown>).properties) ||
                Array.isArray((response as Record<string, unknown>).results)));

    if (!isValidPayload) {
        throw new Error('[fetchPropertiesServer] Invalid or non-JSON property list response from backend');
    }

    const { rows, total } = normalizePropertyListResponse(response);
    const propertyCounts =
        !Array.isArray(response) &&
        response &&
        typeof response === 'object' &&
        (response as Record<string, unknown>).property_counts &&
        typeof (response as Record<string, unknown>).property_counts === 'object'
            ? ((response as Record<string, unknown>).property_counts as Record<string, number>)
            : undefined;
    const items: Property[] = [];
    for (const row of rows) {
        try {
            items.push(mapRealtyToProperty(row as RealtyProperty));
        } catch (e) {
            console.warn('[fetchPropertiesServer] Skipping malformed property row:', e);
        }
    }

    return { items, total, propertyCounts };
}

/**
 * Server-side fetcher for the PG listing page: returns the 16 priority properties first
 * in exact order, followed by all remaining Bangalore PG properties.
 */
export async function fetchCuratedPgPropertiesServer(
    timeoutMs = 15000,
): Promise<{ items: Property[]; total: number; propertyCounts?: Record<string, number> }> {
    const first = await fetchPropertiesServer(
        {
            city: 'bangalore',
            is_available: true,
            limit: 500,
            skip: 0,
            sort_by: 'newest',
        },
        timeoutMs,
    );

    const allItems: Property[] = [...first.items];
    let skip = first.items.length;
    while (first.total > allItems.length && skip < first.total && skip < 2000) {
        const nextBatch = await fetchPropertiesServer(
            {
                city: 'bangalore',
                is_available: true,
                limit: 500,
                skip,
                sort_by: 'newest',
            },
            timeoutMs,
        );
        if (nextBatch.items.length === 0) break;
        allItems.push(...nextBatch.items);
        skip += nextBatch.items.length;
    }

    const foundIds = new Set(allItems.map((p) => Number(p.id)));
    const missingIds = CURATED_PG_PROPERTY_IDS.filter((id) => !foundIds.has(id));
    if (missingIds.length > 0) {
        const extras = await Promise.allSettled(
            missingIds.map((id) => api.get<RealtyProperty>(`${REALTY_PATH}/${id}`, { timeout: timeoutMs })),
        );
        for (const res of extras) {
            if (res.status === 'fulfilled' && res.value && res.value.id != null) {
                try {
                    allItems.push(mapRealtyToProperty(res.value));
                } catch {
                    // Skip malformed fallback item
                }
            }
        }
    }

    const items = mergeCuratedFirstPgProperties(allItems);
    const propertyCounts = first.propertyCounts
        ? { ...first.propertyCounts, pg: items.length }
        : { pg: items.length };

    return {
        items,
        total: items.length,
        propertyCounts,
    };
}

