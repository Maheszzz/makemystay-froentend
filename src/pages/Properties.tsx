import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProperties } from '@/hooks';
import { Search, ArrowLeft, Filter, X, ChevronDown, Heart, Trash2, MapPin } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';

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
    const [bhkFilter, setBhkFilter] = useState('all');

    useEffect(() => {
        setCategory(initialCategory);
        setTypeFilter(initialTypeFilter || 'all');
    }, [initialCategory, initialTypeFilter]);
    const [showFilters, setShowFilters] = useState(false);
    const params = useMemo(() => {
        return {
            listing_type: category === 'all' || category === 'plot' || category === 'pg' ? undefined : category,
            search: debouncedSearchQuery.trim() || undefined,
            property_type: category === 'plot' ? 'Plot' : category === 'pg' ? 'PG' : (typeFilter === 'all' ? undefined : typeFilter),
            exclude_property_type: category === 'rent' ? 'PG' : category === 'buy' ? 'Plot' : undefined
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
        // Only apply filters that AREN'T handled by server yet
        return properties.filter(prop => {
            const matchesLocation = locationFilter === 'all' || prop.location.toLowerCase().includes(locationFilter.toLowerCase());
            const matchesBHK = bhkFilter === 'all' || prop.type.includes(bhkFilter);
            return matchesLocation && matchesBHK;
        });
    }, [properties, locationFilter, bhkFilter, category]);

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
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-red mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">{pageTitle}</h1>
                        <p className="text-slate-500 text-lg">{pageSubtitle}</p>
                    </div>

                    {/* Search and Category Toggle */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-12">
                        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by property name, city, or project..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex items-center justify-between w-full md:w-auto gap-2">
                                {/* Segmented Control */}
                                <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-hide shrink-0 max-w-[calc(100vw-140px)] md:max-w-none">
                                    <Link
                                        to="/properties"
                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/properties' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        All
                                    </Link>
                                    <Link
                                        to="/pg"
                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/pg' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        PG
                                    </Link>
                                    <Link
                                        to="/rent"
                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/rent' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Rent
                                    </Link>
                                    <Link
                                        to="/buy"
                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/buy' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Buy
                                    </Link>
                                    <Link
                                        to="/plots"
                                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${location.pathname === '/plots' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Plot
                                    </Link>
                                </div>

                                {/* Right Side Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setLocationFilter('all');
                                            setTypeFilter('all');
                                            setBhkFilter('all');
                                        }}
                                        className="h-9 px-3 text-xs font-bold text-slate-400 hover:text-brand-red transition-colors flex items-center"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`h-9 md:h-10 px-2.5 md:px-4 rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition-all shadow-sm ${showFilters ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-600'}`}
                                        aria-label="Toggle Filters"
                                    >
                                        {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-3.5 h-3.5" />}
                                        <span className="font-bold text-[10px] md:text-sm">Filter</span>
                                    </button>
                                </div>
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
                                                <div className="flex items-start gap-4 p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                                                    {/* Thumbnail */}
                                                    <Link to={`/properties/${prop.type === 'PG' ? 'pg' : prop.category?.toLowerCase() || 'rent'}/${prop.slug}`} className="shrink-0">
                                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100">
                                                            <img
                                                                src={(prop.images && prop.images[0]) || prop.image || ''}
                                                                alt={prop.title}
                                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    </Link>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                        <div>
                                                            <Link to={`/properties/${prop.type === 'PG' ? 'pg' : prop.category?.toLowerCase() || 'rent'}/${prop.slug}`}>
                                                                <h3 className="font-bold text-slate-900 text-sm sm:text-base hover:text-brand-red transition-colors truncate">{prop.title}</h3>
                                                            </Link>
                                                            <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{prop.location}</span>
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between sm:justify-start gap-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-brand-red font-bold text-base sm:text-lg">{prop.price}</span>
                                                                {prop.category === 'rent' && <span className="text-slate-400 text-[10px] sm:text-xs">/mo</span>}
                                                            </div>
                                                            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${prop.category === 'buy' ? 'bg-brand-red/10 text-brand-red' : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                {prop.category === 'buy' ? 'For Sale' : 'For Rent'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                                                        <button
                                                            onClick={() => toggleWishlist(prop)}
                                                            className="text-[10px] sm:text-xs text-slate-400 hover:text-brand-red transition-colors flex items-center gap-1 whitespace-nowrap"
                                                        >
                                                            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Remove</span>
                                                        </button>
                                                        <Link
                                                            to={`/properties/${prop.type === 'PG' ? 'pg' : prop.category?.toLowerCase() || 'rent'}/${prop.slug}`}
                                                            className="bg-brand-red text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-brand-red/90 transition-colors whitespace-nowrap"
                                                        >
                                                            View
                                                        </Link>
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
