import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProperties } from '@/hooks';
import { Search, ArrowLeft, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Properties() {
    const [category, setCategory] = useState<'all' | 'buy' | 'rent'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [bhkFilter, setBhkFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const params = useMemo(() => ({
        listing_type: category === 'all' ? undefined : category,
        search: searchQuery,
        property_type: typeFilter === 'all' ? undefined : typeFilter
    }), [category, searchQuery, typeFilter]);

    // Fetch properties from API with server-side filters
    const { properties: apiProperties, loading, error, refetch } = useProperties(params);

    const properties = apiProperties;

    // Get unique locations for filter
    const locations = useMemo(() => {
        const locs = properties.map(p => p.location.split(',')[0].trim());
        return ['all', ...Array.from(new Set(locs))];
    }, [properties]);

    // Client-side filtering as a secondary layer (for location and BHK which might not be in API yet)
    const filteredProperties = useMemo(() => {
        // Only apply filters that AREN'T handled by server yet
        return properties.filter(prop => {
            const matchesLocation = locationFilter === 'all' || prop.location.toLowerCase().includes(locationFilter.toLowerCase());
            const matchesBHK = bhkFilter === 'all' || prop.type.includes(bhkFilter);
            return matchesLocation && matchesBHK;
        });
    }, [properties, locationFilter, bhkFilter]);

    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            <Navbar />

            <main className="pt-32 pb-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-red mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Find Your Perfect Home</h1>
                        <p className="text-slate-500 text-lg">Browse professional & verified listings</p>
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
                            <div className="flex gap-2">
                                <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                                    <button
                                        onClick={() => setCategory('all')}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${category === 'all' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setCategory('buy')}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${category === 'buy' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => setCategory('rent')}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${category === 'rent' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Rent
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setLocationFilter('all');
                                        setTypeFilter('all');
                                        setBhkFilter('all');
                                    }}
                                    className="px-4 text-sm font-bold text-slate-400 hover:text-brand-red transition-colors"
                                >
                                    Reset
                                </button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`rounded-2xl px-6 flex items-center gap-2 border-slate-200 transition-all ${showFilters ? 'bg-brand-charcoal text-white border-brand-charcoal' : 'hover:border-brand-red hover:text-brand-red'}`}
                                >
                                    {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                                    <span className="hidden sm:inline">Filters</span>
                                </Button>
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
                                                    <option value="PG">Paying Guest (PG)</option>
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
                    {loading && (
                        <div className="py-12">
                            <LoadingSpinner size={40} message="Loading properties from database..." />
                        </div>
                    )}

                    {error && (
                        <div className="mb-8">
                            <ErrorMessage
                                message={error.message}
                                detail={error.detail}
                                onRetry={refetch}
                            />
                        </div>
                    )}

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
