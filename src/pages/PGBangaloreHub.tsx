import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { QuickAnswersBlock } from '@/components/seo/QuickAnswersBlock';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { PG_LOCATIONS } from '@/data/pgLocations';
import { buildPageSEO, pgBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/pages/Properties';
import { MapPin } from 'lucide-react';

const HUB_FAQS = [
    {
        question: 'What is the average PG rent in Bangalore?',
        answer: 'PG rent in Bangalore typically ranges from ₹6,000 for shared rooms to ₹18,000+ for premium single occupancy near IT corridors, depending on meals, WiFi, AC, and security.',
    },
    {
        question: 'Which areas have the most PG options in Bangalore?',
        answer: 'High-demand micro-markets include Whitefield, Marathahalli, BTM, HSR Layout, Koramangala, and Electronic City — each with different commute profiles and price bands.',
    },
    {
        question: 'Is WiFi and food usually included in PG rent?',
        answer: 'Most professional PGs advertise high-speed WiFi. Food may be 2–3 meals per day or optional add-ons — confirm veg/non-veg and timings on each listing.',
    },
    {
        question: 'How do I book a PG safely in Bangalore?',
        answer: 'Use verified listings with real photos, compare total monthly cost including deposit, and book visits or pay tokens only through trusted channels such as MakeMyStay.ai.',
    },
];

export default function PGBangaloreHub() {
    const helmet = buildPageSEO(pgBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: 'PG in Bangalore', path: '/pg/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    const topSlugs = PG_LOCATIONS.slice(0, 16);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="pg-bangalore-hub-ld-json" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <header className="max-w-4xl">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: 'PG in Bangalore' },
                            ]}
                        />
                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Bangalore · City guide</p>
                        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            Best PG in Bangalore (₹6,000–₹18,000)
                        </h1>
                        <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed">
                            Find affordable PG and coliving across Bangalore with WiFi, optional meal plans, housekeeping, and 24/7 security. Use the live listings below to
                            filter by budget and amenities — then shortlist or book a visit.
                        </p>
                    </header>

                    <article className="max-w-4xl prose prose-slate prose-lg text-slate-700">
                        <p>
                            Bangalore remains India’s largest market for managed paying guest (PG) and coliving stays, driven by tech parks, startups, and students. Whether you
                            work in Whitefield, Bellandur, or Manyata, the right PG can shorten commute time, bundle meals, and remove the overhead of setting up utilities in a
                            new flat.
                        </p>
                        <p>
                            Typical monthly rent falls between <strong>₹6,000 and ₹18,000</strong> depending on sharing type, floor, AC, food inclusions, and how premium the
                            building is. Always compare <em>total monthly cost</em>: deposit, maintenance caps, laundry, and whether electricity is metered or included.
                        </p>
                        <p>
                            Most operators now advertise <strong>high-speed WiFi</strong> and <strong>power backup</strong> — essential for WFH and late shifts. Food may be
                            two or three meals with veg/non-veg rotations; confirm timings if you work odd hours. Security features such as CCTV, biometric access, and warden
                            presence are common in professionally run properties.
                        </p>
                        <p>
                            Location choice should balance rent with commute: Koramangala and Indiranagar offer lifestyle density; HSR and BTM connect well to multiple offices;
                            Whitefield and Marathahalli suit Manyata and ITPL corridors; Electronic City fits many south Bangalore campuses. Use area pages below to dive into
                            micro-market pros and cons before you pay a token.
                        </p>
                        <p>
                            On MakeMyStay.ai you browse <strong>verified listings</strong> with structured amenities, transparent pricing where available, and flows to schedule
                            visits or pay booking fees when enabled — reducing broker friction and guesswork.
                        </p>
                        <p>
                            If you are deciding between a PG and a small flat, see our{' '}
                            <Link to="/pg-vs-flat-bangalore" className="text-brand-red font-semibold hover:underline">
                                PG vs flat guide
                            </Link>{' '}
                            for deposits, flexibility, and total cost of ownership — then return here to shortlist PGs city-wide or jump into a locality page.
                        </p>
                    </article>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="top-areas-heading">
                        <h2 id="top-areas-heading" className="text-lg font-bold text-slate-900">
                            Top PG locations in Bangalore
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 mb-4">Area guides with listings, FAQs, and filters</p>
                        <nav className="flex flex-wrap gap-2" aria-label="PG areas">
                            {topSlugs.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    to={`/pg/${loc.slug}`}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:border-brand-red/40 hover:bg-red-50 hover:text-brand-red"
                                >
                                    PG in {loc.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            <Link to="/pg-with-wifi" className="font-semibold text-brand-red hover:underline">
                                PG with WiFi →
                            </Link>
                            <Link to="/pg-with-food" className="font-semibold text-brand-red hover:underline">
                                PG with food →
                            </Link>
                            <Link to="/blog/how-to-choose-pg-in-bangalore" className="font-semibold text-slate-600 hover:text-brand-red">
                                How to choose a PG (blog) →
                            </Link>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <QuickAnswersBlock locationName="Bangalore" />
                            <FaqSection
                                title="Frequently asked — PG in Bangalore"
                                items={HUB_FAQS}
                                titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                            />
                        </div>
                        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-5 h-fit sticky top-28">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Also read</p>
                            <ul className="mt-3 space-y-2 text-sm">
                                <li>
                                    <Link to="/blog/pg-rent-vs-flat-rent-bangalore" className="text-brand-red font-medium hover:underline">
                                        PG rent vs flat rent
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pg-vs-flat-bangalore" className="text-brand-red font-medium hover:underline">
                                        PG vs flat (full comparison)
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-slate-200/80 bg-white">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity="Bangalore"
                        pageTitle="PG listings in Bangalore"
                        pageSubtitle="Verified paying guest stays — filter by budget, WiFi, food, AC, and more."
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
