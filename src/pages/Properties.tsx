import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProperties, useSmartBack, useListingLocalityOptions } from '@/hooks';
import { Search, ArrowLeft, Filter, ChevronDown, Heart, RefreshCw } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { PROPERTY_CITY_OPTIONS } from '@/data/pgLocations';
import { propertyMatchesPgFeatureFilters } from '@/lib/propertySeoUtils';
import { buildPageSEO, listingsPageSeo } from '@/lib/seo';

const CATEGORY_KEYS = ['all', 'pg', 'rent', 'buy', 'plot'] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const CATEGORY_TAB_LABEL: Record<CategoryKey, string> = {
    all: 'All',
    pg: 'PG',
    rent: 'Rent',
    buy: 'Buy',
    plot: 'Plot',
};

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
    onEmptyResultsChange?: (isEmpty: boolean) => void;
}

export default function Properties({
    initialCategory = 'all',
    initialTypeFilter = 'all',
    initialCity = 'all',
    pageTitle = 'Find Your Perfect Home',
    pageSubtitle = 'Browse Professional & Verified Listings',
    hideChrome = false,
    initialMinPrice = '',
    initialMaxPrice = '',
    onEmptyResultsChange,
}: PropertiesProps) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const goBack = useSmartBack({ fallback: '/' });
    const { wishlist, clearWishlist } = useWishlist();

    // 1. Initialize state from URL or Props
    const [category, setCategory] = useState<'all' | 'pg' | 'rent' | 'buy' | 'plot'>(
        (searchParams.get('cat') as any) || initialCategory
    );
    const [locationFilter, setLocationFilter] = useState(searchParams.get('city') || initialCity);
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || initialTypeFilter);
    const [minPrice, setMinPrice] = useState(searchParams.get('min') || initialMinPrice);
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || initialMaxPrice);
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating_desc');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    
    const [showFilters, setShowFilters] = useState(false);

    // 2. Sync URL with State (Debounced for inputs)
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: Record<string, string> = {};
            if (category !== 'all') params.cat = category;
            if (locationFilter !== 'all') params.city = locationFilter;
            if (typeFilter !== 'all') params.type = typeFilter;
            if (minPrice) params.min = minPrice;
            if (maxPrice) params.max = maxPrice;
            if (sortBy !== 'rating_desc') params.sort = sortBy;
            if (searchQuery) params.q = searchQuery;

            // Preserve PG marketing filters (deep links from /pg/:slug chips)
            for (const key of ['wifi', 'food', 'ac', 'price'] as const) {
                const v = searchParams.get(key);
                if (v) params[key] = v;
            }

            // Only update if something changed to avoid unnecessary history entries
            const currentParams = Object.fromEntries(searchParams.entries());
            if (JSON.stringify(params) !== JSON.stringify(currentParams)) {
                setSearchParams(params, { replace: true });
            }
        }, 400); // 400ms debounce for all state changes to URL

        return () => clearTimeout(timer);
    }, [category, locationFilter, typeFilter, minPrice, maxPrice, sortBy, searchQuery, setSearchParams, searchParams]);

    // Update state if category props change (from App.tsx routes)
    useEffect(() => {
        if (initialCategory !== category && !searchParams.get('cat')) {
            setCategory(initialCategory);
        }
    }, [initialCategory]);

    // 3. Restore scroll position
    useEffect(() => {
        const key = location.key;
        const saved = sessionStorage.getItem(`scroll:${key}`);
        if (!saved) return;
        const y = Number(saved);
        if (Number.isFinite(y)) {
            requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
        }
    }, [location.key]);

    // Save scroll position
    useEffect(() => {
        const key = location.key;
        return () => {
            sessionStorage.setItem(`scroll:${key}`, String(window.scrollY || 0));
        };
    }, [location.key]);

    const wifiOn = searchParams.get('wifi') === 'true';
    const foodOn = searchParams.get('food') === 'true';
    const acOn = searchParams.get('ac') === 'true';
    const priceTier = searchParams.get('price');

    // 4. API Parameters (Derived from URL/State)
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
        const city = locationFilter === 'all' ? undefined : locationFilter;
        const sort_by = sortBy;

        const base = { search: q, min_price, max_price, city, sort_by };

        if (category === 'all') {
            return { ...base, property_type: typeFilter === 'all' ? undefined : typeFilter };
        }
        return { ...base, category };
    }, [category, searchQuery, typeFilter, minPrice, maxPrice, locationFilter, sortBy, priceTier]);

    const PAGE_SIZE = 24;
    const {
        properties,
        totalCount,
        loading,
        error,
        refetch,
        loadMore,
        hasMore,
        loadingMore,
    } = useProperties(apiParams, { infiniteScroll: true, pageSize: PAGE_SIZE });

    const propertyListFiltered = useMemo(() => {
        const list = Array.isArray(properties) ? properties : [];
        const flags = { wifi: wifiOn, food: foodOn, ac: acOn };
        if (!wifiOn && !foodOn && !acOn) return list;
        return list.filter((p) => propertyMatchesPgFeatureFilters(p, flags));
    }, [properties, wifiOn, foodOn, acOn]);

    const shouldNoindexEmptyResults = !loading && !error && propertyListFiltered.length === 0;

    const listingsHelmet = useMemo(() => {
        if (hideChrome) return null;
        const page = listingsPageSeo({
            pathname: location.pathname,
            pageTitle,
            pageSubtitle,
            category,
            cityLabel: locationFilter === 'all' ? 'all' : locationFilter,
            totalCount: totalCount ?? undefined,
        });
        return buildPageSEO({ ...page, noindex: shouldNoindexEmptyResults });
    }, [
        hideChrome,
        location.pathname,
        pageTitle,
        pageSubtitle,
        category,
        locationFilter,
        totalCount,
        shouldNoindexEmptyResults,
    ]);

    useEffect(() => {
        onEmptyResultsChange?.(shouldNoindexEmptyResults);
    }, [onEmptyResultsChange, shouldNoindexEmptyResults]);

    // Infinite scroll observer
    const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!sentinelEl || !hasMore || loading || loadingMore) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    void loadMore();
                }
            },
            { root: null, rootMargin: '600px', threshold: 0 }
        );
        obs.observe(sentinelEl);
        return () => obs.disconnect();
    }, [sentinelEl, hasMore, loading, loadingMore, loadMore]);

    const { areas: localitiesFromApi } = useListingLocalityOptions(
        initialCity !== 'all' ? initialCity : undefined
    );
    const cities = localitiesFromApi.length > 0 ? localitiesFromApi : PROPERTY_CITY_OPTIONS;

    const resetFilters = useCallback(() => {
        setMinPrice('');
        setMaxPrice('');
        setLocationFilter('all');
        setSortBy('rating_desc');
        setSearchQuery('');
        setTypeFilter('all');
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    const mainContent = (
            <main id={hideChrome ? undefined : 'main-content'} className={hideChrome ? 'pt-0 pb-16 flex-grow' : 'pt-32 pb-20 flex-grow'}>
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hideChrome ? '' : ''}`}>
                    {/* Header */}
                    {!hideChrome && (
                        <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="group mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-brand-red hover:shadow-md"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5 shrink-0 transition group-hover:-translate-x-0.5" aria-hidden />
                                    Back
                                </button>
                                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">{pageTitle}</h1>
                                <p className="text-slate-500 text-sm md:text-lg">{pageSubtitle}</p>
                            </div>
                        </div>
                    )}
                    {hideChrome && (
                        <div className="mb-8 rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/80 to-white p-6 md:p-8 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04]">
                            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-6">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Live inventory</p>
                                    <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                        Listings in {locationFilter === 'all' ? 'Bangalore' : locationFilter}
                                    </h2>
                                    <p className="text-slate-600 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">{pageSubtitle}</p>
                                </div>
                                {!loading && !error && (
                                    <div className="shrink-0 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-center shadow-sm">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Results</p>
                                        <p className="text-lg font-bold tabular-nums text-slate-900">
                                            {propertyListFiltered.length}
                                            <span className="text-slate-400 font-semibold"> / </span>
                                            {totalCount}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Unified Filter/Search Bar */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_8px_40px_-16px_rgba(15,23,42,0.1)] border border-slate-200/80 mb-8 sticky top-24 z-30 transition-all ring-1 ring-slate-900/[0.03]">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Search Input - 5 cols */}
                            <div className="lg:col-span-5 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search name, area, or landmark..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all text-sm shadow-inner"
                                />
                            </div>

                            {/* Category Tabs - 5 cols */}
                            <div className="lg:col-span-5 flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
                                {CATEGORY_KEYS.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`flex-1 px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${category === cat ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {CATEGORY_TAB_LABEL[cat]}
                                    </button>
                                ))}
                            </div>

                            {/* Actions - 2 cols */}
                            <div className="lg:col-span-2 flex items-center gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex-1 h-full min-h-[44px] rounded-xl border font-bold text-[11px] transition-all flex items-center justify-center gap-2 ${showFilters ? 'bg-brand-red border-brand-red text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white'}`}
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                    Filters
                                </button>
                                <div className="relative group">
                                    <button onClick={refetch} className="p-3 rounded-xl bg-slate-100 text-slate-400 hover:text-brand-red hover:bg-slate-200 transition-all">
                                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Advanced Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Sort By */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Sort By</label>
                                            <div className="relative">
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="w-full appearance-none px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium focus:ring-2 focus:ring-brand-red/10 outline-none pr-10"
                                                >
                                                    <option value="rating_desc">Best Rated</option>
                                                    <option value="price_asc">Price: Low to High</option>
                                                    <option value="price_desc">Price: High to Low</option>
                                                    <option value="newest">Newest First</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Budget */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Budget Range (₹)</label>
                                            <div className="flex items-center gap-2">
                                                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs focus:ring-2 focus:ring-brand-red/10 outline-none" />
                                                <span className="text-slate-300">to</span>
                                                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs focus:ring-2 focus:ring-brand-red/10 outline-none" />
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">City / Area</label>
                                            <div className="relative">
                                                <select
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                    className="w-full appearance-none px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium focus:ring-2 focus:ring-brand-red/10 outline-none pr-10"
                                                >
                                                    <option value="all">Anywhere in Bangalore</option>
                                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Type */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Configuration</label>
                                            <div className="relative">
                                                <select
                                                    value={typeFilter}
                                                    onChange={(e) => setTypeFilter(e.target.value)}
                                                    className="w-full appearance-none px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium focus:ring-2 focus:ring-brand-red/10 outline-none pr-10"
                                                >
                                                    <option value="all">Any Configuration</option>
                                                    <option value="1RK">1 RK</option>
                                                    <option value="1BHK">1 BHK</option>
                                                    <option value="2BHK">2 BHK</option>
                                                    <option value="3BHK">3 BHK</option>
                                                    <option value="Villa">Villa / Independent</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Results Count & Context */}
                    {!loading && !error && !hideChrome && (
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-slate-500 text-xs md:text-sm font-medium">
                                Showing{' '}
                                <span className="text-slate-900 font-bold">{propertyListFiltered.length}</span> of{' '}
                                <span className="text-slate-900 font-bold">{totalCount}</span> properties
                                {locationFilter !== 'all' && ` in ${locationFilter}`}
                                {(wifiOn || foodOn || acOn) && (
                                    <span className="text-slate-400"> (WiFi/food/AC filters apply to loaded results — scroll for more)</span>
                                )}
                            </p>
                            {loadingMore && <p className="text-[10px] font-black text-brand-red animate-pulse uppercase tracking-widest">Loading more listings...</p>}
                        </div>
                    )}
                    {!loading && !error && hideChrome && loadingMore && (
                        <div className="flex justify-end mb-4">
                            <p className="text-[10px] font-black text-brand-red animate-pulse uppercase tracking-widest">Loading more listings...</p>
                        </div>
                    )}

                    {/* API Status Messages */}
                    {loading && propertyListFiltered.length === 0 && (
                        <div className="py-20">
                            <LoadingSpinner size={48} message="Fetching verified listings..." />
                        </div>
                    )}

                    {error && (
                        <ErrorMessage message={error.message} detail={error.detail} onRetry={refetch} />
                    )}

                    {/* Property Grid */}
                    <div
                        className={`grid gap-6 md:gap-8 ${
                            hideChrome ? 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        }`}
                    >
                        {propertyListFiltered.length > 0 ? (
                            propertyListFiltered.map((prop) => <PropertyCard key={prop.id} property={prop} />)
                        ) : !loading && (
                            <div className="col-span-full py-20 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No properties matched your search</h3>
                                <p className="text-slate-500 max-w-md mx-auto text-sm mb-8">
                                    We couldn't find anything for "{searchQuery || locationFilter}" with your current filters. Try relaxing your budget or looking in other areas.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <button onClick={resetFilters} className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 hover:scale-105 transition-all">
                                        Reset All Filters
                                    </button>
                                    <button onClick={() => setLocationFilter('all')} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">
                                        Search Entire Bangalore
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Load More sentinel */}
                    {hasMore && (
                        <div className="mt-12 flex flex-col items-center">
                            <div ref={setSentinelEl} className="h-10 w-full" aria-hidden />
                            {!loadingMore && (
                                <button onClick={() => void loadMore()} className="px-8 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-brand-red hover:text-brand-red transition-all shadow-sm">
                                    Discover More Listings
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
    );

    if (hideChrome) {
        return (
            <div className="bg-slate-50 font-sans flex flex-col">
                {mainContent}
                <AnimatePresence>
                    {wishlist.length > 0 && (
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 lg:right-12 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 md:w-80"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-brand-red p-2 rounded-lg">
                                        <Heart className="w-4 h-4 fill-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold leading-none">Wishlist Ready</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{wishlist.length} properties saved</p>
                                    </div>
                                </div>
                                <Link to="/wishlist" className="bg-white text-slate-900 px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-brand-red hover:text-white transition-all">View</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            {listingsHelmet && <SEOHead {...listingsHelmet} />}

            <Navbar />

            {mainContent}

            {/* Wishlist Floating Bar (Mobile optimized) */}
            <AnimatePresence>
                {wishlist.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 lg:right-12 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 md:w-80"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-red p-2 rounded-lg">
                                    <Heart className="w-4 h-4 fill-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold leading-none">Wishlist Ready</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{wishlist.length} properties saved</p>
                                </div>
                            </div>
                            <Link to="/wishlist" className="bg-white text-slate-900 px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-brand-red hover:text-white transition-all">View</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
