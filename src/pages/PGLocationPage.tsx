import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PgLocalitySeoContent } from '@/components/seo/PgLocalitySeoContent';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { buildPgLocationFaqs } from '@/lib/pgLocalityFaqs';
import { buildPageSEO, pgLocationSeoWithQuery, stablePgListingCanonical } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import { LocationComparisonTable } from '@/components/seo/LocationComparisonTable';
import locJson from '@/data/pg-locations.json';
import Properties from '@/pages/Properties';

export default function PGLocationPage({ overrideSlug, overrideMaxPrice }: { overrideSlug?: string; overrideMaxPrice?: string }) {
    /** Must match `<Route path="/pg/:slug" />` — was incorrectly `location`, so slugs were always undefined. */
    const { slug: locationParamFromParams } = useParams<{ slug: string }>();
    const locationParam = overrideSlug || locationParamFromParams;
    const [searchParams] = useSearchParams();
    const [hasEmptyListings, setHasEmptyListings] = useState(false);
    const legacyTarget = resolveLegacyPgSlug(locationParam);
    if (legacyTarget) {
        return <Navigate to={`/pg/${legacyTarget}`} replace />
    }

    const loc = getPgLocationBySlug(locationParam);

    if (!loc) {
        return <Navigate to="/pg" replace />;
    }

    const { name, slug } = loc;
    const seoInput = pgLocationSeoWithQuery(name, slug, searchParams);
    const helmet = buildPageSEO(seoInput);
    const faqs = buildPgLocationFaqs(name);
    const canonicalListingPath = stablePgListingCanonical(slug, searchParams);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `PG in ${name}`, path: canonicalListingPath },
    ];
    const combinedLd = buildPgLocationCombinedGraph(faqs, breadcrumbItems, name);

    const pageTitle = overrideMaxPrice ? `Budget PG in ${name} under ₹${overrideMaxPrice}` : `PG in ${name}`;
    const pageSubtitle = overrideMaxPrice 
        ? `Best budget-friendly PG in ${name} under ₹${overrideMaxPrice}. Verified stays with WiFi & food.` 
        : `Verified paying guest stays in ${name} — filter by budget, food plan, and room type.`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} noindex={helmet.noindex || hasEmptyListings} />
            <JsonLd data={combinedLd} id="pg-location-ld-json" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
                        <header className="max-w-4xl">
                            <BreadcrumbNav
                                items={[
                                    { name: 'Home', path: '/' },
                                    { name: 'PG', path: '/pg' },
                                    { name: `PG in ${name}` },
                                ]}
                            />
                            <p className="mt-2 text-sm">
                                <Link to="/pg/bangalore" className="font-semibold text-brand-red hover:underline">
                                    PG in Bangalore — full city guide →
                                </Link>
                            </p>
                            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Bangalore · PG
                            </p>
                            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                PG in {name}
                            </h1>
                            <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed">
                                Discover verified PG accommodations in <strong>{name}</strong> with transparent pricing. Use
                                the filters below to match rent, room type, and amenities — then shortlist or secure your
                                room online.
                            </p>
                        </header>
                    </div>

                    <PgLocalitySeoContent name={name} slug={slug} />

                    <section className="bg-brand-red/[0.03] border border-brand-red/10 rounded-3xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    🏆 Top Rated PG in {name}
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm md:text-base">
                                    Highest rated by verified tenants — premium amenities ensured.
                                </p>
                            </div>
                        </div>
                        <Properties 
                            hideChrome 
                            initialCategory="pg" 
                            initialCity={name} 
                            pageTitle="" 
                            pageSubtitle="" 
                        />
                    </section>

                    <LocationComparisonTable currentLocation={name} />

                    {/* Nearby Localities Grid (Contextual Internal Linking) */}
                    <section className="pt-4 border-t border-slate-200/60">
                        <h2 className="font-heading text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-brand-red rounded-full" />
                            Explore Nearby Area Hubs
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            {locJson
                                .filter(l => l.slug !== slug)
                                .sort(() => 0.5 - Math.random())
                                .slice(0, 10)
                                .map(item => {
                                    const hubSlug = item.slug === 'btm' ? 'btm-layout' : item.slug;
                                    return (
                                        <Link
                                            key={item.slug}
                                            to={`/pg-in-${hubSlug}`}
                                            className="group px-4 py-3 rounded-xl bg-white border border-slate-200/80 hover:border-brand-red/30 hover:shadow-md transition-all duration-300"
                                        >
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-brand-red transition-colors">
                                                PG in {item.name}
                                            </span>
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    </section>
                </div>

                <div className="mt-10 border-t border-slate-200/80 bg-white">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity={name}
                        initialMaxPrice={overrideMaxPrice}
                        pageTitle={pageTitle}
                        pageSubtitle={pageSubtitle}
                        onEmptyResultsChange={setHasEmptyListings}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
