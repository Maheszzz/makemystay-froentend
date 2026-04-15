import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ServicesGrid } from '@/components/modules/services/ServicesGrid';
import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import { InvestmentCalculator } from '@/components/modules/calculator/InvestmentCalculator';
import { About } from '@/components/sections/About';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { Comparison } from '@/components/sections/Comparison';
import { CTA } from '@/components/sections/CTA';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageSEO, buildHomeSEO } from '@/lib/seo';
import { buildFaqPageSchema, buildWebSiteSchema } from '@/lib/schema';
import { HOME_PG_FAQS } from '@/data/homePgSeo';

const HOME_CATEGORIES = new Set(['pg', 'rent', 'buy', 'plot', 'all']);

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Match /properties default: "All" (mixed PG + BHK + …). Do not default to rent — that hid PG on the home grid.
    const rawCategory = searchParams.get('category');
    const category: 'pg' | 'rent' | 'buy' | 'plot' | 'all' =
        rawCategory && HOME_CATEGORIES.has(rawCategory)
            ? (rawCategory as 'pg' | 'rent' | 'buy' | 'plot' | 'all')
            : 'all';
    const searchQuery = searchParams.get('q') || '';

    // Copy URLSearchParams — mutating `prev` and returning it can skip updates in react-router.
    const setCategory = (newCategory: 'pg' | 'rent' | 'buy' | 'plot' | 'all') => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set('category', newCategory);
                return next;
            },
            { replace: true }
        );
    };

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
            <JsonLd data={buildWebSiteSchema()} id="home-website-schema" />

            <Navbar />
            <main id="main-content" className="min-h-screen bg-white">
                <section id="home">
                    <Hero
                        category={category}
                        setCategory={setCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </section>

                {/* Property Listings */}
                <PropertyGrid category={category} searchQuery={searchQuery} />

                {/* Services / What We Offer */}
                <section id="services" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Services</h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">Comprehensive solutions for every real estate need</p>
                    </div>
                    <ServicesGrid />
                </section>

                {/* Investment Calculator */}
                <InvestmentCalculator />

                <About />
                <Problem />
                <Solution />
                <Comparison />
                <CaseStudy />
                <CTA />
            </main>

            <Footer />
        </>
    );
}
