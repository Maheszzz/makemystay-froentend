'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import { Hero } from '@/components/sections/Hero';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildHomeFaqs } from '@/data/homePgSeo';
import type { HomeInventorySummary } from '@/lib/homeInventoryStats';
import {
    homeHeroSearchUrl,
    homeHeroTabToListingsCategory,
    parseHomeHeroTab,
    type HomeHeroNavigateTab,
    type ListingsCategoryKey,
} from '@/lib/listingsCategoryHubs';
import { useScrollMemory } from '@/hooks';
import { useSearchParams } from '@/lib/navigation';
import { buildFaqPageSchema, buildHomeOrganizationLocalWebGraph } from '@/lib/schema';
import { HomeBelowFold } from '@/views/HomeBelowFold';
import type { Property } from '@/types/api';

export interface CityInventoryCounts {
    bangalore: number;
    hyderabad: number;
    pune: number;
}

export interface MarketplaceStats {
    totalListings: number;
    verifiedReviewCount: number;
    averageRating: number | null;
    cityCounts: CityInventoryCounts;
}

const LEGACY_HOME_CATEGORY = new Set<ListingsCategoryKey>(['pg', 'rent', 'buy', 'plot', 'all']);

/**
 * Isolated leaf component to read URL search parameters.
 * Only this tiny child bails out in Suspense, preserving static/ISR HTML for the rest of the page.
 */
function HomeUrlSync({ onChange }: { onChange: (q: string, cat: string | null) => void }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') ?? searchParams.get('category');

    useEffect(() => {
        onChange(q, cat);
    }, [q, cat, onChange]);

    // Legacy `/?category=rent` → `/?cat=rent` cleanup in leaf
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

    return null;
}

function HomeInner({
    initialProperties,
    marketplaceStats,
    homeStats,
}: {
    initialProperties?: Property[];
    marketplaceStats?: MarketplaceStats;
    homeStats?: HomeInventorySummary | null;
}) {
    const router = useRouter();
    useScrollMemory(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [catParam, setCatParam] = useState<string | null>(null);

    const homeFaqs = useMemo(() => buildHomeFaqs(homeStats), [homeStats]);

    const heroTab = parseHomeHeroTab(catParam);
    const listingsCategory = useMemo(() => homeHeroTabToListingsCategory(heroTab), [heroTab]);

    const handleUrlChange = useCallback((q: string, c: string | null) => {
        setSearchQuery(q);
        setCatParam(c);
    }, []);

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

    const isDefaultPgFilter =
        listingsCategory === 'pg' &&
        !searchQuery.trim() &&
        heroFilters.city === 'bangalore' &&
        !heroFilters.property_type &&
        heroFilters.min_price === undefined &&
        heroFilters.max_price === undefined &&
        !heroFilters.amenity &&
        !heroFilters.gender &&
        !heroFilters.move_in;
    const seededProperties = isDefaultPgFilter ? initialProperties : undefined;

    useEffect(() => {
        const hasShownHomeSafety = sessionStorage.getItem('hasShownHomeSafety');
        if (!hasShownHomeSafety) {
            setIsSafetyPopupOpen(true);
            sessionStorage.setItem('hasShownHomeSafety', 'true');
        }
    }, []);

    const handleSearchQueryChange = useCallback(
        (newQuery: string) => {
            setSearchQuery(newQuery);
            const currentParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
            if (newQuery) {
                currentParams.set('q', newQuery);
            } else {
                currentParams.delete('q');
            }
            const qs = currentParams.toString();
            const href = qs ? `/?${qs}` : '/';
            router.replace(href, { scroll: false });
        },
        [router]
    );

    const handleHubTabChange = useCallback(
        (tab: HomeHeroNavigateTab) => {
            setCatParam(tab === 'pg' ? null : tab);
            const currentParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
            if (tab === 'pg') {
                currentParams.delete('cat');
            } else {
                currentParams.set('cat', tab);
            }
            const qs = currentParams.toString();
            const href = qs ? `/?${qs}` : '/';
            router.replace(href, { scroll: false });
        },
        [router]
    );

    const handleListingsNavigate = useCallback(
        (tab: HomeHeroNavigateTab, query: string) => {
            const url = homeHeroSearchUrl(tab, query);
            router.push(url);
        },
        [router]
    );

    return (
        <>
            <Suspense fallback={null}>
                <HomeUrlSync onChange={handleUrlChange} />
            </Suspense>
            <JsonLd data={buildFaqPageSchema(homeFaqs)} id="home-faq-schema" />
            <JsonLd data={buildHomeOrganizationLocalWebGraph()} id="home-org-local-website-schema" />

            <Navbar />
            <main id="main-content" className="min-h-screen bg-page pb-24 md:pb-0">
                <section id="home">
                    <Hero
                        category={listingsCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={handleSearchQueryChange}
                        filters={heroFilters}
                        setFilters={setHeroFilters}
                        listingsNavigate={handleListingsNavigate}
                        activeHubTab={heroTab}
                        onHubTabChange={handleHubTabChange}
                        marketplaceStats={marketplaceStats}
                    />
                </section>

                <HomeBelowFold
                    listingsCategory={listingsCategory}
                    searchQuery={searchQuery}
                    heroFilters={heroFilters}
                    setHeroFilters={setHeroFilters}
                    isSafetyPopupOpen={isSafetyPopupOpen}
                    onSafetyClose={() => setIsSafetyPopupOpen(false)}
                    homeFaqs={homeFaqs}
                    homeStats={homeStats}
                    initialProperties={seededProperties}
                />
            </main>

            <Footer />
        </>
    );
}

export default function Home(props: {
    initialProperties?: Property[];
    marketplaceStats?: MarketplaceStats;
    homeStats?: HomeInventorySummary | null;
}) {
    return <HomeInner {...props} />;
}
