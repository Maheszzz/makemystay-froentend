import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { Button } from '@/components/ui/Button';
import { useProperties } from '@/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PropertyGridProps {
    category: 'buy' | 'rent';
    searchQuery: string;
}

export function PropertyGrid({ category, searchQuery }: PropertyGridProps) {
    const params = useMemo(() => ({
        listing_type: category,
        search: searchQuery,
        limit: 12
    }), [category, searchQuery]);

    const { properties, loading, error } = useProperties(params);

    // Fallback data in case of API error - Mirrors actual DB content
    const FALLBACK_PROPERTIES: any[] = [
        {
            id: 1,
            title: 'Kings & Queens Coliving',
            sharing: ['Single', 'Double', 'Triple'],
            food: true,
            location: 'Kundlahalli',
            price: '₹11,999/mo',
            type: 'Colive PG',
            beds: 1,
            baths: 1,
            sqft: 'On Request',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
            images: [],
            tag: 'Available',
            category: 'rent',
            description: 'New one',
            features: ['fully furnished', 'Colive PG'],
            rating: 4.5,
            reviews: 0,
            is_available: true
        },
        {
            id: 14,
            title: 'Flock 9 Coliving',
            sharing: ['Single', 'Double', 'Triple'],
            food: true,
            location: 'Thubarahalli',
            price: '₹12,999/mo',
            type: 'PG',
            beds: 1,
            baths: 1,
            sqft: 'On Request',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
            images: [],
            tag: 'Available',
            category: 'rent',
            description: 'Added via bulk script - 04/02/2026',
            features: ['', 'PG'],
            rating: 4.5,
            reviews: 0,
            is_available: true
        },
        {
            id: 15,
            title: 'Arcade Inn Coliving',
            sharing: ['Single', 'Double'],
            food: true,
            location: 'Marathahalli',
            price: '₹15,999/mo',
            type: 'PG',
            beds: 1,
            baths: 1,
            sqft: 'On Request',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
            images: [],
            tag: 'Available',
            category: 'rent',
            description: 'Added via bulk script - 04/02/2026',
            features: ['', 'PG'],
            rating: 4.5,
            reviews: 0,
            is_available: true
        },
        {
            id: 16,
            title: 'Urban living',
            location: 'Kadubeesnahalli',
            price: '₹24,999/mo',
            type: '1BHK',
            beds: 1,
            baths: 1,
            sqft: 'On Request',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
            images: [],
            tag: 'Available',
            category: 'rent',
            description: 'Added via bulk script - 04/02/2026',
            features: ['', '1BHK'],
            rating: 4.5,
            reviews: 0,
            is_available: true
        }
    ];

    // Use fallback properties if there's an error
    const displayProperties = error ? FALLBACK_PROPERTIES : properties;

    // Filter fallback data client-side if error, otherwise use API results directly
    const filteredProperties = error
        ? displayProperties.filter(prop => {
            const matchesCategory = prop.category === category;
            const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        }).slice(0, 4)
        : displayProperties.slice(0, 4); // Limit to 4 for the home page

    if (loading && !error) {
        return (
            <section className="py-20 bg-slate-50">
                <div className="flex justify-center">
                    <LoadingSpinner message="Loading latest listings..." />
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
                            {category === 'buy' ? 'Featured Properties for Sale' : 'Latest Rental Listings'}
                        </h2>
                        <p className="text-slate-500">Handpicked luxury properties that represent the best of what MakeMyStay has to offer</p>
                    </div>
                    <Link to="/properties" className="hidden sm:flex items-center text-sm font-bold text-slate-900 hover:text-brand-red transition-colors">
                        View All Properties <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
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

                <div className="mt-8 sm:hidden flex justify-center">
                    <Link to="/properties">
                        <Button variant="outline">View All Properties</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
