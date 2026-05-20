import { SmartSearchBar } from '@/components/modules/search/SmartSearchBar';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import type { HomeHeroNavigateTab } from '@/lib/listingsCategoryHubs';
import { BadgeCheck, CheckCircle, Clock3, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { PresentInCities } from './PresentInCities';

// Single best-fit photo — modern apartment exterior, clean lines
const HERO_IMAGE = '/images/blog/hero-sunset.jpg';

const trustStats = [
    { value: '1,200+', label: 'Verified Listings', icon: BadgeCheck },
    { value: '4.7★', label: 'Avg. Tenant Rating', icon: ShieldCheck },
    { value: 'Zero', label: 'Brokerage Fee', icon: CheckCircle },
    { value: '48hr', label: 'Booking Guarantee', icon: Clock3 },
];

const heroHighlights = [
    'Prime Locations',
    'All Inclusive',
    'Flexible Stays',
    'Safe & Secure',
];

interface HeroProps {
    category: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    setCategory?: (category: 'pg' | 'rent' | 'buy' | 'plot' | 'all') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    listingsNavigate?: (tab: HomeHeroNavigateTab, query: string) => void;
    filterTabsInPlace?: boolean;
    activeHubTab?: HomeHeroNavigateTab;
    onHubTabChange?: (tab: HomeHeroNavigateTab) => void;
    onFilterSearch?: (tab: HomeHeroNavigateTab, query: string) => void;
    filters?: HeroSearchFilters;
    setFilters?: (next: HeroSearchFilters) => void;
}

export function Hero({
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    listingsNavigate,
    filterTabsInPlace,
    activeHubTab,
    onHubTabChange,
    onFilterSearch,
    filters,
    setFilters,
}: HeroProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <>
            <section
                id="home"
                className="relative w-full bg-slate-50 flex items-center overflow-hidden pt-24 lg:pt-0"
                style={{ minHeight: 'max(100svh, 800px)' }}
            >
                {/* Background Full-Screen Image */}
                {!imgError && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src={HERO_IMAGE}
                            alt="Modern apartment"
                            className="w-full h-full object-cover object-center"
                            onError={() => setImgError(true)}
                            fetchPriority="high"
                            decoding="async"
                        />
                        {/* Mobile solid overlay */}
                        <div className="absolute inset-0 bg-slate-50/95 lg:hidden" />
                        {/* Desktop smooth gradient fade */}
                        <div 
                            className="hidden lg:block absolute inset-0"
                            style={{
                                background: 'linear-gradient(to right, rgba(248,250,252,1) 0%, rgba(248,250,252,1) 45%, rgba(248,250,252,0) 75%)'
                            }} 
                        />
                    </div>
                )}

                {/* Content Container Aligned with Navbar */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full py-12 lg:py-24">
                    <div className="max-w-[34rem] xl:max-w-2xl w-full">
                            {/* Headline */}
                            <h1
                                className="font-black text-slate-900 leading-[1.06] tracking-tight mb-5"
                                style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontSize: 'clamp(2.4rem, 4.6vw, 4rem)',
                                }}
                            >
                                Comfortable <span className="text-brand-red">spaces</span><br />
                                Hassle-free living
                            </h1>

                            {/* Subtitle */}
                            <p className="text-slate-600 mb-6 text-base sm:text-lg max-w-md font-medium leading-relaxed"
                               style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Premium spaces in prime locations.<br />
                                Flexible stays. All-inclusive living.
                            </p>

                            <div className="mb-8 flex flex-wrap gap-2">
                                {heroHighlights.map((label) => (
                                    <span
                                        key={label}
                                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {/* Search bar */}
                            <div className="mb-12 w-full">
                                <SmartSearchBar
                                    category={category}
                                    setCategory={setCategory}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    listingsNavigate={listingsNavigate}
                                    filterTabsInPlace={filterTabsInPlace}
                                    activeHubTab={activeHubTab}
                                    onHubTabChange={onHubTabChange}
                                    onFilterSearch={onFilterSearch}
                                    filters={filters}
                                    setFilters={setFilters}
                                />
                            </div>

                            {/* Present In Cities component */}
                            <PresentInCities hideSectionLabel={false} />
                        </div>
                </div>
            </section>

            {/* TRUST STATS BAR - Light theme */}
            <div className="relative z-20 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {trustStats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="flex flex-col items-center justify-center p-4 transition-all duration-300 rounded-2xl hover:bg-slate-50"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0" aria-hidden />
                                        <span
                                            className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-slate-900"
                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        >
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p
                                        className="text-[11px] sm:text-xs text-slate-500 font-semibold tracking-wide uppercase"
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
