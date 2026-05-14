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
import { homeHeroSearchUrl, type ListingsCategoryKey } from '@/lib/listingsCategoryHubs';
import { buildFaqPageSchema, buildHomeOrganizationLocalWebGraph } from '@/lib/schema';
import { buildHomeSEO, buildPageSEO } from '@/lib/seo';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LEGACY_HOME_CATEGORY = new Set<ListingsCategoryKey>(['pg', 'rent', 'buy', 'plot', 'all']);

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchQuery = searchParams.get('q') || '';
    const [isSafetyPopupOpen, setIsSafetyPopupOpen] = useState(false);
    const [heroFilters, setHeroFilters] = useState<HeroSearchFilters>({
        city: 'bangalore',
        property_type: '',
        min_price: undefined,
        max_price: undefined,
        amenity: '',
        gender: '',
    });

    useEffect(() => {
        const hasShownHomeSafety = sessionStorage.getItem('hasShownHomeSafety');
        if (!hasShownHomeSafety) {
            setIsSafetyPopupOpen(true);
            sessionStorage.setItem('hasShownHomeSafety', 'true');
        }
    }, []);

    // Legacy `/?category=pg` (etc.) → canonical SEO URL; `?category=all` → strip param only.
    useEffect(() => {
        const cat = searchParams.get('category');
        if (!cat) return;
        const q = searchParams.get('q') || '';
        if (!LEGACY_HOME_CATEGORY.has(cat as ListingsCategoryKey)) {
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
        if (cat === 'all') {
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
        navigate(homeHeroSearchUrl(cat as ListingsCategoryKey, q), { replace: true });
    }, [searchParams, navigate, setSearchParams]);

    const setSearchQuery = (newQuery: string) => {
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
    };

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
                        category="pg"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filters={heroFilters}
                        setFilters={setHeroFilters}
                        listingsNavigate={(tab, q) => {
                            if (tab === 'commercial') {
                                const qt = q.trim();
                                navigate(qt ? `/properties?q=${encodeURIComponent(qt)}` : '/properties');
                                return;
                            }
                            navigate(homeHeroSearchUrl(tab, q));
                        }}
                    />
                </section>

                <PropertyGrid category="all" searchQuery={searchQuery} cardVariant="project" filters={heroFilters} />

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
