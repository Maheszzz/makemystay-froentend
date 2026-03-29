import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { propertyApi } from '@/lib/api';
import type { Property, ApiError, PaginationParams } from '@/types/api';

/** Stable key for filters (excludes pagination). */
function filterKeyFromParams(params?: PaginationParams): string {
    if (!params) return '';
    const { skip, limit, page, page_size, ...rest } = params as Record<string, unknown>;
    return JSON.stringify(rest);
}

export interface UsePropertiesOptions {
    /** Accumulate pages (skip += len) with Load more / infinite scroll */
    infiniteScroll?: boolean;
    pageSize?: number;
}

export interface UsePropertiesResult {
    properties: Property[];
    loading: boolean;
    error: ApiError | null;
    refetch: () => void;
    loadMore?: () => Promise<void>;
    hasMore?: boolean;
    loadingMore?: boolean;
}

const DEFAULT_PAGE = 24;

/**
 * Custom hook to fetch properties from the API.
 * Pass `{ infiniteScroll: true, pageSize: 24 }` on browse pages; default single-page fetch elsewhere.
 */
export function useProperties(
    params?: PaginationParams,
    options?: UsePropertiesOptions
): UsePropertiesResult {
    const infinite = options?.infiniteScroll === true;
    const pageSize = options?.pageSize ?? DEFAULT_PAGE;

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [refreshSignal, setRefreshSignal] = useState<number>(0);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const filterKey = useMemo(() => filterKeyFromParams(params), [params]);
    const paramsRef = useRef(params);
    paramsRef.current = params;

    // Single fetch (home grid, etc.)
    useEffect(() => {
        if (infinite) return;
        let isCurrent = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await propertyApi.getAll(params);
                if (isCurrent) {
                    setProperties(data);
                }
            } catch (err) {
                if (isCurrent) {
                    setError(err as ApiError);
                    console.error('Error fetching properties:', err);
                }
            } finally {
                if (isCurrent) {
                    setLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isCurrent = false;
        };
    }, [params, refreshSignal, infinite]);

    // Infinite: reset when filters change
    useEffect(() => {
        if (!infinite) return;
        let isCurrent = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setSkip(0);
                const p = paramsRef.current;
                const data = await propertyApi.getAll({
                    ...p,
                    limit: pageSize,
                    skip: 0,
                });
                if (!isCurrent) return;
                setProperties(data);
                setHasMore(data.length >= pageSize);
                setSkip(data.length);
            } catch (err) {
                if (isCurrent) {
                    setError(err as ApiError);
                    console.error('Error fetching properties:', err);
                }
            } finally {
                if (isCurrent) {
                    setLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isCurrent = false;
        };
    }, [filterKey, refreshSignal, infinite, pageSize]);

    const loadMore = useCallback(async () => {
        if (!infinite || !hasMore || loadingMore || loading) return;
        setLoadingMore(true);
        setError(null);
        try {
            const p = paramsRef.current;
            const data = await propertyApi.getAll({
                ...p,
                limit: pageSize,
                skip,
            });
            setProperties((prev) => [...prev, ...data]);
            setSkip((s) => s + data.length);
            setHasMore(data.length >= pageSize);
        } catch (err) {
            setError(err as ApiError);
            console.error('Error loading more properties:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [infinite, hasMore, loadingMore, loading, pageSize, skip]);

    const refetch = useCallback(() => setRefreshSignal((s) => s + 1), []);

    return {
        properties,
        loading,
        error,
        refetch,
        ...(infinite
            ? { loadMore, hasMore, loadingMore }
            : {}),
    };
}

interface UsePropertyResult {
    property: Property | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single property by ID
 * @param id - Property ID
 * @returns Property data, loading state, error state, and refetch function
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
 * @param type - Property Type
 * @param slug - Property Slug
 * @returns Property data, loading state, error state, and refetch function
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
