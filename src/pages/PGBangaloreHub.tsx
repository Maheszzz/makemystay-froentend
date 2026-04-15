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
                        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                            Best PG in Bangalore (₹6,000–₹15,000)
                        </h1>
                        <p className="mt-4 text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                            Find affordable PG and coliving across Bangalore including Whitefield, BTM, Marathahalli and more.
                        </p>
                    </header>

                    <article className="max-w-4xl prose prose-slate prose-lg text-slate-700 space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mt-0">The Shifting Landscape of PG in Bangalore (2026)</h2>
                            <p>
                                Bangalore, the Silicon Valley of India, remains the primary hub for managed paying guest (PG) and coliving stays. Driven by a massive influx of tech professionals, startups, and students, the city’s housing market has evolved rapidly. In 2026, the traditional <em>"PG"</em> has transformed into sophisticated <strong>coliving spaces</strong> that prioritize community, high-speed connectivity, and flexible lease terms.
                            </p>
                            <p>
                                Whether you are a software engineer at ITPL, a creative professional in Indiranagar, or a student at Christ University, finding a stay that balances <strong>commute time</strong> with <strong>lifestyle amenities</strong> is critical. On MakeMyStay.ai, we simplify this by providing verified listings that filter out the "broker noise" and present transparent facts.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">Comparing Top PG Locations in Bangalore</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-2">Technical & Business Hubs</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <strong>Whitefield & Marathahalli:</strong> Perfect for those working in Manyata Tech Park, ITPL, or the ORR stretch. Rent here is mid-to-high, but the savings on commute time are substantial. 
                                    <strong>Electronic City:</strong> The southern tech anchor, offering the most budget-friendly premium PGs for entry-level professionals.
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-2">Lifestyle & Student Corridors</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <strong>BTM Layout & HSR:</strong> The "start-up central" of Bangalore. High density of PGs with excellent food options and connectivity to Silk Board and Koramangala.
                                    <strong>Koramangala & Indiranagar:</strong> Premium pricing but unrivaled lifestyle perks. Expect curated coliving spaces with terrace lounges and community events.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">Rent Reality Check: Shared vs. Single Occupancy</h2>
                        <p>
                            Typical monthly rent in Bangalore currently falls between <strong>₹6,000 and ₹15,000</strong>. While "price on request" is common, knowing the market averages helps you negotiate. 
                        </p>
                        <ul className="space-y-3">
                            <li><strong>Shared Rooms (3-4 sharing):</strong> ₹6,000 – ₹7,500. Best for students or those on a strict budget.</li>
                            <li><strong>Twin Sharing:</strong> ₹8,500 – ₹11,000. The most popular choice for working professionals.</li>
                            <li><strong>Single Occupancy/Studio PGs:</strong> ₹13,000 – ₹18,000+. Targets those who need privacy and work-from-home comfort.</li>
                        </ul>
                        <p>
                            <em>Pro Tip:</em> Always ask about the "Token Amount" vs "Security Deposit". In Bangalore, deposits are generally 1-2 months' rent for PGs, which is significantly lower than the 5-10 months standard for independent flats.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900">Essential Amenities: What to Expect</h2>
                        <p>
                            A "verified" listing on our platform means we look for specific pillars of quality:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose text-center">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-brand-red font-bold text-lg mb-1">High-Speed WiFi</div>
                                <div className="text-xs text-slate-500 line-clamp-2">Fiber connections with dedicated APs.</div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-brand-red font-bold text-lg mb-1">Meal Plans</div>
                                <div className="text-xs text-slate-500 line-clamp-2">North/South Indian menus, 2-3 meals day.</div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-brand-red font-bold text-lg mb-1">Safety First</div>
                                <div className="text-xs text-slate-500 line-clamp-2">CCTV, biometric entry, warden desk.</div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">Frequently Searched PG Hubs</h2>
                        <p>
                            Users frequently search for specialized queries like "PG near me with food", "girls PG in Bangalore with security", or "luxury coliving in Whitefield". This hub page acts as your starting point to explore these specific niches. For a deeper dive into whether you should choose a PG or a flat, read our authoritative guide on <Link to="/pg-vs-flat-bangalore" className="text-brand-red font-semibold hover:underline">PG vs Flat in Bangalore</Link>.
                        </p>
                    </article>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm" aria-labelledby="top-areas-heading">
                        <h2 id="top-areas-heading" className="text-xl font-extrabold text-slate-900">
                            Top PG Locations in Bangalore
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 mb-6">Explore detailed area guides with live listings and local commute tips.</p>
                        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="PG areas">
                            {topSlugs.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    to={`/pg/${loc.slug}`}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand-red/40 hover:bg-red-50 hover:text-brand-red text-center"
                                >
                                    PG in {loc.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm border-t border-slate-100 pt-6">
                            <Link to="/pg-with-wifi" className="font-bold text-brand-red hover:underline flex items-center gap-1">
                                PG with WiFi <span>→</span>
                            </Link>
                            <Link to="/pg-with-food" className="font-bold text-brand-red hover:underline flex items-center gap-1">
                                PG with food <span>→</span>
                            </Link>
                            <Link to="/blog/how-to-choose-pg-in-bangalore" className="font-bold text-slate-600 hover:text-brand-red flex items-center gap-1">
                                How to choose a PG (blog) <span>→</span>
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
                        pageTitle="Popular PG listings in Bangalore"
                        pageSubtitle="Verified paying guest stays — filter by budget, WiFi, food, AC, and more."
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
