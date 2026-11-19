'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, buyBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { MapPin } from 'lucide-react';

const HUB_FAQS = [
    {
        question: 'Is brokerage charged when buying through MakeMyStay?',
        answer:
            'MakeMyStay focuses on verified listings and transparent pricing. Brokerage terms depend on the listing — many owners advertise direct deals; confirm before you pay any token or deposit.',
    },
    {
        question: 'What should I verify before buying a flat in Bangalore?',
        answer:
            'Check RERA registration where applicable, sanctioned plan, OC status, encumbrance certificate, and builder reputation. Use site visits to validate carpet area and amenities match the listing.',
    },
    {
        question: 'Which areas are popular for mid-budget apartments in Bangalore?',
        answer:
            'Whitefield, Sarjapur Road, Electronic City, and Bellandur see strong IT demand. Indiranagar, Koramangala, and HSR skew premium. Pick based on commute and long-term resale liquidity.',
    },
];

const PAGE_TITLE = 'Homes to buy in Bangalore';
const PAGE_SUBTITLE =
    'Residential flats and houses listed for sale across Bangalore.';

export default function BuyBangaloreHub() {
    const helmet = buildPageSEO(buyBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Buy', path: '/buy' },
        { name: 'Homes to buy in Bangalore', path: '/buy/in/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    return (
        <div className="min-h-screen bg-pdp-bg text-pdp-ink font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="buy-bangalore-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
                <header className="bg-pdp-surface border-b border-pdp-border">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'Buy', path: '/buy' },
                                { name: 'Homes to buy in Bangalore' },
                            ]}
                        />
                        <div className="mt-4 max-w-3xl">
                            <h1 className="font-serif-display text-[40px] md:text-[48px] font-normal text-pdp-ink tracking-[-0.015em] leading-[1.08]">
                                {PAGE_TITLE}
                            </h1>
                            <p className="mt-2.5 text-pdp-muted text-base md:text-lg leading-relaxed max-w-2xl">
                                {PAGE_SUBTITLE}
                            </p>
                            <p className="mt-2 text-xs text-pdp-muted">
                                Cards display current availability and the last-verified date when recorded.
                            </p>
                        </div>
                    </div>
                </header>

                <div>
                    <Properties
                        hideChrome
                        initialCategory="buy"
                        initialCity="bangalore"
                        pageTitle={PAGE_TITLE}
                        pageSubtitle={PAGE_SUBTITLE}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
                    <FaqSection
                        title="Frequently asked — buy in Bangalore"
                        items={HUB_FAQS}
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
