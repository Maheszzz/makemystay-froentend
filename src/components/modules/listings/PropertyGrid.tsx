import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { useProperties } from '@/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PropertyGridProps {
    category: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    searchQuery: string;
}

import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function PropertyGrid({ category, searchQuery }: PropertyGridProps) {
    const params = useMemo(() => ({
        listing_type: category === 'buy' || category === 'rent' ? category : undefined,
        property_type: category === 'plot' ? 'Plot' : category === 'pg' ? 'PG' : undefined,
        search: searchQuery,
        limit: 20
    }), [category, searchQuery]);

    const { properties, loading, error } = useProperties(params);

    // Fallback data in case of API error - Mirrors actual DB content


    // Filter out plots from buy/rent categories and limit to 4 for the home page
    const filteredProperties = properties.filter(prop => {
        if (category === 'buy' || category === 'rent') {
            const isNotPlot = prop.type?.toLowerCase() !== 'plot';
            // Explicitly filter out PG if we are requesting Rent category items
            const hidePgIfRent = category === 'rent' ? prop.type !== 'PG' : true;
            return isNotPlot && hidePgIfRent;
        }
        return true;
    }).slice(0, 4);

    if (loading) {
        return (
            <section className="py-20 bg-slate-50">
                <div className="flex justify-center">
                    <LoadingSpinner message="Loading latest listings..." />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <ErrorMessage
                            message="Failed to load properties"
                            detail={error.message}
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {category === 'buy' ? 'Featured Properties for Sale'
                                : category === 'plot' ? 'Premium Plots & Lands'
                                    : category === 'all' ? 'All Verified Properties'
                                        : 'Latest Rental Listings'}
                        </h2>
                        <p className="text-slate-500">Handpicked luxury properties that represent the best of what MakeMyStay has to offer</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((prop) => {
                            return (
                                <PropertyCard key={prop.id} property={prop} />
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <h3 className="text-xl font-semibold text-slate-900">No properties found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link to="/properties" className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md group">
                        View All Properties
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
