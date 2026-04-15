import { Link, useSearchParams } from 'react-router-dom';
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
import { QuickAnswersBlock } from '@/components/seo/QuickAnswersBlock';
import { FaqSection } from '@/components/seo/FaqSection';
import { PG_LOCATIONS } from '@/data/pgLocations';
import { buildPageSEO, buildHomeSEO } from '@/lib/seo';
import { buildFaqPageSchema, buildWebSiteSchema } from '@/lib/schema';
import { MapPin } from 'lucide-react';

const HOME_CATEGORIES = new Set(['pg', 'rent', 'buy', 'plot', 'all']);

const HOME_FAQS = [
    {
        question: 'What is the average PG rent in Bangalore?',
        answer: 'Typical PG rent ranges from ₹6,000 for shared rooms to ₹15,000+ for premium single occupancy near IT corridors, depending on meals, WiFi, and security.',
    },
    {
        question: 'Is WiFi included in PG rent?',
        answer: 'Most verified PGs on MakeMyStay.ai include high-speed WiFi. Confirm speed and fair-usage policy on each listing.',
    },
    {
        question: 'Are food and housekeeping included?',
        answer: 'Many PGs bundle 2–3 meals and periodic housekeeping. Veg/non-veg plans and timings vary — check the listing details before booking.',
    },
    {
        question: 'How do I book or pay a token securely?',
        answer: 'Browse verified listings, shortlist properties, and use on-page actions to schedule a visit or pay a booking token where enabled — with transparent pricing and support.',
    },
];

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
            <JsonLd data={buildFaqPageSchema(HOME_FAQS)} id="home-faq-schema" />
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

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14 border-y border-slate-100 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                                    Find the best PG in Bangalore
                                </h2>
                                <p className="mt-2 text-slate-600 text-sm md:text-base max-w-2xl leading-relaxed">
                                    Discover fully furnished PG and coliving spaces across Bangalore with WiFi, food plans,
                                    and 24/7 security — compare areas below, then explore live listings.{' '}
                                    <Link to="/pg/bangalore" className="font-semibold text-brand-red hover:underline whitespace-nowrap">
                                        Open the Bangalore PG hub →
                                    </Link>
                                </p>
                            </div>
                            <QuickAnswersBlock locationName="Bangalore" />
                            <FaqSection
                                id="home-faq-heading"
                                title="Frequently asked questions"
                                items={HOME_FAQS}
                                titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-28">
                                <h2 className="text-base font-bold text-slate-900">Top PG locations</h2>
                                <p className="text-xs text-slate-500 mt-1 mb-4">Jump to area guides &amp; listings</p>
                                <nav className="flex flex-wrap gap-2" aria-label="Popular PG areas">
                                    {PG_LOCATIONS.slice(0, 20).map((loc) => (
                                        <Link
                                            key={loc.slug}
                                            to={`/pg/${loc.slug}`}
                                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-red/40 hover:bg-red-50 hover:text-brand-red"
                                        >
                                            {loc.name}
                                        </Link>
                                    ))}
                                </nav>
                                <Link
                                    to="/pg"
                                    className="mt-4 inline-block text-xs font-semibold text-brand-red hover:underline"
                                >
                                    View all PG listings →
                                </Link>
                            </div>
                        </div>
                    </div>
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
