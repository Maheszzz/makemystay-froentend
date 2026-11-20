import { useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { propertyApi } from '@/lib/api';
import { fetchCuratedPgPropertiesClient } from '@/lib/curatedPgListings';
import { inferPropertyTypeFromPath, parsePropertySlugParam } from '@/lib/propertyRouting';
import type { Property, PropertyId, ApiError, PaginationParams } from '@/types/api';

/** Stable, key-sorted serialization for filters (excludes pagination). */
function filterKeyFromParams(params?: PaginationParams): string {
    if (!params) return '{}';
    const record = params as Record<string, unknown>;
    const sortedEntries = Object.keys(record)
        .filter((k) => k !== 'skip' && k !== 'limit' && k !== 'page' && k !== 'page_size' && record[k] !== undefined)
        .sort()
        .map((k) => [k, record[k]]);
    return JSON.stringify(Object.fromEntries(sortedEntries));
}

function toApiError(err: unknown, fallbackMessage: string): ApiError | null {
    if (!err) return null;
    if (typeof err === 'object' && 'message' in err) {
        return err as ApiError;
    }
    return { message: fallbackMessage, status: 0, detail: String(err) };
}

interface PropertiesPagePayload {
    items: Property[];
    total?: number;
    propertyCounts?: Record<string, number>;
    skip: number;
}

async function fetchPropertiesPage(
    params: PaginationParams,
    skip: number,
    limit: number,
): Promise<PropertiesPagePayload> {
    const response = (await propertyApi.getAll({
        ...params,
        skip,
        limit,
    })) as unknown;

    const list = Array.isArray(response)
        ? response
        : response && typeof response === 'object' && Array.isArray((response as any).items)
          ? ((response as any).items as Property[])
          : [];

    const total =
        !Array.isArray(response) && response && typeof (response as any).total === 'number'
            ? ((response as any).total as number)
            : undefined;

    const propertyCounts =
        !Array.isArray(response) && response && (response as any).property_counts
            ? ((response as any).property_counts as Record<string, number>)
            : undefined;

    return { items: list, total, propertyCounts, skip };
}

export interface UsePropertiesOptions {
    /** Accumulate pages (skip += len) with Load more / infinite scroll */
    infiniteScroll?: boolean;
    pageSize?: number;
    /** 1-based crawlable page (e.g. `?page=2`). Initial fetch uses skip = (page-1)*pageSize when infiniteScroll. */
    initialListingPage?: number;
    /** SSR-seeded properties to render initial page without waterfall */
    initialProperties?: Property[];
    /** Total matching count from SSR response */
    initialTotalCount?: number;
    /** Category counts map from SSR response */
    initialPropertyCounts?: Record<string, number>;
    /** Disable query execution when another source (e.g. curated PG mode) handles fetching */
    enabled?: boolean;
}

export interface UsePropertiesResult {
    properties: Property[];
    totalCount: number;
    propertyCounts?: Record<string, number>;
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
 * Custom hook to fetch and cache properties with React Query, supporting filtering, sorting, and infinite scroll.
 */
export function useProperties(
    params: PaginationParams = {},
    options: UsePropertiesOptions = {},
): UsePropertiesResult {
    const {
        infiniteScroll = false,
        pageSize = DEFAULT_PAGE_SIZE,
        initialListingPage = 1,
        initialProperties,
        initialTotalCount,
        initialPropertyCounts,
        enabled = true,
    } = options;
    const startPage = Math.max(1, Math.min(500, initialListingPage || 1));

    const hasInitialData = Boolean(initialProperties && initialProperties.length > 0);
    const filterKey = useMemo(() => filterKeyFromParams(params), [params]);

    const queryKey = useMemo(
        () => ['properties', infiniteScroll ? 'infinite' : 'single', filterKey, pageSize, startPage] as const,
        [infiniteScroll, filterKey, pageSize, startPage],
    );

    const initialData = useMemo(() => {
        if (!hasInitialData || startPage !== 1 || !initialProperties) return undefined;
        return {
            pages: [
                {
                    items: initialProperties,
                    total:
                        typeof initialTotalCount === 'number'
                            ? initialTotalCount
                            : initialProperties.length >= pageSize
                              ? undefined
                              : initialProperties.length,
                    propertyCounts: initialPropertyCounts,
                    skip: 0,
                } satisfies PropertiesPagePayload,
            ],
            pageParams: [1],
        };
    }, [hasInitialData, startPage, initialProperties, initialTotalCount, initialPropertyCounts, pageSize]);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch: queryRefetch,
        error: queryError,
    } = useInfiniteQuery({
        queryKey,
        initialPageParam: startPage,
        queryFn: async ({ pageParam }) => {
            const skip = infiniteScroll ? (pageParam - 1) * pageSize : 0;
            return fetchPropertiesPage(params, skip, pageSize);
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!infiniteScroll) return undefined;
            if (lastPage.items.length < pageSize) return undefined;
            const totalLoaded =
                (startPage - 1) * pageSize + allPages.reduce((sum, page) => sum + page.items.length, 0);
            if (typeof lastPage.total === 'number') {
                return totalLoaded < lastPage.total ? startPage + allPages.length : undefined;
            }
            return startPage + allPages.length;
        },
        initialData,
        enabled,
    });

    const properties = useMemo(
        () => data?.pages.flatMap((page) => page.items) ?? [],
        [data],
    );

    const totalCount = useMemo(() => {
        const pages = data?.pages;
        if (pages) {
            for (let i = pages.length - 1; i >= 0; i--) {
                if (typeof pages[i].total === 'number') {
                    return pages[i].total as number;
                }
            }
        }
        return properties.length;
    }, [data, properties.length]);

    const propertyCounts = useMemo(() => {
        const pages = data?.pages;
        if (!pages) return undefined;
        for (let i = pages.length - 1; i >= 0; i--) {
            if (pages[i].propertyCounts) return pages[i].propertyCounts;
        }
        return undefined;
    }, [data]);

    const loadMore = useCallback(async () => {
        if (!infiniteScroll || isLoading || isFetchingNextPage || !hasNextPage) return;
        try {
            await fetchNextPage();
        } catch (err) {
            console.error('Failed to load more properties:', err);
        }
    }, [infiniteScroll, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

    const refetch = useCallback(async () => {
        await queryRefetch();
    }, [queryRefetch]);

    return {
        properties,
        totalCount,
        propertyCounts,
        shownCount: properties.length,
        loading: enabled ? isLoading : false,
        loadingMore: isFetchingNextPage,
        error: enabled ? toApiError(queryError, 'Failed to load properties') : null,
        hasMore: infiniteScroll ? Boolean(hasNextPage) : false,
        loadMore,
        refetch,
    };
}

/**
 * Fetches and caches the curated 16 PG properties from the live API.
 */
export function useCuratedPgProperties(options: {
    enabled?: boolean;
    initialProperties?: Property[];
    initialPropertyCounts?: Record<string, number>;
} = {}): {
    properties: Property[];
    propertyCounts?: Record<string, number>;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
} {
    const { enabled = true, initialProperties, initialPropertyCounts } = options;
    const hasInitial = Boolean(initialProperties && initialProperties.length > 0);

    const { data, isLoading, error, refetch: queryRefetch } = useQuery({
        queryKey: ['properties', 'curated-pg-16'],
        queryFn: fetchCuratedPgPropertiesClient,
        enabled,
        initialData: hasInitial
            ? {
                  items: initialProperties as Property[],
                  total: (initialProperties as Property[]).length,
                  propertyCounts: initialPropertyCounts,
              }
            : undefined,
        staleTime: 60_000,
    });

    const refetch = useCallback(async () => {
        await queryRefetch();
    }, [queryRefetch]);

    return {
        properties: data?.items ?? [],
        propertyCounts: data?.propertyCounts ?? initialPropertyCounts,
        loading: enabled ? isLoading : false,
        error: enabled ? toApiError(error, 'Failed to load PG properties') : null,
        refetch,
    };
}

export interface UsePropertyResult {
    property: Property | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and cache a single property by ID.
 */
export function useProperty(
    id: number | string | null | undefined,
    initialProperty?: Property | null,
): UsePropertyResult {
    const idKey = id !== null && id !== undefined ? String(id) : '';
    const matchesInitial = Boolean(initialProperty && idKey && String(initialProperty.id) === idKey);

    const {
        data,
        isLoading,
        error: queryError,
        refetch: queryRefetch,
    } = useQuery({
        queryKey: ['property', 'id', idKey],
        queryFn: () => propertyApi.getById(id as number | string),
        enabled: Boolean(idKey),
        initialData: matchesInitial ? (initialProperty as Property) : undefined,
    });

    const refetch = useCallback(async () => {
        if (!idKey) return;
        await queryRefetch();
    }, [idKey, queryRefetch]);

    return {
        property: data ?? null,
        loading: Boolean(idKey) && isLoading,
        error: toApiError(queryError, 'Failed to load property'),
        refetch,
    };
}

/**
 * Resolve PDP data from `/pg|rent|property|properties/:slug` (numeric id or legacy slug-only).
 */
export function usePropertyFromRoute(
    slugParam: string | undefined,
    pathname: string,
    initialProperty?: Property | null,
): UsePropertyResult {
    const id = slugParam ? parsePropertySlugParam(slugParam) : '';
    const byId = useProperty(id || null, initialProperty);
    const legacySlug = slugParam && !id ? slugParam : undefined;
    const bySlug = usePropertyBySlug(
        legacySlug ? inferPropertyTypeFromPath(pathname) : undefined,
        legacySlug,
        initialProperty,
    );
    return id ? byId : bySlug;
}

export function usePropertyBySlug(
    type: string | undefined,
    slug: string | undefined,
    initialProperty?: Property | null,
): UsePropertyResult {
    const matchesInitial = Boolean(initialProperty && slug && initialProperty.slug === slug);

    const {
        data,
        isLoading,
        error: queryError,
        refetch: queryRefetch,
    } = useQuery({
        queryKey: ['property', 'slug', type ?? '', slug ?? ''],
        queryFn: () => propertyApi.getBySlug(type as string, slug as string),
        enabled: Boolean(type && slug),
        initialData: matchesInitial ? (initialProperty as Property) : undefined,
    });

    const refetch = useCallback(async () => {
        if (!type || !slug) return;
        await queryRefetch();
    }, [type, slug, queryRefetch]);

    return {
        property: data ?? null,
        loading: Boolean(type && slug) && isLoading,
        error: toApiError(queryError, 'Failed to load property'),
        refetch,
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
    options: { limit?: number; initialProperties?: Property[] } = {},
): UseSimilarPropertiesResult {
    const { limit = 6, initialProperties } = options;
    const hasInitial = Boolean(initialProperties && initialProperties.length > 0);
    const idKey = propertyId !== null && propertyId !== undefined ? String(propertyId) : '';

    const {
        data,
        isLoading,
        error: queryError,
        refetch: queryRefetch,
    } = useQuery({
        queryKey: ['property', 'similar', idKey, limit],
        queryFn: async () => {
            const res = (await propertyApi.getSimilar(propertyId as PropertyId, { limit })) as unknown;
            if (Array.isArray(res)) return res as Property[];
            if (res && typeof res === 'object' && Array.isArray((res as any).items)) {
                return (res as any).items as Property[];
            }
            return [] as Property[];
        },
        enabled: Boolean(idKey),
        initialData: hasInitial ? initialProperties : undefined,
    });

    const refetch = useCallback(async () => {
        if (!idKey) return;
        await queryRefetch();
    }, [idKey, queryRefetch]);

    return {
        properties: data ?? [],
        loading: Boolean(idKey) && isLoading,
        error: toApiError(queryError, 'Failed to load similar properties'),
        refetch,
    };
}
