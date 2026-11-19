'use client';

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Link, useLocation, useSearchParams, useNavigate } from '@/lib/navigation';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProperties, useListingLocalityOptions, useScrollMemory } from '@/hooks';
import { ArrowRight, ChevronDown, Heart, MessageCircle, RefreshCw, Search } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { FeaturedPromoBanner } from '@/components/modules/listings/FeaturedPromoBanner';
import { ListingFilterBar, type ActiveFilterPill } from '@/components/modules/listings/ListingFilterBar';
import { useWishlist } from '@/context/WishlistContext';
import { PROPERTY_CITY_OPTIONS, findPgLocationForArea } from '@/data/pgLocations';
import {
    normalizePgGenderParam,
    propertyMatchesPgFeatureFilters,
    propertyMatchesPgGenderFilter,
} from '@/lib/propertySeoUtils';
import { buildPageSEO, isValidListingPageParam, listingsPageSeo } from '@/lib/seo';
import {
    normalizeCitySlug,
    pathnameToActiveListingsTab,
    listingsHubTabNavigateUrl,
} from '@/lib/listingsCategoryHubs';
import { computeRentPlotStatsFromListings, plotSqftFromProperty } from '@/lib/listingInventoryStats';
import {
    LISTING_TAB_LABEL,
    buildEmptyFilterWhatsappMessage,
    deriveAvailableFilterOptions,
    formatFurnishingLabel,
    formatResultHeading,
    getBudgetPresetsForCategory,
    getListingHeaderCopy,
    parsePropertyPriceInr,
    type ListingCategoryKey,
} from '@/lib/listingPageUtils';
import { getWhatsappDigits } from '@/lib/whatsapp';
import type { Property } from '@/types/api';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

interface PropertiesProps {
    initialCategory?: 'all' | 'pg' | 'rent' | 'buy' | 'plot';
    initialTypeFilter?: string;
    initialCity?: string;
    pageTitle?: string;
    pageSubtitle?: string;
    initialMinPrice?: string;
    initialMaxPrice?: string;
    /** Embed listing UI inside another page (no Helmet, Navbar, Footer). */
    hideChrome?: boolean;
    /** Preserved for caller compatibility with rent hub embeds. */
    embedRentHubUi?: boolean;
    /** Preserved for caller compatibility with plot hub embeds. */
    embedPlotHubUi?: boolean;
    /** Live min/max rent (INR) for embedded rent hub hero — updated from loaded listings. */
    onRentHubInventoryRange?: (min: number | null, max: number | null) => void;
    /** Live min/max plot sqft for embedded plot hub hero. */
    onPlotHubInventoryRange?: (min: number | null, max: number | null) => void;
    onEmptyResultsChange?: (isEmpty: boolean) => void;
    /** Hub shells can mirror visible inventory into ItemList JSON-LD — max 100 items. */
    onDisplayedListingsForSeo?: (list: Property[]) => void;
    /** When set (e.g. `/pg-for-boys-in-*` hubs), filter PG listings without relying on `?gender=`. */
    forcedGenderFilter?: 'male' | 'female';
    /** Preserved for caller compatibility; map only displays when coordinates exist in API data. */
    showMapPanel?: boolean;
    /** SSR-seeded properties to render listing cards in initial HTML. */
    initialProperties?: Property[];
    /** Total live matching count from SSR payload. */
    initialTotalCount?: number;
    /** Live category counts from SSR payload. */
    initialPropertyCounts?: Record<string, number>;
}

function PropertiesUrlSync({ onSync }: { onSync: (qs: string) => void }) {
    const [searchParams] = useSearchParams();
    const qs = searchParams.toString();
    useEffect(() => {
        onSync(qs);
    }, [qs, onSync]);
    return null;
}

function normalizeSortParam(raw: string | null): 'newest' | 'price_asc' | 'price_desc' {
    if (raw === 'price_asc' || raw === 'price_desc' || raw === 'newest') return raw;
    return 'newest';
}

function PropertiesInner({
    initialCategory = 'all',
    initialTypeFilter = 'all',
    initialCity = 'all',
    pageTitle,
    pageSubtitle,
    hideChrome = false,
    embedRentHubUi = false,
    embedPlotHubUi = false,
    initialMinPrice = '',
    initialMaxPrice = '',
    onRentHubInventoryRange,
    onPlotHubInventoryRange,
    onEmptyResultsChange,
    onDisplayedListingsForSeo,
    forcedGenderFilter,
    showMapPanel: initialMapProp = false,
    initialProperties,
    initialTotalCount,
    initialPropertyCounts,
}: PropertiesProps) {
    const router = useRouter();
    const location = useLocation();
    const navigate = useNavigate();
    const [urlQueryString, setUrlQueryString] = useState('');
    const [hasUrlSynced, setHasUrlSynced] = useState(false);
    const searchParams = useMemo(() => new URLSearchParams(urlQueryString), [urlQueryString]);
    const { wishlist } = useWishlist();

    const [category, setCategory] = useState<ListingCategoryKey>(initialCategory);
    const [locationFilter, setLocationFilter] = useState(initialCity);
    const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
    const [minPrice, setMinPrice] = useState(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
    const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [sharingFilter, setSharingFilter] = useState('');
    const [furnishingFilter, setFurnishingFilter] = useState('');
    const [plotSizeFilter, setPlotSizeFilter] = useState('');
    const [mapOpen, setMapOpen] = useState(initialMapProp);

    const handleUrlSync = useCallback(
        (qs: string) => {
            setUrlQueryString(qs);
            const sp = new URLSearchParams(qs);
            const cat = sp.get('cat') as ListingCategoryKey | null;
            setCategory(cat ?? initialCategory);
            setLocationFilter(sp.get('city') ?? initialCity);
            setTypeFilter(sp.get('type') ?? initialTypeFilter);
            setMinPrice(sp.get('min') ?? initialMinPrice);
            setMaxPrice(sp.get('max') ?? initialMaxPrice);
            setSortBy(normalizeSortParam(sp.get('sort')));
            setSearchQuery(sp.get('q') ?? '');
            setSharingFilter(sp.get('sharing') ?? '');
            setFurnishingFilter(sp.get('furnishing') ?? '');
            setPlotSizeFilter(sp.get('plot_size') ?? '');
            if (sp.has('map')) setMapOpen(sp.get('map') === '1');
            setHasUrlSynced(true);
        },
        [initialCategory, initialCity, initialTypeFilter, initialMinPrice, initialMaxPrice],
    );

    const setSearchParams = useCallback(
        (
            next: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams),
            options?: { replace?: boolean },
        ) => {
            const currentQs =
                typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : urlQueryString;
            let params: URLSearchParams;
            if (typeof next === 'function') {
                params = next(new URLSearchParams(currentQs));
            } else if (next instanceof URLSearchParams) {
                params = next;
            } else {
                params = new URLSearchParams();
                for (const [k, v] of Object.entries(next)) {
                    if (v !== undefined && v !== '') params.set(k, v);
                }
            }
            const qs = params.toString();
            setUrlQueryString(qs);
            const pathname = location.pathname || '/properties';
            const href = qs ? `${pathname}?${qs}` : pathname;
            if (options?.replace) router.replace(href, { scroll: false });
            else router.push(href, { scroll: false });
        },
        [router, location.pathname, urlQueryString],
    );

    const pageQueryParam = searchParams.get('page');
    const listingPageNum = useMemo(() => {
        if (!pageQueryParam || !isValidListingPageParam(pageQueryParam)) return 1;
        const n = parseInt(pageQueryParam, 10);
        if (!Number.isFinite(n)) return 1;
        return Math.max(1, Math.min(100, n));
    }, [pageQueryParam]);

    // Sync state changes to URL (debounced) without forcing default `?city=Bangalore`
    useEffect(() => {
        if (!hasUrlSynced) return;
        const timer = setTimeout(() => {
            const params: Record<string, string> = {};
            const onPropertiesIndex = location.pathname === '/properties';
            if (onPropertiesIndex && category !== 'all') {
                params.cat = category;
            }
            const isDefaultCity =
                initialCity !== 'all' &&
                locationFilter.trim().toLowerCase() === String(initialCity).trim().toLowerCase();
            if (locationFilter !== 'all' && !isDefaultCity) params.city = locationFilter;
            if (typeFilter !== 'all') params.type = typeFilter;
            if (minPrice) params.min = minPrice;
            if (maxPrice) params.max = maxPrice;
            if (sortBy !== 'newest') params.sort = sortBy;
            if (searchQuery) params.q = searchQuery;
            if (sharingFilter) params.sharing = sharingFilter;
            if (furnishingFilter) params.furnishing = furnishingFilter;
            if (plotSizeFilter) params.plot_size = plotSizeFilter;

            const pageRaw = searchParams.get('page');
            if (isValidListingPageParam(pageRaw) && pageRaw && parseInt(pageRaw, 10) > 1) {
                params.page = pageRaw.trim();
            }

            for (const key of ['wifi', 'food', 'ac', 'price', 'gender', 'map'] as const) {
                const v = searchParams.get(key);
                if (v) params[key] = v;
            }

            const currentParams = Object.fromEntries(searchParams.entries());
            if (JSON.stringify(params) !== JSON.stringify(currentParams)) {
                setSearchParams(params, { replace: true });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [
        category,
        location.pathname,
        locationFilter,
        typeFilter,
        minPrice,
        maxPrice,
        sortBy,
        searchQuery,
        sharingFilter,
        furnishingFilter,
        plotSizeFilter,
        initialCity,
        hasUrlSynced,
        setSearchParams,
        searchParams,
        pageQueryParam,
    ]);

    useEffect(() => {
        if (initialCategory !== category && !searchParams.get('cat')) {
            setCategory(initialCategory);
        }
    }, [initialCategory]);

    const defaultMetroSlug = useMemo(() => {
        return normalizeCitySlug(initialCity !== 'all' ? initialCity : undefined) ?? 'bangalore';
    }, [initialCity]);

    const activeTabKey = useMemo((): ListingCategoryKey => {
        if (location.pathname === '/properties') return category;
        const implied = pathnameToActiveListingsTab(location.pathname);
        if (implied !== null) return implied;
        return category;
    }, [location.pathname, category]);

    useEffect(() => {
        if (location.pathname === '/properties') return;
        const implied = pathnameToActiveListingsTab(location.pathname);
        if (implied !== null && implied !== category) {
            setCategory(implied);
        }
    }, [location.pathname, category]);

    const wifiOn = searchParams.get('wifi') === 'true';
    const foodOn = searchParams.get('food') === 'true';
    const acOn = searchParams.get('ac') === 'true';
    const priceTier = searchParams.get('price');

    const apiCity = useMemo(() => {
        if (locationFilter === 'all') return defaultMetroSlug;
        return (
            normalizeCitySlug(locationFilter) ??
            String(locationFilter).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        );
    }, [locationFilter, defaultMetroSlug]);

    const apiParams = useMemo(() => {
        const q = searchQuery.trim() || undefined;
        let min_price = minPrice ? parseFloat(minPrice) : undefined;
        let max_price = maxPrice ? parseFloat(maxPrice) : undefined;
        if (!min_price && !max_price && priceTier === 'low') max_price = 12000;
        if (!min_price && !max_price && priceTier === 'mid') {
            min_price = 8000;
            max_price = 16000;
        }
        if (!min_price && !max_price && priceTier === 'high') min_price = 14000;

        const base = { search: q, min_price, max_price, city: apiCity, sort_by: sortBy };
        if (category === 'all') {
            return { ...base, property_type: typeFilter === 'all' ? undefined : typeFilter };
        }
        return { ...base, category, property_type: typeFilter === 'all' ? undefined : typeFilter };
    }, [category, searchQuery, typeFilter, minPrice, maxPrice, apiCity, sortBy, priceTier]);

    const isDefaultSeededState =
        category === initialCategory &&
        locationFilter === initialCity &&
        typeFilter === initialTypeFilter &&
        minPrice === initialMinPrice &&
        maxPrice === initialMaxPrice &&
        sortBy === 'newest' &&
        !searchQuery.trim() &&
        !sharingFilter &&
        !furnishingFilter &&
        !plotSizeFilter &&
        listingPageNum === 1 &&
        !priceTier;

    const PAGE_SIZE = 24;
    const {
        properties,
        totalCount,
        propertyCounts,
        loading,
        error,
        refetch,
        loadMore,
        hasMore,
        loadingMore,
    } = useProperties(apiParams, {
        infiniteScroll: true,
        pageSize: PAGE_SIZE,
        initialListingPage: listingPageNum,
        initialProperties: isDefaultSeededState ? initialProperties : undefined,
        initialTotalCount: isDefaultSeededState ? initialTotalCount : undefined,
        initialPropertyCounts: isDefaultSeededState ? initialPropertyCounts : undefined,
    });

    const syncedFullUrl = urlQueryString ? `${location.pathname}?${urlQueryString}` : location.pathname;
    useScrollMemory(hasUrlSynced && !loading, { urlKey: syncedFullUrl });

    const genderFilter = useMemo(() => {
        if (forcedGenderFilter) return forcedGenderFilter;
        if (category !== 'pg') return undefined;
        return normalizePgGenderParam(searchParams.get('gender'));
    }, [forcedGenderFilter, category, searchParams]);

    const listingFilterKey = useMemo(
        () =>
            JSON.stringify({
                category,
                searchQuery,
                typeFilter,
                minPrice,
                maxPrice,
                apiCity,
                sortBy,
                priceTier,
                wifiOn,
                foodOn,
                acOn,
                sharingFilter,
                furnishingFilter,
                plotSizeFilter,
                genderKey: genderFilter ?? '',
            }),
        [
            category,
            searchQuery,
            typeFilter,
            minPrice,
            maxPrice,
            apiCity,
            sortBy,
            priceTier,
            wifiOn,
            foodOn,
            acOn,
            sharingFilter,
            furnishingFilter,
            plotSizeFilter,
            genderFilter,
        ],
    );

    const listingFilterKeyPrev = useRef<string | null>(null);
    useEffect(() => {
        if (listingFilterKeyPrev.current === null) {
            listingFilterKeyPrev.current = listingFilterKey;
            return;
        }
        if (listingFilterKeyPrev.current === listingFilterKey) return;
        listingFilterKeyPrev.current = listingFilterKey;
        if (!searchParams.get('page')) return;
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('page');
                return next;
            },
            { replace: true },
        );
    }, [listingFilterKey, searchParams, setSearchParams]);

    const availableFilterOptions = useMemo(
        () =>
            deriveAvailableFilterOptions(Array.isArray(properties) ? properties : [], {
                gender: genderFilter,
                sharing: sharingFilter,
                food: foodOn,
                typeFilter,
                furnishing: furnishingFilter,
                plotSize: plotSizeFilter,
            }),
        [properties, genderFilter, sharingFilter, foodOn, typeFilter, furnishingFilter, plotSizeFilter],
    );

    const propertyListFiltered = useMemo(() => {
        try {
            const rawList = Array.isArray(properties) ? properties : [];
            let list = rawList.filter((p) => !!p);

            const flags = { wifi: wifiOn, food: foodOn, ac: acOn };
            if (wifiOn || foodOn || acOn) {
                list = list.filter((p) => propertyMatchesPgFeatureFilters(p, flags));
            }

            if (category === 'pg' && genderFilter) {
                list = list.filter((p) => propertyMatchesPgGenderFilter(p, genderFilter));
            }

            if (category === 'pg' && sharingFilter) {
                const target = sharingFilter.toLowerCase();
                list = list.filter(
                    (p) => Array.isArray(p.sharing) && p.sharing.some((s) => s.trim().toLowerCase() === target),
                );
            }

            if (furnishingFilter) {
                const target = furnishingFilter.toLowerCase();
                list = list.filter((p) => (p.furnishing || '').trim().toLowerCase() === target);
            }

            if (plotSizeFilter) {
                list = list.filter((p) => {
                    const sq = plotSqftFromProperty(p);
                    if (sq == null) return false;
                    if (plotSizeFilter === 'under-1200') return sq < 1200;
                    if (plotSizeFilter === '1200-2400') return sq >= 1200 && sq <= 2400;
                    if (plotSizeFilter === '2400-plus') return sq > 2400;
                    return true;
                });
            }

            if (category !== 'all') {
                const byCategory = list.filter((p) => p.category === category);
                if (byCategory.length > 0 || category !== 'rent') {
                    list = byCategory;
                }
            }

            if (typeFilter && typeFilter !== 'all') {
                list = list.filter((p) => {
                    const pt = (p.type || '').toUpperCase().trim();
                    const target = typeFilter.toUpperCase().trim();
                    if (target === '1 & 2 BHK') {
                        return pt === '1BHK' || pt === '2BHK' || pt === '1 & 2 BHK' || pt === '1_2_BHK' || pt === '1RK';
                    }
                    if (target === '1BHK') {
                        return pt === '1BHK' || pt === '1RK' || pt === '1 & 2 BHK' || pt === '1_2_BHK';
                    }
                    if (target === '2BHK') {
                        return pt === '2BHK' || pt === '1 & 2 BHK' || pt === '1_2_BHK';
                    }
                    return pt === target;
                });
            }

            return list;
        } catch (e) {
            console.error('[Properties] Filtering error:', e);
            return [];
        }
    }, [
        properties,
        wifiOn,
        foodOn,
        acOn,
        category,
        genderFilter,
        sharingFilter,
        furnishingFilter,
        plotSizeFilter,
        typeFilter,
    ]);

    const propertyListOrdered = useMemo(() => {
        const list = [...propertyListFiltered];
        if (sortBy === 'price_asc') {
            return list.sort((a, b) => {
                const pa = parsePropertyPriceInr(a.price);
                const pb = parsePropertyPriceInr(b.price);
                if (pa == null && pb == null) return 0;
                if (pa == null) return 1;
                if (pb == null) return -1;
                return pa - pb;
            });
        }
        if (sortBy === 'price_desc') {
            return list.sort((a, b) => {
                const pa = parsePropertyPriceInr(a.price);
                const pb = parsePropertyPriceInr(b.price);
                if (pa == null && pb == null) return 0;
                if (pa == null) return 1;
                if (pb == null) return -1;
                return pb - pa;
            });
        }
        return list;
    }, [propertyListFiltered, sortBy]);

    const hasGeoCoordinates = useMemo(
        () =>
            propertyListFiltered.some(
                (p) =>
                    typeof p.latitude === 'number' &&
                    Number.isFinite(p.latitude) &&
                    typeof p.longitude === 'number' &&
                    Number.isFinite(p.longitude),
            ),
        [propertyListFiltered],
    );

    const showMap = hasGeoCoordinates && mapOpen;

    const inventoryStats = useMemo(
        () => computeRentPlotStatsFromListings(propertyListFiltered),
        [propertyListFiltered],
    );

    useEffect(() => {
        if (!embedRentHubUi || !onRentHubInventoryRange) return;
        onRentHubInventoryRange(inventoryStats.rentMinInr, inventoryStats.rentMaxInr);
    }, [embedRentHubUi, onRentHubInventoryRange, inventoryStats.rentMinInr, inventoryStats.rentMaxInr]);

    useEffect(() => {
        if (!embedPlotHubUi || !onPlotHubInventoryRange) return;
        onPlotHubInventoryRange(inventoryStats.plotSqftMin, inventoryStats.plotSqftMax);
    }, [embedPlotHubUi, onPlotHubInventoryRange, inventoryStats.plotSqftMin, inventoryStats.plotSqftMax]);

    const cityLabelDisplay = useMemo(() => {
        if (locationFilter === 'all') {
            if (initialCity && initialCity !== 'all') {
                return initialCity.charAt(0).toUpperCase() + initialCity.slice(1);
            }
            return 'Bangalore';
        }
        const s = String(locationFilter).trim();
        if (!s) return 'Bangalore';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }, [locationFilter, initialCity]);

    const headerCopy = useMemo(
        () => getListingHeaderCopy(activeTabKey, cityLabelDisplay),
        [activeTabKey, cityLabelDisplay],
    );
    const resolvedTitle = pageTitle || headerCopy.title;
    const resolvedSubtitle = pageSubtitle || headerCopy.subtitle;

    const listingsHelmet = useMemo(() => {
        if (hideChrome) return null;
        const page = listingsPageSeo({
            pathname: location.pathname,
            pageTitle: resolvedTitle,
            pageSubtitle: resolvedSubtitle,
            category,
            cityLabel: locationFilter === 'all' ? 'all' : locationFilter,
            totalCount: totalCount ?? undefined,
            listingPage: listingPageNum,
        });
        return buildPageSEO({
            ...page,
            noindex: Boolean(page.noindex),
        });
    }, [
        hideChrome,
        location.pathname,
        resolvedTitle,
        resolvedSubtitle,
        category,
        locationFilter,
        totalCount,
        listingPageNum,
    ]);

    useEffect(() => {
        if (error) return;
        const shouldNoindexEmptyResults = !loading && !error && propertyListOrdered.length === 0;
        onEmptyResultsChange?.(shouldNoindexEmptyResults);
    }, [onEmptyResultsChange, loading, propertyListOrdered.length, error]);

    useEffect(() => {
        if (!onDisplayedListingsForSeo) return;
        if (loading && propertyListOrdered.length === 0) return;
        onDisplayedListingsForSeo(propertyListOrdered.slice(0, 100));
    }, [onDisplayedListingsForSeo, loading, propertyListOrdered]);

    const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!sentinelEl || !hasMore || loading || loadingMore) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    void loadMore();
                }
            },
            { root: null, rootMargin: '600px', threshold: 0 },
        );
        obs.observe(sentinelEl);
        return () => obs.disconnect();
    }, [sentinelEl, hasMore, loading, loadingMore, loadMore]);

    const { areas: localitiesFromApi, areaCounts } = useListingLocalityOptions(
        initialCity !== 'all' ? initialCity : undefined,
        activeTabKey,
        defaultMetroSlug,
    );
    const cities = localitiesFromApi.length > 0 ? localitiesFromApi : PROPERTY_CITY_OPTIONS;

    const updateParamKey = useCallback(
        (key: string, value: string | null) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (value) next.set(key, value);
                else next.delete(key);
                return next;
            }, { replace: true });
        },
        [setSearchParams],
    );

    const resetFilters = useCallback(() => {
        setMinPrice('');
        setMaxPrice('');
        setLocationFilter(initialCity);
        setSortBy('newest');
        setSearchQuery('');
        setTypeFilter('all');
        setSharingFilter('');
        setFurnishingFilter('');
        setPlotSizeFilter('');
        setSearchParams({}, { replace: true });
    }, [initialCity, setSearchParams]);

    const handleCategoryTab = useCallback(
        (cat: ListingCategoryKey) => {
            const url = listingsHubTabNavigateUrl(cat, apiCity, searchQuery);
            navigate(url);
        },
        [apiCity, searchQuery, navigate],
    );

    const hasClientFilters = Boolean(
        wifiOn || foodOn || acOn || genderFilter || sharingFilter || furnishingFilter || plotSizeFilter || (typeFilter && typeFilter !== 'all'),
    );
    const displayResultCount = hasClientFilters
        ? propertyListOrdered.length
        : (totalCount ?? propertyListOrdered.length);

    const activeFilterPills = useMemo<ActiveFilterPill[]>(() => {
        const pills: ActiveFilterPill[] = [];
        if (searchQuery.trim()) {
            pills.push({
                key: 'q',
                label: `"${searchQuery.trim()}"`,
                onRemove: () => setSearchQuery(''),
            });
        }
        const isDefaultCity =
            locationFilter === 'all' ||
            (initialCity !== 'all' && locationFilter.toLowerCase() === initialCity.toLowerCase());
        if (!isDefaultCity) {
            pills.push({
                key: 'city',
                label: locationFilter,
                onRemove: () => setLocationFilter(initialCity),
            });
        }
        if (minPrice || maxPrice) {
            const label =
                minPrice && maxPrice
                    ? `₹${Number(minPrice).toLocaleString('en-IN')} – ₹${Number(maxPrice).toLocaleString('en-IN')}`
                    : minPrice
                      ? `₹${Number(minPrice).toLocaleString('en-IN')}+`
                      : `Up to ₹${Number(maxPrice).toLocaleString('en-IN')}`;
            pills.push({
                key: 'budget',
                label,
                onRemove: () => {
                    setMinPrice('');
                    setMaxPrice('');
                    updateParamKey('price', null);
                },
            });
        }
        if (typeFilter && typeFilter !== 'all') {
            pills.push({
                key: 'type',
                label: typeFilter,
                onRemove: () => setTypeFilter('all'),
            });
        }
        if (genderFilter && !forcedGenderFilter) {
            pills.push({
                key: 'gender',
                label: genderFilter === 'male' ? 'Boys' : 'Girls',
                onRemove: () => updateParamKey('gender', null),
            });
        }
        if (sharingFilter) {
            pills.push({
                key: 'sharing',
                label: `${sharingFilter} sharing`,
                onRemove: () => setSharingFilter(''),
            });
        }
        if (furnishingFilter) {
            pills.push({
                key: 'furnishing',
                label: formatFurnishingLabel(furnishingFilter),
                onRemove: () => setFurnishingFilter(''),
            });
        }
        if (foodOn) {
            pills.push({
                key: 'food',
                label: 'Meals included',
                onRemove: () => updateParamKey('food', null),
            });
        }
        if (wifiOn) {
            pills.push({
                key: 'wifi',
                label: 'WiFi',
                onRemove: () => updateParamKey('wifi', null),
            });
        }
        if (acOn) {
            pills.push({
                key: 'ac',
                label: 'AC',
                onRemove: () => updateParamKey('ac', null),
            });
        }
        if (plotSizeFilter) {
            const bucket = availableFilterOptions.plotSizeBuckets.find((b) => b.id === plotSizeFilter);
            pills.push({
                key: 'plot_size',
                label: bucket?.label || plotSizeFilter,
                onRemove: () => setPlotSizeFilter(''),
            });
        }
        return pills;
    }, [
        searchQuery,
        locationFilter,
        initialCity,
        minPrice,
        maxPrice,
        typeFilter,
        genderFilter,
        forcedGenderFilter,
        sharingFilter,
        furnishingFilter,
        foodOn,
        wifiOn,
        acOn,
        plotSizeFilter,
        availableFilterOptions.plotSizeBuckets,
        updateParamKey,
    ]);

    const emptyWhatsappHref = useMemo(() => {
        const msg = buildEmptyFilterWhatsappMessage({
            categoryLabel: LISTING_TAB_LABEL[activeTabKey].toLowerCase(),
            areaOrCity: cityLabelDisplay,
            searchQuery,
            minPrice,
            maxPrice,
            typeFilter,
            genderFilter,
            sharingFilter,
            furnishingFilter,
            foodOn,
            wifiOn,
        });
        return `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(msg)}`;
    }, [
        activeTabKey,
        cityLabelDisplay,
        searchQuery,
        minPrice,
        maxPrice,
        typeFilter,
        genderFilter,
        sharingFilter,
        furnishingFilter,
        foodOn,
        wifiOn,
    ]);

    const mapQuery = useMemo(() => {
        const categoryLabel = category === 'pg' ? 'PG' : 'property';
        return encodeURIComponent(`${categoryLabel} in ${cityLabelDisplay}`);
    }, [category, cityLabelDisplay]);

    const listingPageLd = useMemo(() => {
        const path = location.pathname || '/properties';
        const url = `${SITE_URL}${path}`;
        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'CollectionPage',
                    '@id': `${url}#collection`,
                    url,
                    name: resolvedTitle,
                    description: resolvedSubtitle,
                    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
                },
                {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                        { '@type': 'ListItem', position: 2, name: resolvedTitle, item: url },
                    ],
                },
            ],
        };
    }, [location.pathname, resolvedTitle, resolvedSubtitle]);

    const areaChipsWithHref = useMemo(() => {
        return areaCounts.slice(0, 14).map((area) => {
            const loc = area.slug ? { slug: area.slug } : findPgLocationForArea(area.name);
            let href: string;
            if (activeTabKey === 'pg' && loc?.slug) {
                href = `/pg/${loc.slug}`;
            } else if (activeTabKey === 'rent' && loc?.slug) {
                href = `/rent/${loc.slug}`;
            } else {
                href = listingsHubTabNavigateUrl(activeTabKey, defaultMetroSlug, area.name);
            }
            return { ...area, href };
        });
    }, [areaCounts, activeTabKey, defaultMetroSlug]);

    const budgetPresets = useMemo(() => getBudgetPresetsForCategory(activeTabKey), [activeTabKey]);

    return (
        <div className="bg-pdp-bg min-h-screen text-pdp-ink font-sans flex flex-col overflow-x-clip">
            <Suspense fallback={null}>
                <PropertiesUrlSync onSync={handleUrlSync} />
            </Suspense>
            {listingsHelmet && <SEOHead {...listingsHelmet} />}
            <JsonLd data={listingPageLd} id={`listing-page-${activeTabKey}-ld-json`} />
            {!hideChrome && <Navbar />}

            <main id={hideChrome ? undefined : 'main-content'} className={hideChrome ? 'pt-0 pb-16 flex-grow' : 'pt-[52px] md:pt-[56px] pb-20 flex-grow'}>
                {/* 1. Slim Left-Aligned Editorial Header (Standalone listing pages) */}
                {!hideChrome && (
                    <header className="bg-pdp-surface border-b border-pdp-border">
                        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <h1 className="font-serif-display text-[40px] md:text-[48px] font-normal text-pdp-ink tracking-[-0.015em] leading-[1.08]">
                                    {resolvedTitle}
                                </h1>
                                {!loading && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pdp-bg border border-pdp-border text-sm font-medium text-pdp-muted tabular-nums">
                                        {displayResultCount.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>
                            <p className="mt-2.5 text-base text-pdp-muted max-w-2xl leading-relaxed">
                                {resolvedSubtitle}
                            </p>
                            <p className="mt-2 text-xs text-pdp-muted">
                                Cards display current availability and the last-verified date when recorded.
                            </p>
                        </div>
                    </header>
                )}

                {/* 2. Sticky Filter Bar */}
                <ListingFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeTabKey={activeTabKey}
                    onSelectCategory={handleCategoryTab}
                    propertyCounts={propertyCounts}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onBudgetApply={(min, max) => {
                        setMinPrice(min);
                        setMaxPrice(max);
                        if (priceTier) updateParamKey('price', null);
                    }}
                    budgetPresets={budgetPresets}
                    sortBy={sortBy}
                    onSortChange={(val) => setSortBy(normalizeSortParam(val))}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                    genderFilter={genderFilter}
                    onGenderToggle={(g) => updateParamKey('gender', genderFilter === g ? null : g)}
                    sharingFilter={sharingFilter}
                    onSharingToggle={(s) => setSharingFilter((prev) => (prev.toLowerCase() === s.toLowerCase() ? '' : s))}
                    furnishingFilter={furnishingFilter}
                    onFurnishingToggle={(f) => setFurnishingFilter((prev) => (prev.toLowerCase() === f.toLowerCase() ? '' : f))}
                    foodOn={foodOn}
                    onFoodToggle={() => updateParamKey('food', foodOn ? null : 'true')}
                    plotSizeFilter={plotSizeFilter}
                    onPlotSizeToggle={(b) => setPlotSizeFilter((prev) => (prev === b ? '' : b))}
                    availableOptions={availableFilterOptions}
                    locationFilter={locationFilter}
                    onLocationFilterChange={setLocationFilter}
                    cities={cities}
                    defaultCityLabel={initialCity !== 'all' ? initialCity : 'Bangalore'}
                    hasGeoCoordinates={hasGeoCoordinates}
                    showMapPanel={showMap}
                    onMapToggle={() => setMapOpen((v) => !v)}
                    activeFilterPills={activeFilterPills}
                    onClearAll={resetFilters}
                    resultCount={displayResultCount}
                    loading={loading}
                />

                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    {/* 3. Horizontally Scrollable Area Chips with Real Listing Counts */}
                    {areaChipsWithHref.length > 0 && (
                        <nav
                            aria-label="Popular areas"
                            className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
                        >
                            {areaChipsWithHref.map((chip) => {
                                const isCurrentArea =
                                    searchQuery.trim().toLowerCase() === chip.name.toLowerCase() ||
                                    locationFilter.trim().toLowerCase() === chip.name.toLowerCase() ||
                                    location.pathname === chip.href;
                                return (
                                    <Link
                                        key={`${chip.name}-${chip.href}`}
                                        to={chip.href}
                                        className={`min-h-[38px] px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-medium whitespace-nowrap inline-flex items-center gap-1.5 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink ${
                                            isCurrentArea
                                                ? 'bg-pdp-ink text-white border-pdp-ink'
                                                : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:border-pdp-ink/40'
                                        }`}
                                    >
                                        <span>{chip.name}</span>
                                        <span
                                            className={`tabular-nums text-xs ${
                                                isCurrentArea ? 'text-white/75' : 'text-pdp-muted'
                                            }`}
                                        >
                                            {chip.count}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* 4. Featured Highlight Card */}
                    {!loading && propertyListOrdered.length > 0 && !hideChrome && activeFilterPills.length === 0 && (
                        <FeaturedPromoBanner properties={propertyListOrdered} />
                    )}

                    {/* 5. Results Heading */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-pdp-ink tracking-tight tabular-nums">
                            {loading && propertyListOrdered.length === 0
                                ? `Searching ${LISTING_TAB_LABEL[activeTabKey].toLowerCase()} in ${cityLabelDisplay}...`
                                : formatResultHeading(displayResultCount, activeTabKey, cityLabelDisplay)}
                        </h2>
                        {loadingMore && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-pdp-muted">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Loading more...
                            </span>
                        )}
                    </div>

                    {/* 6. Results Grid & States */}
                    {loading && propertyListOrdered.length === 0 ? (
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            aria-busy="true"
                            aria-label="Loading listings"
                        >
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="bg-pdp-surface rounded-[var(--radius-pdp)] border border-pdp-border overflow-hidden flex flex-col animate-pulse"
                                >
                                    <div className="w-full aspect-[16/10] bg-pdp-bg" />
                                    <div className="p-5 flex flex-col gap-3">
                                        <div className="h-3 w-16 bg-pdp-bg rounded" />
                                        <div className="h-5 w-3/4 bg-pdp-bg rounded" />
                                        <div className="h-4 w-1/2 bg-pdp-bg rounded" />
                                        <div className="flex gap-2 mt-1">
                                            <div className="h-6 w-20 bg-pdp-bg rounded-lg" />
                                            <div className="h-6 w-20 bg-pdp-bg rounded-lg" />
                                        </div>
                                        <div className="pt-3 mt-2 border-t border-pdp-border flex items-center justify-between">
                                            <div className="h-6 w-24 bg-pdp-bg rounded" />
                                            <div className="h-10 w-28 bg-pdp-bg rounded-[10px]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="py-12">
                            <ErrorMessage message={error.message} detail={error.detail} onRetry={refetch} />
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div
                                className={
                                    showMap
                                        ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] items-start'
                                        : ''
                                }
                            >
                                <div
                                    className={`grid grid-cols-1 ${
                                        showMap ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
                                    } gap-6`}
                                >
                                    {propertyListOrdered.length > 0 ? (
                                        propertyListOrdered.map((prop, idx) => {
                                            if (!prop || !prop.id) return null;
                                            return (
                                                <div key={`${prop.id}-${idx}`} className="h-full">
                                                    <PropertyCard property={prop} priority={idx === 0} />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full space-y-8">
                                            <div className="bg-pdp-surface rounded-[var(--radius-pdp)] border border-pdp-border p-8 md:p-12 text-center">
                                                <div className="w-12 h-12 rounded-full bg-pdp-bg border border-pdp-border flex items-center justify-center mx-auto mb-4">
                                                    <Search className="w-5 h-5 text-pdp-muted" />
                                                </div>
                                                <h3 className="font-serif-display text-2xl sm:text-3xl font-normal text-pdp-ink mb-2">
                                                    No matching listings right now
                                                </h3>
                                                <p className="text-sm sm:text-base text-pdp-muted max-w-lg mx-auto mb-6 leading-relaxed">
                                                    No listings matched those exact filters in {cityLabelDisplay}. Clear a filter to broaden the results or ask our team on WhatsApp for upcoming availability.
                                                </p>
                                                <div className="flex flex-wrap items-center justify-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={resetFilters}
                                                        className="min-h-[44px] px-5 py-2.5 rounded-[10px] border border-pdp-border bg-pdp-bg hover:border-pdp-ink text-sm font-medium text-pdp-ink transition-colors cursor-pointer"
                                                    >
                                                        Clear filters
                                                    </button>
                                                    <a
                                                        href={emptyWhatsappHref}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="min-h-[44px] px-5 py-2.5 rounded-[10px] bg-pdp-cta hover:bg-pdp-cta-hover text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        Ask on WhatsApp
                                                    </a>
                                                </div>
                                            </div>

                                            {areaChipsWithHref.length > 0 && (
                                                <div className="bg-pdp-surface rounded-[var(--radius-pdp)] p-6 border border-pdp-border">
                                                    <h4 className="text-base font-semibold text-pdp-ink mb-4">
                                                        Browse active areas in Bangalore
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {areaChipsWithHref.slice(0, 8).map((area) => (
                                                            <Link
                                                                key={area.name}
                                                                to={area.href}
                                                                className="min-h-[38px] px-3.5 py-1.5 rounded-full border border-pdp-border bg-pdp-bg text-xs sm:text-sm font-medium text-pdp-ink hover:border-pdp-ink inline-flex items-center gap-1.5"
                                                            >
                                                                <span>{area.name}</span>
                                                                <span className="text-xs text-pdp-muted tabular-nums">{area.count}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {showMap && (
                                    <aside className="lg:sticky lg:top-36 rounded-[var(--radius-pdp)] border border-pdp-border bg-pdp-surface overflow-hidden">
                                        <div className="px-4 py-3 border-b border-pdp-border">
                                            <p className="text-xs text-pdp-muted">Map view</p>
                                            <h3 className="text-sm font-semibold text-pdp-ink truncate">
                                                {LISTING_TAB_LABEL[activeTabKey]} in {cityLabelDisplay}
                                            </h3>
                                        </div>
                                        <div className="aspect-[4/3] bg-pdp-bg">
                                            <iframe
                                                title={`Map of listings in ${cityLabelDisplay}`}
                                                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                                                className="h-full w-full border-0"
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                    </aside>
                                )}
                            </div>

                            {hasMore && (
                                <div className="pt-4 pb-8 flex flex-col items-center">
                                    <div ref={setSentinelEl} className="h-6 w-full" aria-hidden />
                                    <button
                                        type="button"
                                        onClick={() => void loadMore()}
                                        disabled={loadingMore}
                                        className="min-h-[44px] px-6 py-2.5 rounded-[10px] bg-pdp-surface border border-pdp-border text-sm font-medium text-pdp-ink hover:border-pdp-ink transition-colors inline-flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>{loadingMore ? 'Loading more...' : 'Show more listings'}</span>
                                        {!loadingMore && <ChevronDown className="w-4 h-4" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {!hideChrome && <Footer />}

            {/* Floating Wishlist Shortcut */}
            {wishlist.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
                    <Link
                        to="/wishlist"
                        className="min-h-[52px] flex items-center justify-between px-4 py-3 bg-[#14161A] text-white rounded-[var(--radius-pdp)] shadow-xl border border-white/15"
                    >
                        <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 fill-pdp-cta text-pdp-cta shrink-0" />
                            <span className="text-sm font-medium tabular-nums">
                                {wishlist.length} saved {wishlist.length === 1 ? 'listing' : 'listings'}
                            </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90">
                            View wishlist
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function Properties(props: PropertiesProps) {
    return <PropertiesInner {...props} />;
}
