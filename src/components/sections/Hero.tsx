import { SmartSearchBar } from '@/components/modules/search/SmartSearchBar';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import type { HomeHeroNavigateTab } from '@/lib/listingsCategoryHubs';
import type { MarketplaceStats } from '@/views/Home';
import { BadgeCheck, CheckCircle, Clock3, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HeroBackgroundImage } from './HeroBackgroundImage';
import { PresentInCities } from './PresentInCities';

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
    marketplaceStats?: MarketplaceStats;
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
    marketplaceStats,
}: HeroProps) {
    const [imgError, setImgError] = useState(false);

    const trustStats = useMemo(() => {
        const items: { value: string; label: string; icon: typeof BadgeCheck }[] = [];

        if (marketplaceStats && marketplaceStats.totalListings > 0) {
            items.push({
                value: marketplaceStats.totalListings.toLocaleString('en-IN'),
                label: 'Live Verified Listings',
                icon: BadgeCheck,
            });
        }

        if (
            marketplaceStats &&
            marketplaceStats.averageRating !== null &&
            marketplaceStats.verifiedReviewCount > 0
        ) {
            items.push({
                value: `${marketplaceStats.averageRating.toFixed(1)}★`,
                label: `Avg. Rating (${marketplaceStats.verifiedReviewCount} reviews)`,
                icon: ShieldCheck,
            });
        }

        items.push({ value: 'Zero', label: 'Brokerage Fee', icon: CheckCircle });
        items.push({ value: 'Direct', label: 'Property Visits', icon: Clock3 });

        return items;
    }, [marketplaceStats]);

    return (
        <>
            <section
                id="home"
                className="relative w-full bg-page flex items-center overflow-hidden pt-24 lg:pt-0 min-h-[max(100svh,800px)] aspect-auto"
            >
                {/* Background — AVIF/WebP (~100–150 KB), not hero-sunset.jpg */}
                {!imgError && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <HeroBackgroundImage onError={() => setImgError(true)} />
                        {/* Mobile solid overlay */}
                        <div className="absolute inset-0 bg-page/95 lg:hidden" />
                        {/* Desktop smooth fade into --color-page */}
                        <div
                            className="hidden lg:block absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to right, var(--color-page) 0%, var(--color-page) 45%, transparent 75%)',
                            }}
                        />
                    </div>
                )}

                {/* Content Container Aligned with Navbar */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full py-12 lg:py-24">
                    <div className="max-w-[34rem] xl:max-w-2xl w-full">
                        {/* Headline */}
                        <h1 className="type-h1 text-ink mb-5">
                            Verified <span className="text-red">PGs & Flats</span>
                            <br />
                            in Bangalore
                        </h1>

                        {/* Subtitle */}
                        <p className="font-heading text-slate mb-6 text-base sm:text-lg max-w-md font-medium leading-relaxed">
                            Premium spaces in prime locations.
                            <br />
                            Flexible stays. All-inclusive living.
                        </p>

                        <div className="mb-8 flex flex-wrap gap-2">
                            {heroHighlights.map((label) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center rounded-lg border border-line bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink"
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
                        <PresentInCities
                            hideSectionLabel={false}
                            cityCounts={marketplaceStats?.cityCounts}
                        />
                    </div>
                </div>
            </section>

            {/* TRUST STATS BAR - Light theme */}
            <div className="relative z-20 bg-white border-y border-line">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8">
                    <div
                        className={`grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 ${
                            trustStats.length >= 4
                                ? 'md:grid-cols-4'
                                : trustStats.length === 3
                                  ? 'md:grid-cols-3'
                                  : 'md:grid-cols-2'
                        }`}
                    >
                        {trustStats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="flex flex-col items-center justify-center p-4 rounded-2xl text-center"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Icon
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-red shrink-0"
                                            aria-hidden
                                        />
                                        <span className="font-heading text-2xl sm:text-3xl font-black leading-none tracking-tight text-ink tabular-nums">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="font-heading text-[11px] sm:text-xs text-slate font-semibold tracking-wide uppercase">
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
