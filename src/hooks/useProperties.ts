import { useState, useEffect, useCallback, useMemo } from 'react';
import { propertyApi } from '@/lib/api';
import type { Property, PropertyId, ApiError, PaginationParams } from '@/types/api';

/** Stable key for filters (excludes pagination). */
function filterKeyFromParams(params?: PaginationParams): string {
    if (!params) return '';
    const { skip, limit, page, page_size, ...rest } = params as Record<string, any>;
    return JSON.stringify(rest);
}

export interface UsePropertiesOptions {
    /** Accumulate pages (skip += len) with Load more / infinite scroll */
    infiniteScroll?: boolean;
    pageSize?: number;
}

export interface UsePropertiesResult {
    properties: Property[];
    totalCount: number;
    shownCount: number;
    loading: boolean;
    loadingMore: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: boolean;
}

const DEFAULT_PAGE_SIZE = 24;

/**
 * Custom hook to fetch properties from the API with support for advanced filtering, sorting, and infinite scroll.
 */
export function useProperties(
    params: PaginationParams = {},
    options: UsePropertiesOptions = {}
): UsePropertiesResult {
    const { infiniteScroll = false, pageSize = DEFAULT_PAGE_SIZE } = options;

    const [properties, setProperties] = useState<Property[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Stabilize params by stringifying them as the dependency
    const paramsString = JSON.stringify(params);
    const filterKey = useMemo(() => filterKeyFromParams(params), [paramsString]);

    // Initial fetch and reset when filters change
    useEffect(() => {
        let isMounted = true;

        const fetchInitial = async () => {
            setLoading(true);
            setError(null);
            setPage(1);

            try {
                const response = await propertyApi.getAll({
                    ...params,
                    skip: 0,
                    limit: pageSize,
                });

                if (isMounted) {
                    const list = Array.isArray(response.items) ? response.items : [];
                    setProperties(list);
                    setTotalCount(response.total);
                    setHasMore(list.length < response.total);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as ApiError);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchInitial();
        return () => { isMounted = false; };
    }, [filterKey, pageSize]);

    const loadMore = useCallback(async () => {
        if (loading || loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = page + 1;

        try {
            const response = await propertyApi.getAll({
                ...params,
                skip: (nextPage - 1) * pageSize,
                limit: pageSize,
            });

            const pageItems = Array.isArray(response.items) ? response.items : [];
            setProperties(prev => [...prev, ...pageItems]);
            setPage(nextPage);
            setHasMore((properties.length + pageItems.length) < response.total);
            setTotalCount(response.total);
        } catch (err) {
            console.error('Failed to load more properties:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [loading, loadingMore, hasMore, page, pageSize, params, properties.length]);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setPage(1);
        try {
            const response = await propertyApi.getAll({
                ...params,
                skip: 0,
                limit: pageSize,
            });
            const list = Array.isArray(response.items) ? response.items : [];
            setProperties(list);
            setTotalCount(response.total);
            setHasMore(list.length < response.total);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    }, [params, pageSize]);

    return {
        properties,
        totalCount,
        shownCount: properties.length,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refetch
    };
}

export interface UsePropertyResult {
    property: Property | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single property by ID
 */
export function useProperty(id: number | string): UsePropertyResult {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchProperty = async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await propertyApi.getById(id);
            setProperty(data);
        } catch (err) {
            setError(err as ApiError);
            console.error(`Error fetching property ${id}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchProperty();
    }, [id]);

    return {
        property,
        loading,
        error,
        refetch: fetchProperty,
    };
}

/**
 * Custom hook to fetch a single property by type and slug
 */
export function usePropertyBySlug(type: string | undefined, slug: string | undefined): UsePropertyResult {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchProperty = async () => {
        if (!type || !slug) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await propertyApi.getBySlug(type, slug);
            setProperty(data);
        } catch (err) {
            setError(err as ApiError);
            console.error(`Error fetching property ${type}/${slug}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchProperty();
    }, [type, slug]);

    return {
        property,
        loading,
        error,
        refetch: fetchProperty,
    };
}

export interface UseSimilarPropertiesResult {
    properties: Property[];
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

/**
 * PDP similar listings — server-ranked (locality + neighbors + fallback); not the generic list API.
 */
export function useSimilarProperties(
    propertyId: PropertyId | null | undefined,
    options: { limit?: number } = {}
): UseSimilarPropertiesResult {
    const { limit = 6 } = options;
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const refetch = useCallback(async () => {
        if (propertyId === null || propertyId === undefined) {
            setProperties([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await propertyApi.getSimilar(propertyId, { limit });
            setProperties(res.items);
        } catch (err) {
            setError(err as ApiError);
            setProperties([]);
            console.error(`Error fetching similar properties for ${propertyId}:`, err);
        } finally {
            setLoading(false);
        }
    }, [propertyId, limit]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return { properties, loading, error, refetch };
}
