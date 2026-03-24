import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProperties, useSmartBack } from '@/hooks';
import { Search, ArrowLeft, Filter, X, ChevronDown, Heart, Trash2, MapPin } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { getPropertyDetailPath } from '@/lib/propertyRouting';

interface PropertiesProps {
    initialCategory?: 'all' | 'pg' | 'rent' | 'buy' | 'plot';
    initialTypeFilter?: string;
    pageTitle?: string;
    pageSubtitle?: string;
}

export default function Properties({
    initialCategory = 'all',
    initialTypeFilter,
    pageTitle = 'Find Your Perfect Home',
    pageSubtitle = 'Browse professional & verified listings'
}: PropertiesProps) {
    const location = useLocation();
    const goBack = useSmartBack({ fallback: '/' });
    const [category, setCategory] = useState<'all' | 'pg' | 'rent' | 'buy' | 'plot'>(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const { wishlist, clearWishlist, toggleWishlist } = useWishlist();

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const [locationFilter, setLocationFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState(initialTypeFilter || 'all');

    // Restore scroll position when navigating back to this page.
    // We key by location.key so each history entry gets its own scrollY.
    useEffect(() => {
        const key = location.key;
        const saved = sessionStorage.getItem(`scroll:${key}`);
        if (!saved) return;
        const y = Number(saved);
        if (!Number.isFinite(y)) return;
        // Defer to allow layout/content to paint.
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
    }, [location.key]);

    // Save scroll position for this history entry when leaving the page.
    useEffect(() => {
        const key = location.key;
        return () => {
            try {
                sessionStorage.setItem(`scroll:${key}`, String(window.scrollY || 0));
            } catch {
                // ignore storage errors (private mode, quota, etc.)
            }
        };
    }, [location.key]);

    useEffect(() => {
        setCategory(initialCategory);
        setTypeFilter(initialTypeFilter || 'all');
    }, [initialCategory, initialTypeFilter]);
    const [showFilters, setShowFilters] = useState(false);
    // Use backend `category` (pg|rent|buy|plot) so PG never appears under RENT, etc.
    // For "All", keep legacy property_type + no category. For rent/buy + BHK filter, narrow client-side.
    const params = useMemo(() => {
        const search = debouncedSearchQuery.trim() || undefined;
        if (category === 'all') {
            return {
                search,
                property_type: typeFilter === 'all' ? undefined : typeFilter,
            };
        }
        return {
            search,
            category,
        };
    }, [category, debouncedSearchQuery, typeFilter]);

    // Fetch properties from API with server-side filters
    const { properties: apiProperties, loading, error, refetch } = useProperties(params);

    const properties = apiProperties;

    // Get unique locations for filter
    const locations = useMemo(() => {
        const locs = properties.map(p => p.location.split(',')[0].trim());
        return ['all', ...Array.from(new Set(locs))];
    }, [properties]);

    const filteredProperties = useMemo(() => {
        return properties.filter((prop) => {
            const matchesLocation =
                locationFilter === 'all' || prop.location.toLowerCase().includes(locationFilter.toLowerCase());
            if (!matchesLocation) return false;
            // "All" tab: BHK/type already applied via API `property_type`.
            if (category === 'all' || typeFilter === 'all') return true;
            if (category === 'pg' || category === 'plot') return true;
            const t = String(prop.type || '');
            return t === typeFilter || t.toLowerCase() === typeFilter.toLowerCase();
        });
    }, [properties, locationFilter, category, typeFilter]);

    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            <Helmet>
                <title>{pageTitle} | MakeMyStay.ai</title>
                <meta name="description" content={pageSubtitle} />
                <link rel="canonical" href={`https://www.makemystay.ai${location.pathname}`} />
            </Helmet>

            <Navbar />

            <main id="main-content" className="pt-32 pb-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 md:mb-12">
                        <button
                            type="button"
                            onClick={goBack}
                            className="inline-flex items-center text-xs text-slate-500 hover:text-brand-red mb-3 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                        </button>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">{pageTitle}</h1>
                        <p className="text-slate-500 text-sm md:text-lg">{pageSubtitle}</p>
                    </div>

                    {/* Search and Category Toggle */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 mb-8 md:mb-12">

                        {/* Row 1: Search Input */}
                        <div className="relative mb-3">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by property name, city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm md:text-base"
                            />
                        </div>

                        {/* Row 2: Category tabs + Filter button — always on one line */}
                        <div className="flex items-center gap-2 min-w-0">
                            {/* Wrapping category strip instead of scrolling */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl gap-0.5">
                                    <Link to="/properties" className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/properties' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>All</Link>
                                    <Link to="/pg" className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/pg' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>PG</Link>
                                    <Link to="/rent" className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/rent' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Rent</Link>
                                    <Link to="/buy" className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/buy' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Buy</Link>
                                    <Link to="/plots" className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/plots' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Plot</Link>
                                </div>
                            </div>

                            {/* Reset + Filter — pinned right, never overflow */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => { setLocationFilter('all'); setTypeFilter('all'); }}
                                    className="h-8 px-2.5 text-[11px] font-bold text-slate-400 hover:text-brand-red transition-colors flex items-center whitespace-nowrap"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`h-8 px-3 rounded-xl flex items-center justify-center gap-1 border transition-all shadow-sm shrink-0 ${showFilters ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-600 hover:text-emerald-600'}`}
                                    aria-label="Toggle Filters"
                                >
                                    {showFilters ? <X className="w-3.5 h-3.5" /> : <Filter className="w-3.5 h-3.5" />}
                                    <span className="font-bold text-[11px]">Filter</span>
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 mt-2 pb-2">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Location</label>
                                            <div className="relative">
                                                <select
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 bg-slate-50/50 text-sm font-medium appearance-none"
                                                >
                                                    <option value="all">Everywhere</option>
                                                    {locations.filter(l => l !== 'all').map(loc => (
                                                        <option key={loc} value={loc}>{loc}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Property Type</label>
                                            {category === 'plot' ? (
                                                <div className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-500">
                                                    Plot
                                                </div>
                                            ) : category === 'pg' ? (
                                                <div className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-500">
                                                    PG
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <select
                                                        value={typeFilter}
                                                        onChange={(e) => setTypeFilter(e.target.value)}
                                                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 bg-slate-50/50 text-sm font-medium appearance-none"
                                                    >
                                                        <option value="all">Any Type</option>
                                                        {category !== 'rent' && category !== 'all' && <option value="PG">Paying Guest (PG)</option>}
                                                        <option value="1RK">1 RK</option>
                                                        <option value="1BHK">1 BHK</option>
                                                        <option value="2BHK">2 BHK</option>
                                                        <option value="3BHK">3 BHK</option>
                                                        <option value="Villa">Villa</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                </div>
                                            )}
                                        </div>


                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* API Status Messages */}
                    {(loading || searchQuery !== debouncedSearchQuery) && (
                        <div className="py-12">
                            <LoadingSpinner size={40} message={searchQuery !== debouncedSearchQuery ? "Waiting for you to finish typing..." : "Loading properties from database..."} />
                        </div>
                    )}

                    {error && searchQuery === debouncedSearchQuery && (
                        <div className="mb-8">
                            <ErrorMessage
                                message={error.message}
                                detail={error.detail}
                                onRetry={refetch}
                            />
                        </div>
                    )}

                    {/* Saved / Wishlist Section — Flipkart Style */}
                    <AnimatePresence>
                        {wishlist.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="mb-12"
                            >
                                {/* Section Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-brand-red text-brand-red" />
                                        <h2 className="text-xl font-bold text-slate-900">My Wishlist</h2>
                                        <span className="text-xs font-semibold bg-brand-red/10 text-brand-red px-2.5 py-1 rounded-full">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
                                    </div>
                                    <button
                                        onClick={clearWishlist}
                                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-red transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Clear Wishlist
                                    </button>
                                </div>

                                {/* Wishlist Items */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
                                    <AnimatePresence>
                                        {wishlist.map((prop) => (
                                            <motion.div
                                                key={prop.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-slate-50/60 transition-colors group">
                                                    {/* Absolute Remove Button for mobile space saving */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleWishlist(prop);
                                                        }}
                                                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-full transition-colors z-10"
                                                        aria-label="Remove from Wishlist"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>

                                                    {/* Thumbnail */}
                                                    <Link to={getPropertyDetailPath(prop)} className="shrink-0 block mt-1">
                                                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                                                            <img
                                                                src={(prop.images && prop.images[0]) || prop.image || ''}
                                                                alt={prop.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    </Link>

                                                    {/* Details & Actions combined */}
                                                    <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                                                        <div className="mb-2">
                                                            <Link to={getPropertyDetailPath(prop)}>
                                                                <h3 className="font-bold text-slate-900 text-[15px] sm:text-base hover:text-brand-red transition-colors truncate leading-tight">{prop.title}</h3>
                                                            </Link>
                                                            <p className="text-slate-400 text-[11px] sm:text-xs mt-1 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{prop.location}</span>
                                                            </p>
                                                        </div>

                                                        {/* Bottom Row: Price, Tag, View Button */}
                                                        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 mt-1">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-brand-red font-bold text-base sm:text-lg leading-none">{prop.price}</span>
                                                                    {prop.category === 'rent' && <span className="text-slate-400 text-[10px] sm:text-xs">/mo</span>}
                                                                </div>
                                                                <span className={`w-fit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${prop.category === 'buy' ? 'bg-brand-red/10 text-brand-red' : 'bg-slate-100 text-slate-500'}`}>
                                                                    {prop.category === 'buy' ? 'Sale' : 'Rent'}
                                                                </span>
                                                            </div>

                                                            <Link
                                                                to={getPropertyDetailPath(prop)}
                                                                className="bg-brand-red text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-sm hover:bg-brand-red/90 hover:shadow transition-all whitespace-nowrap mt-1 sm:mt-0"
                                                            >
                                                                View
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div className="mt-8 border-b border-slate-200" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results count */}
                    {!loading && !error && (
                        <p className="text-slate-500 mb-6">
                            {filteredProperties.length} properties found
                        </p>
                    )}

                    {/* Property Grid */}
                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProperties.length > 0 ? (
                                filteredProperties.map((prop) => (
                                    <PropertyCard key={prop.id} property={prop} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <h3 className="text-xl font-semibold text-slate-900">No properties found</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your search criteria</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
