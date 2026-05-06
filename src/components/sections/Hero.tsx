import { useState } from 'react';
import { CheckCircle, ShieldCheck, Clock3, BadgeCheck } from 'lucide-react';
import { SmartSearchBar } from '@/components/modules/search/SmartSearchBar';
import type { HomeHeroNavigateTab } from '@/lib/listingsCategoryHubs';
import { PresentInCities } from './PresentInCities';

// Single best-fit photo — modern apartment exterior, clean lines
const HERO_IMAGE = '/images/blog/hero-sunset.jpg';

const trustStats = [
    { value: '1,200+', label: 'Verified Listings', icon: BadgeCheck },
    { value: '4.7★', label: 'Avg. Tenant Rating', icon: ShieldCheck },
    { value: 'Zero', label: 'Brokerage Fee', icon: CheckCircle },
    { value: '48hr', label: 'Booking Guarantee', icon: Clock3 },
];

interface HeroProps {
    category: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    setCategory?: (category: 'pg' | 'rent' | 'buy' | 'plot' | 'all') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    listingsNavigate?: (tab: HomeHeroNavigateTab, query: string) => void;
}

export function Hero({ category, setCategory, searchQuery, setSearchQuery, listingsNavigate }: HeroProps) {
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
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-24">
                    <div className="max-w-xl xl:max-w-2xl w-full">
                            {/* Live badge */}
                            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-brand-red/10 border border-brand-red/20">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-70" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
                                </span>
                                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-800">
                                    <span className="text-brand-red">1,200+</span> Verified · Bangalore
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-black text-slate-900 leading-[1.1] tracking-tight mb-6"
                                style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                }}>
                                Smart PG stays,<br />
                                <span className="text-brand-red">near where you work.</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-slate-600 mb-10 text-base sm:text-lg max-w-md font-medium leading-relaxed"
                               style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Transparent pricing · Real photos · Zero brokerage
                            </p>

                            {/* Search bar */}
                            <div className="mb-12 w-full">
                                <SmartSearchBar
                                    category={category}
                                    setCategory={setCategory}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    listingsNavigate={listingsNavigate}
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
