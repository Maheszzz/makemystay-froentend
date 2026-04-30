import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, IndianRupee, ShieldCheck } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { MobilePropertyCarousel } from '@/components/modules/listings/MobilePropertyCarousel';
import { useProperties } from '@/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { PaginationParams } from '@/types/api';

interface PropertyGridProps {
    category: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    searchQuery: string;
}

export function PropertyGrid({ category, searchQuery }: PropertyGridProps) {
    const params = useMemo((): PaginationParams => {
        const p: PaginationParams = { 
            limit: 20,
            sort_by: 'review_count_desc'
        };
        // Align with backend tab semantics: pg | rent | buy | plot ("all" = no category filter).
        if (category !== 'all') {
            p.category = category;
        }
        const q = searchQuery.trim();
        if (q) {
            p.search = q;
        }
        return p;
    }, [category, searchQuery]);

    const { properties, loading, error } = useProperties(params);

    const safeProperties = Array.isArray(properties) ? properties : [];
    
    // Client-side sort fallback for 'review_count_desc' (matching Properties.tsx logic)
    const sortedProperties = useMemo(() => {
        return [...safeProperties].sort((a, b) => {
            const ca = (a.reviews ?? a.review_count ?? 0) || 0;
            const cb = (b.reviews ?? b.review_count ?? 0) || 0;
            return cb - ca;
        });
    }, [safeProperties]);

    // Filter for the home page (limit to 4)
    const filteredProperties = sortedProperties.slice(0, 4);

    const viewAllByCategory: Record<PropertyGridProps['category'], string> = {
        all: '/properties',
        pg: '/pg',
        rent: '/rent',
        buy: '/buy',
        plot: '/plots',
    };
    const viewAllPath = viewAllByCategory[category];

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
        <section className="py-10 md:py-20 bg-gradient-to-b from-stone-50 via-[#faf9f7] to-stone-100/50 pb-20 md:pb-20">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-1 md:mb-2 tracking-tight">
                            Featured PGs near you
                        </h2>
                        <p className="text-stone-500 text-sm md:text-base">Verified listings with real photos and transparent pricing</p>
                    </div>
                    <Link
                        to={viewAllPath}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:text-brand-red transition-colors"
                    >
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Mobile: horizontal swipe carousel (1 card visible) */}
            <MobilePropertyCarousel properties={filteredProperties} />

            {/* Desktop: 4-col grid */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
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
            </div>

            <div className="mt-8 md:mt-12 flex justify-center px-4">
                <Link to={viewAllPath} className="flex items-center gap-2 px-8 py-4 bg-white/95 border border-stone-300/80 text-stone-900 font-semibold rounded-xl hover:bg-stone-50 hover:border-stone-400/70 transition-all shadow-sm hover:shadow-md group w-full md:w-auto justify-center">
                    View All Properties
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-14">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="rounded-2xl border border-stone-200 bg-white/95 p-4">
                        <div className="flex items-center gap-2 text-stone-900 mb-1.5">
                            <BadgeCheck className="w-4 h-4 text-emerald-600" aria-hidden />
                            <p className="text-sm font-medium">Verified listings</p>
                        </div>
                        <p className="text-xs text-stone-600">Every PG is physically inspected by our team.</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white/95 p-4">
                        <div className="flex items-center gap-2 text-stone-900 mb-1.5">
                            <IndianRupee className="w-4 h-4 text-brand-gold" aria-hidden />
                            <p className="text-sm font-medium">Zero brokerage</p>
                        </div>
                        <p className="text-xs text-stone-600">No hidden fees or middlemen during booking.</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white/95 p-4">
                        <div className="flex items-center gap-2 text-stone-900 mb-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden />
                            <p className="text-sm font-medium">Real reviews</p>
                        </div>
                        <p className="text-xs text-stone-600">Only verified tenants can rate listed properties.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
