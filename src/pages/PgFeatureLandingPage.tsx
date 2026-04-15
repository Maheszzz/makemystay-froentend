import { useLayoutEffect } from 'react';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { buildPageSEO, pgFeatureLandingSeo, pgFeaturePathToKind } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/pages/Properties';

function featureFaqs(kind: 'wifi' | 'food' | 'ac') {
    if (kind === 'wifi') {
        return [
            {
                question: 'Do PGs in Bangalore include WiFi?',
                answer: 'Most professional PGs advertise high-speed WiFi. Confirm fair-usage limits and backup during power cuts on the listing or during your visit.',
            },
            {
                question: 'Is WiFi speed enough for WFH?',
                answer: 'Ask for typical Mbps and whether each room has LAN or only shared WiFi. Premium PGs near IT corridors often cater to WFH tenants.',
            },
        ];
    }
    if (kind === 'food') {
        return [
            {
                question: 'Is food included in PG rent in Bangalore?',
                answer: 'Many PGs bundle 2–3 meals; others offer kitchen access or optional meal plans. Confirm veg/non-veg and timing before you pay a deposit.',
            },
            {
                question: 'Can I get only breakfast or only dinner?',
                answer: 'Operators vary — some offer flexible meal coupons or add-ons. Check the listing details or ask on enquiry.',
            },
        ];
    }
    return [
        {
            question: 'Are AC rooms available in Bangalore PGs?',
            answer: 'Yes — many listings offer AC rooms, often at a premium versus non-AC. Verify inverter backup and maintenance inclusions.',
        },
        {
            question: 'Is AC rent higher than non-AC?',
            answer: 'Typically yes. Compare total monthly cost including electricity caps before you decide.',
        },
    ];
}

function featureIntro(kind: 'wifi' | 'food' | 'ac'): { h1: string; lead: string; body: string } {
    if (kind === 'wifi') {
        return {
            h1: 'PG with WiFi in Bangalore',
            lead: 'High-speed internet is a must for students and professionals. Browse verified PG listings across Bangalore and filter for connectivity-friendly stays.',
            body: 'Look beyond the word “WiFi” — ask about fair-usage policies, router placement, and whether meetings are workable during peak hours. Areas such as Whitefield, BTM, and HSR have dense PG supply, so you can compare multiple operators before you commit. Use the listings below with the WiFi filter applied for Bangalore.',
        };
    }
    if (kind === 'food') {
        return {
            h1: 'PG with food in Bangalore',
            lead: 'Meal-inclusive PGs save daily cooking time. Explore verified stays with food plans — veg and non-veg options vary by operator.',
            body: 'Food quality and timing matter as much as rent. Check whether meals are thali-style or buffet, whether Sunday menus differ, and if late-night access exists for shift workers. The listings below are filtered for food-friendly PGs in Bangalore — always confirm details on the property page before booking.',
        };
    }
    return {
        h1: 'PG with AC in Bangalore',
        lead: 'Beat Bangalore summers with air-conditioned rooms. Compare verified PGs that mention AC in amenities or features.',
        body: 'AC rooms often command higher rent and may have separate electricity metering. Ask about inverter backup for AC during outages. Use the filtered listings below as a starting point, then read each property’s amenities and photos carefully.',
    };
}

function filtersReady(kind: 'wifi' | 'food' | 'ac', sp: URLSearchParams): boolean {
    if (sp.get('cat') !== 'pg' || sp.get('city') !== 'Bangalore') return false;
    if (kind === 'wifi') return sp.get('wifi') === 'true';
    if (kind === 'food') return sp.get('food') === 'true';
    return sp.get('ac') === 'true';
}

export default function PgFeatureLandingPage() {
    const { pathname } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const kind = pgFeaturePathToKind(pathname);

    useLayoutEffect(() => {
        if (!kind) return;
        const params: Record<string, string> = { cat: 'pg', city: 'Bangalore' };
        if (kind === 'wifi') params.wifi = 'true';
        if (kind === 'food') params.food = 'true';
        if (kind === 'ac') params.ac = 'true';
        setSearchParams(params, { replace: true });
    }, [kind, setSearchParams]);

    if (!kind) {
        return <Navigate to="/pg" replace />;
    }

    const ready = filtersReady(kind, searchParams);

    if (!ready) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-24 pb-32">
                    <LoadingSpinner message="Loading filtered listings…" />
                </div>
                <Footer />
            </div>
        );
    }

    const seo = pgFeatureLandingSeo(kind);
    const helmet = buildPageSEO(seo);
    const copy = featureIntro(kind);
    const faqs = featureFaqs(kind);
    const paths = { wifi: '/pg-with-wifi', food: '/pg-with-food', ac: '/pg-with-ac' };
    const crumbPath = paths[kind];
    const combinedLd = buildPgLocationCombinedGraph(faqs, [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: copy.h1, path: crumbPath },
    ], 'Bangalore');

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id={`pg-feature-${kind}-json`} />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <header className="max-w-3xl">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: copy.h1 },
                            ]}
                        />
                        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{copy.h1}</h1>
                        <p className="mt-3 text-lg text-slate-600 leading-relaxed">{copy.lead}</p>
                        <p className="mt-4 text-slate-700 leading-relaxed">{copy.body}</p>
                        <p className="mt-4 text-sm">
                            <Link to="/pg/bangalore" className="font-semibold text-brand-red hover:underline">
                                ← PG in Bangalore (city hub)
                            </Link>
                        </p>
                    </header>
                </div>

                <div className="mt-8 border-t border-slate-200/80 bg-white">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity="Bangalore"
                        pageTitle={`${copy.h1} — listings`}
                        pageSubtitle="Filters applied for this page — scroll to refine further."
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
