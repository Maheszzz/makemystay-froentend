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
import { MapPin, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

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

            <main id="main-content" className="flex-grow pt-20 pb-16">
                
                {/* ── Hero Header ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: 'PG in Bangalore' },
                            ]}
                        />
                        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Karnataka · Silicon Valley of India
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    Best PG in Bangalore
                                    <span className="block text-brand-red text-2xl md:text-3xl mt-2 font-extrabold opacity-90">
                                        ₹6,000 – ₹15,000 /mo
                                    </span>
                                </h1>
                                <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                                    Discover verified coliving spaces and managed PGs across Whitefield, BTM, HSR, 
                                    and Marathahalli. Transparent pricing, zero broker bias.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Verified Stays
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Zero Brokerage
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PROPERTIES GRID (HIGH PRIORITY) ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity="Bangalore"
                        pageTitle="Listings in Bangalore"
                        pageSubtitle="Verified paying guest stays — filter by budget, WiFi, food, AC, and more."
                    />
                </div>

                {/* ── SEO CONTENT & AREA GUIDES (BELOW THE FOLD) ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-16">
                    
                    {/* Area Navigation Grid */}
                    <section aria-labelledby="top-areas-heading">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h2 id="top-areas-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Browse by Top Locations
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm md:text-base">
                                    Select a micro-market to see specialized area guides and local listings.
                                </p>
                            </div>
                            <div className="flex gap-4 text-sm font-bold text-brand-red">
                                <Link to="/pg-with-wifi" className="hover:underline">WiFi Stays →</Link>
                                <Link to="/pg-with-food" className="hover:underline">Food Included →</Link>
                            </div>
                        </div>
                        
                        <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4" aria-label="PG areas">
                            {topSlugs.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    to={`/pg/${loc.slug}`}
                                    className="group flex flex-col p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-red/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors" />
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors">
                                        PG in {loc.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </section>

                    {/* Authority Content / Guide */}
                    <article className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-12 border-t border-slate-200/60">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="prose prose-slate prose-lg max-w-none">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                                    The Shifting Landscape of PG in Bangalore (2026)
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Bangalore remains the primary hub for managed paying guest (PG) and coliving stays. 
                                    In 2026, the traditional <em>"PG"</em> has transformed into sophisticated 
                                    <strong> coliving spaces</strong> that prioritize community, high-speed connectivity, 
                                    and flexible lease terms.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Whether you are at <strong>ITPL Whitefield</strong>, <strong>Manyata Tech Park</strong>, 
                                    or a student at <strong>Christ University</strong>, finding a stay that balances commute 
                                    time with lifestyle is critical. MakeMyStay.ai simplifies this by providing verified 
                                    listings that filter out binary broker noise.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                        Technical Hubs
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        <strong>Whitefield & Electronic City:</strong> The anchors for IT professionals. 
                                        Rent here targets the mid-to-high range but offers superior coliving infrastructure.
                                    </p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                                        Lifestyle Corridors
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        <strong>BTM Layout & HSR:</strong> Start-up central. High density of verified PGs 
                                        with unrivaled food options and connectivity to Silk Board and Koramangala.
                                    </p>
                                </div>
                            </div>
                            
                            <QuickAnswersBlock locationName="Bangalore" />
                            
                            <FaqSection
                                title="Frequently asked — PG in Bangalore"
                                items={HUB_FAQS}
                                titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                            />
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6 lg:sticky lg:top-28">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Rent Reality Check</h4>
                                <ul className="space-y-4">
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Twin Sharing</span>
                                        <span className="text-slate-900 font-bold">₹8.5k – ₹11k</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Single Room</span>
                                        <span className="text-slate-900 font-bold">₹13k – ₹18k</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-[11px] text-slate-400 italic">
                                    *Monthly averages — vary by area and food inclusions.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Also Read</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link to="/pg-vs-flat-bangalore" className="text-sm font-bold text-brand-red hover:underline flex items-center justify-between">
                                            PG vs Flat Comparison
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog/how-to-choose-pg-in-bangalore" className="text-sm font-bold text-slate-600 hover:text-brand-red flex items-center justify-between">
                                            How to choose a PG
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
