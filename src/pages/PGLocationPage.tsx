import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { QuickAnswersBlock } from '@/components/seo/QuickAnswersBlock';
import { InternalLocationLinks } from '@/components/seo/InternalLocationLinks';
import { ExploreNearbyLinks } from '@/components/seo/ExploreNearbyLinks';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PgLocationDeepContent } from '@/components/seo/PgLocationDeepContent';
import { PgFilterQuickLinks } from '@/components/seo/PgFilterQuickLinks';
import { PeopleAlsoAsk } from '@/components/seo/PeopleAlsoAsk';
import { FaqSection } from '@/components/seo/FaqSection';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { buildPageSEO, pgLocationSeoWithQuery, stablePgListingCanonical } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/pages/Properties';
import { MapPin, Shield } from 'lucide-react';

function buildFaqs(locationName: string) {
    return [
        {
            question: `What is the average PG rent in ${locationName}?`,
            answer: `PG rent in ${locationName}, Bangalore typically ranges from ₹6,000 for shared rooms to ₹18,000+ for premium single occupancy, depending on meals, WiFi, and security.`,
        },
        {
            question: `Is food included in PG rent in ${locationName}?`,
            answer: `Most professional PGs include 2–3 meals per day. Confirm veg/non-veg options and timings on each listing before booking.`,
        },
        {
            question: `How do I verify a PG near ${locationName}?`,
            answer: `MakeMyStay.ai lists verified properties with real photos and transparent pricing. You can book a visit or pay a token online where enabled.`,
        },
        {
            question: `Are PGs in ${locationName} safe for working professionals?`,
            answer: `Reputed PGs offer CCTV, biometric access, and warden support. Always check the exact amenities on the listing and read recent reviews.`,
        },
    ];
}

export default function PGLocationPage() {
    const { location: locationParam } = useParams<{ location: string }>();
    const [searchParams] = useSearchParams();
    const legacyTarget = resolveLegacyPgSlug(locationParam);
    if (legacyTarget) {
        return <Navigate to={`/pg/${legacyTarget}`} replace />;
    }

    const loc = getPgLocationBySlug(locationParam);

    if (!loc) {
        return <Navigate to="/pg" replace />;
    }

    const { name, slug } = loc;
    const seoInput = pgLocationSeoWithQuery(name, slug, searchParams);
    const helmet = buildPageSEO(seoInput);
    const faqs = buildFaqs(name);
    const canonicalListingPath = stablePgListingCanonical(slug, searchParams);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `PG in ${name}`, path: canonicalListingPath },
    ];
    const combinedLd = buildPgLocationCombinedGraph(faqs, breadcrumbItems, name);

    const pageTitle = `PG in ${name}`;
    const pageSubtitle = `Verified paying guest stays in ${name} — filter by budget, food plan, and room type.`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="pg-location-ld-json" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

                    <div className="max-w-4xl">
                        <PgLocationDeepContent name={name} />
                    </div>

                    <ExploreNearbyLinks currentSlug={slug} limit={12} />

                    <div className="max-w-4xl space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Popular filters</p>
                        <PgFilterQuickLinks slug={slug} />
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-4 md:px-6 md:py-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                <Shield className="h-5 w-5" aria-hidden />
                            </div>
                            <p className="text-sm md:text-[15px] text-emerald-950 leading-relaxed">
                                <strong>AI &amp; search-friendly summary:</strong> PG in {name} is popular with students
                                and IT professionals. Expect competition near tech parks — book early for single rooms
                                and meal-inclusive plans.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <QuickAnswersBlock locationName={name} />

                            <PeopleAlsoAsk locationName={name} />

                            <FaqSection
                                title={`Frequently asked — PG in ${name}`}
                                items={faqs}
                                titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <InternalLocationLinks currentSlug={slug} />
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-slate-200/80 bg-white">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity={name}
                        pageTitle={pageTitle}
                        pageSubtitle={pageSubtitle}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
