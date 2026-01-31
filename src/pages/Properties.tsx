import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProperties } from '@/hooks';
import { properties as fallbackProperties } from '@/data/properties';
import { MapPin, Bed, Bath, Hash, Search, ArrowLeft } from 'lucide-react';

export default function Properties() {
    const [category, setCategory] = useState<'all' | 'buy' | 'rent'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch properties from API
    const { properties: apiProperties, loading, error, refetch } = useProperties();

    // Use API data if available, fallback to mock data on error
    const properties = error ? fallbackProperties : apiProperties;

    // Client-side filtering
    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const matchesCategory = category === 'all' || prop.category === category;
            const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [properties, category, searchQuery]);

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-red mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">All Properties</h1>
                        <p className="text-slate-500 text-lg">Browse our complete collection of luxury properties</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-12">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={category === 'all' ? 'primary' : 'outline'}
                                onClick={() => setCategory('all')}
                                className={category === 'all' ? 'bg-brand-red text-white' : ''}
                            >
                                All
                            </Button>
                            <Button
                                variant={category === 'buy' ? 'primary' : 'outline'}
                                onClick={() => setCategory('buy')}
                                className={category === 'buy' ? 'bg-brand-red text-white' : ''}
                            >
                                For Sale
                            </Button>
                            <Button
                                variant={category === 'rent' ? 'primary' : 'outline'}
                                onClick={() => setCategory('rent')}
                                className={category === 'rent' ? 'bg-brand-red text-white' : ''}
                            >
                                For Rent
                            </Button>
                        </div>
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
                            <p className="text-sm text-slate-500 text-center mt-4">
                                Showing fallback data. The backend might not be running.
                            </p>
                        </div>
                    )}

                    {/* Results count */}
                    {!loading && (
                        <p className="text-slate-500 mb-6">
                            {filteredProperties.length} properties found
                            {error && <span className="text-orange-600 ml-2">(using fallback data)</span>}
                        </p>
                    )}

                    {/* Property Grid */}
                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProperties.length > 0 ? (
                                filteredProperties.map((prop) => (
                                    <Link to={`/property/${prop.id}`} key={prop.id} className="block group">
                                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 border-l-4 border-l-brand-red shadow-sm hover:shadow-[0_10px_40px_rgba(217,32,39,0.1)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                            <div className="relative h-64 overflow-hidden">
                                                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-4 left-4 bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                                    {prop.tag}
                                                </div>
                                                <div className="absolute top-4 right-4 bg-brand-charcoal/90 text-white text-xs font-medium px-2 py-1 rounded-lg uppercase">
                                                    {prop.category === 'buy' ? 'Sale' : 'Rent'}
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center text-xs text-slate-500 mb-2">
                                                    <MapPin className="w-3 h-3 mr-1 text-brand-red" /> {prop.location}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-brand-red transition-colors">{prop.title}</h3>

                                                <div className="flex items-center space-x-4 text-xs text-slate-500 my-4 py-4 border-t border-b border-slate-100">
                                                    <div className="flex items-center">
                                                        <Bed className="w-4 h-4 mr-1 text-brand-charcoal" /> {prop.beds} Beds
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Bath className="w-4 h-4 mr-1 text-brand-charcoal" /> {prop.baths} Baths
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Hash className="w-4 h-4 mr-1 text-brand-charcoal" /> {prop.sqft} sqft
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="text-xl font-bold text-brand-red">{prop.price}</div>
                                                    <div className="text-xs font-medium text-slate-400 uppercase">{prop.type}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
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
