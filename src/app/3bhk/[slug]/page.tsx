import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Home, ChevronRight, CheckCircle2, Users } from 'lucide-react';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { build3BhkLocalitySEO } from '@/lib/seo';
import { build3BhkLocalityFaqs } from '@/lib/bhkLocalityFaqs';
import { buildFaqPageSchema, buildBreadcrumbSchema } from '@/lib/schema';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { Link } from '@/lib/navigation';
import Properties from '@/views/Properties';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const loc = getPgLocationBySlug(slug);
    if (!loc) return {};
    return pageSeoToMetadata(build3BhkLocalitySEO(loc.name, loc.slug));
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const loc = getPgLocationBySlug(slug);
    if (!loc) notFound();

    const { name, slug: locationSlug, rentRange, landmarks } = loc;

    // Estimate 3BHK rent range from the location's general range (roughly 2.2x of 1BHK baseline)
    const threeBhkRentRange = rentRange
        ? rentRange.replace(/₹([\d,]+)/g, (_, n) => {
              const num = parseInt(n.replace(/,/g, ''), 10);
              return `₹${Math.round(num * 2.2).toLocaleString('en-IN')}`;
          })
        : undefined;

    let initialProperties;
    let total;
    let propertyCounts;
    try {
        const res = await fetchPropertiesServer({
            category: 'rent',
            city: name,
            is_available: true,
            limit: 24,
            sort_by: 'newest',
        });
        initialProperties = res.items;
        total = res.total;
        propertyCounts = res.propertyCounts;
    } catch {
        // Client-side fallback
    }

    const faqs = build3BhkLocalityFaqs(name, threeBhkRentRange);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Flats for Rent', path: '/rent/bangalore' },
        { name: `3 BHK in ${name}`, path: `/3bhk/${locationSlug}` },
    ];
    const faqSchema = buildFaqPageSchema(faqs);
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

    const pageTitle = `3 BHK for Rent in ${name}`;
    const pageSubtitle = `Verified 3 BHK flats in ${name}, Bangalore — real photos, transparent rent, zero brokerage.`;

    return (
        <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
            <JsonLd data={faqSchema} id="3bhk-locality-faq-ld" />
            <JsonLd data={breadcrumbSchema} id="3bhk-locality-breadcrumb-ld" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
                {/* Property listings */}
                <Properties
                    hideChrome
                    initialCategory="rent"
                    initialTypeFilter="3BHK"
                    initialCity={name}
                    pageTitle={pageTitle}
                    pageSubtitle={pageSubtitle}
                    initialProperties={initialProperties}
                    initialTotalCount={total}
                    initialPropertyCounts={propertyCounts}
                    hero={{
                        breadcrumbs: breadcrumbItems,
                        title: pageTitle,
                        subtitle: pageSubtitle,
                        extra: (
                            <Link
                                to={`/rent/${locationSlug}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:underline underline-offset-4"
                            >
                                <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
                                All Flats in {name}
                                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                            </Link>
                        ),
                    }}
                />

                {/* Rich content section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">

                    {/* Overview */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-red shrink-0" aria-hidden />
                            3 BHK Flats for Rent in {name}, Bangalore
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            {name} is a sought-after area for families and professionals looking for spacious 3 BHK
                            flats for rent in Bangalore. MakeMyStay lists verified 3 BHK flats in {name} with real
                            photos, transparent rent, and zero brokerage — giving you the full picture before
                            stepping out for a visit.
                        </p>
                        {threeBhkRentRange && (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-800">
                                3 BHK Rent in {name}:{' '}
                                <span className="font-bold text-brand-red">{threeBhkRentRange}</span> / month
                            </div>
                        )}
                    </section>

                    {/* Why rent here */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            Why Rent a 3 BHK in {name}?
                        </h2>
                        <ul className="space-y-3">
                            {[
                                `Ideal for larger families, executives, and professionals sharing a home`,
                                `Gated societies with parking for two cars, security, and power backup`,
                                `Well-connected to Bangalore's metro network, schools, and hospitals`,
                                `Wide choice of fully furnished, semi-furnished, and unfurnished 3 BHKs`,
                                `MakeMyStay verifies every listing — real photos, real prices, no fake ads`,
                            ].map((point) => (
                                <li key={point} className="flex items-start gap-3 text-slate-700">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" aria-hidden />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Nearby landmarks */}
                    {landmarks && landmarks.length > 0 && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">
                                Nearby Landmarks in {name}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {landmarks.map((lm) => (
                                    <span
                                        key={lm}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-brand-red" aria-hidden />
                                        {lm}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-slate-600">
                                Proximity to these landmarks makes {name} a practical and comfortable location
                                for families renting a spacious 3 BHK in Bangalore.
                            </p>
                        </section>
                    )}

                    {/* Internal links */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            More Rentals in {name} &amp; Nearby Areas
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to={`/1bhk/${locationSlug}`}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                1 BHK in {name}
                            </Link>
                            <Link
                                to={`/2bhk/${locationSlug}`}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                2 BHK in {name}
                            </Link>
                            <Link
                                to={`/rent/${locationSlug}`}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                All Flats for Rent in {name}
                            </Link>
                            <Link
                                to={`/pg/${locationSlug}`}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                PG in {name}
                            </Link>
                            <Link
                                to="/3bhk/koramangala"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                3 BHK in Koramangala
                            </Link>
                            <Link
                                to="/3bhk/whitefield"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                3 BHK in Whitefield
                            </Link>
                            <Link
                                to="/3bhk/indiranagar"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                3 BHK in Indiranagar
                            </Link>
                            <Link
                                to="/3bhk/hsr-layout"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                3 BHK in HSR Layout
                            </Link>
                        </div>
                    </section>

                    {/* FAQ section */}
                    <FaqSection
                        id="3bhk-locality-faq-heading"
                        title={`Frequently Asked — 3 BHK for Rent in ${name}`}
                        items={faqs}
                        collapsible
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
