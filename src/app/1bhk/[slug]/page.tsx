import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Home, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { applyQueryNoindex, pageSeoToMetadata } from '@/lib/nextMetadata';
import { build1BhkLocalitySEO } from '@/lib/seo';
import { build1BhkLocalityFaqs } from '@/lib/bhkLocalityFaqs';
import { buildFaqPageSchema, buildBreadcrumbSchema } from '@/lib/schema';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { Link } from '@/lib/navigation';
import Properties from '@/views/Properties';

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const loc = getPgLocationBySlug(slug);
    if (!loc) return {};
    const sp = searchParams ? await searchParams : undefined;
    return applyQueryNoindex(pageSeoToMetadata(build1BhkLocalitySEO(loc.name, loc.slug)), sp, `/1bhk/${loc.slug}`);
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const loc = getPgLocationBySlug(slug);
    if (!loc) notFound();

    const { name, slug: locationSlug, rentRange, landmarks } = loc;

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

    const faqs = build1BhkLocalityFaqs(name, rentRange);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Flats for Rent', path: '/rent/bangalore' },
        { name: `1 BHK in ${name}`, path: `/1bhk/${locationSlug}` },
    ];
    const faqSchema = buildFaqPageSchema(faqs);
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

    const pageTitle = `1 BHK for Rent in ${name}`;
    const pageSubtitle = `Verified 1 BHK flats in ${name}, Bangalore — real photos, transparent rent, zero brokerage.`;

    return (
        <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
            <JsonLd data={faqSchema} id="1bhk-locality-faq-ld" />
            <JsonLd data={breadcrumbSchema} id="1bhk-locality-breadcrumb-ld" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
                {/* Property listings */}
                <Properties
                    hideChrome
                    initialCategory="rent"
                    initialTypeFilter="1BHK"
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
                                to={`/pg/${locationSlug}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:underline underline-offset-4"
                            >
                                <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
                                PGs in {name}
                                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                            </Link>
                        ),
                    }}
                />

                {/* Rich content section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">

                    {/* Quick answer / overview */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-brand-red shrink-0" aria-hidden />
                            1 BHK Flats for Rent in {name}, Bangalore
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            {name} is one of Bangalore's well-connected localities, making it a top choice for
                            singles and couples searching for 1 BHK flats. MakeMyStay lists verified 1 BHK
                            flats in {name} with real photos, transparent rent, and zero brokerage — so you
                            see exactly what you are renting before you visit.
                        </p>
                        {rentRange && (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-800">
                                1 BHK Rent in {name}: <span className="font-bold text-brand-red">{rentRange}</span> / month
                            </div>
                        )}
                    </section>

                    {/* Why rent here */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            Why Rent a 1 BHK in {name}?
                        </h2>
                        <ul className="space-y-3">
                            {[
                                `Well-connected to Bangalore's metro network and major IT corridors`,
                                `Wide range of 1 BHK options — furnished, semi-furnished, and unfurnished`,
                                `Good availability of restaurants, supermarkets, and cafes nearby`,
                                `Suitable for working professionals, couples, and students`,
                                `MakeMyStay verifies every listing with real photos — no fake listings`,
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
                                Easy access to these landmarks makes {name} a convenient base for work and
                                daily life in Bangalore.
                            </p>
                        </section>
                    )}

                    {/* Internal links to other BHK types */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            More Rentals in {name}
                        </h2>
                        <div className="flex flex-wrap gap-3">
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
                                to="/1bhk/koramangala"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                1 BHK in Koramangala
                            </Link>
                            <Link
                                to="/1bhk/whitefield"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                1 BHK in Whitefield
                            </Link>
                            <Link
                                to="/1bhk/indiranagar"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                1 BHK in Indiranagar
                            </Link>
                            <Link
                                to="/1bhk/hsr-layout"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                1 BHK in HSR Layout
                            </Link>
                        </div>
                    </section>

                    {/* FAQ section with schema */}
                    <FaqSection
                        id="1bhk-locality-faq-heading"
                        title={`Frequently Asked — 1 BHK for Rent in ${name}`}
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
