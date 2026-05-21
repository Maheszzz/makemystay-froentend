'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { SafetyPopup } from '@/components/modals/SafetyPopup';
import { InvestmentCalculator } from '@/components/modules/calculator/InvestmentCalculator';
import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import { ServicesGrid } from '@/components/modules/services/ServicesGrid';
import { About } from '@/components/sections/About';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { Comparison } from '@/components/sections/Comparison';
import { CTA } from '@/components/sections/CTA';
import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { FaqSection } from '@/components/seo/FaqSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { SEOHead } from '@/components/seo/SEOHead';
import { HOME_PG_FAQS } from '@/data/homePgSeo';
import {
    homeHeroTabToListingsCategory,
    parseHomeHeroTab,
    type HomeHeroNavigateTab,
    type ListingsCategoryKey,
} from '@/lib/listingsCategoryHubs';
import { buildFaqPageSchema, buildHomeOrganizationLocalWebGraph } from '@/lib/schema';
import { buildHomeSEO, buildPageSEO } from '@/lib/seo';
import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from '@/lib/navigation';

const LEGACY_HOME_CATEGORY = new Set<ListingsCategoryKey>(['pg', 'rent', 'buy', 'plot', 'all']);

function scrollToFeaturedListings() {
    requestAnimationFrame(() => {
        document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const heroTab = parseHomeHeroTab(searchParams.get('cat') ?? searchParams.get('category'));
    const listingsCategory = useMemo(() => homeHeroTabToListingsCategory(heroTab), [heroTab]);

    const [isSafetyPopupOpen, setIsSafetyPopupOpen] = useState(false);
    const [heroFilters, setHeroFilters] = useState<HeroSearchFilters>({
        city: 'bangalore',
        property_type: '',
        min_price: undefined,
        max_price: undefined,
        amenity: '',
        gender: '',
        move_in: '',
    });

    useEffect(() => {
        const hasShownHomeSafety = sessionStorage.getItem('hasShownHomeSafety');
        if (!hasShownHomeSafety) {
            setIsSafetyPopupOpen(true);
            sessionStorage.setItem('hasShownHomeSafety', 'true');
        }
    }, []);

    // Legacy `/?category=rent` → `/?cat=rent` on homepage (no redirect to hub pages).
    useEffect(() => {
        const legacy = searchParams.get('category');
        if (!legacy) return;
        if (!LEGACY_HOME_CATEGORY.has(legacy as ListingsCategoryKey)) {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete('category');
                    return next;
                },
                { replace: true }
            );
            return;
        }
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('category');
                if (legacy !== 'pg' && legacy !== 'all') {
                    next.set('cat', legacy);
                } else {
                    next.delete('cat');
                }
                return next;
            },
            { replace: true }
        );
    }, [searchParams, setSearchParams]);

    const setSearchQuery = useCallback(
        (newQuery: string) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (newQuery) {
                        next.set('q', newQuery);
                    } else {
                        next.delete('q');
                    }
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const setHeroTab = useCallback(
        (tab: HomeHeroNavigateTab) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (tab === 'pg') {
                        next.delete('cat');
                    } else {
                        next.set('cat', tab);
                    }
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const handleHubTabChange = useCallback(
        (tab: HomeHeroNavigateTab) => {
            setHeroTab(tab);
            scrollToFeaturedListings();
        },
        [setHeroTab]
    );

    const handleFilterSearch = useCallback(
        (tab: HomeHeroNavigateTab, query: string) => {
            setHeroTab(tab);
            setSearchQuery(query);
            scrollToFeaturedListings();
        },
        [setHeroTab, setSearchQuery]
    );

    const homeHelmet = buildPageSEO(buildHomeSEO());

    return (
        <>
            <SEOHead {...homeHelmet} />
            <JsonLd data={buildFaqPageSchema(HOME_PG_FAQS)} id="home-faq-schema" />
            <JsonLd data={buildHomeOrganizationLocalWebGraph()} id="home-org-local-website-schema" />

            <Navbar />
            <main id="main-content" className="min-h-screen bg-white pb-24 md:pb-0">
                <section id="home">
                    <Hero
                        category={listingsCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filters={heroFilters}
                        setFilters={setHeroFilters}
                        filterTabsInPlace
                        activeHubTab={heroTab}
                        onHubTabChange={handleHubTabChange}
                        onFilterSearch={handleFilterSearch}
                    />
                </section>

                <PropertyGrid
                    category={listingsCategory}
                    searchQuery={searchQuery}
                    cardVariant="project"
                    filters={heroFilters}
                    setFilters={setHeroFilters}
                />

                <section id="services" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Services</h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">Comprehensive solutions for every real estate need</p>
                    </div>
                    <ServicesGrid />
                </section>

                <InvestmentCalculator />

                <About />
                <Problem />
                <Solution />
                <Comparison />
                <CaseStudy />
                <CTA />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
                    <FaqSection
                        id="home-faq-heading"
                        title="Frequently asked questions"
                        items={HOME_PG_FAQS}
                        variant="light"
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
            <SafetyPopup isOpen={isSafetyPopupOpen} onClose={() => setIsSafetyPopupOpen(false)} />
        </>
    );
}
