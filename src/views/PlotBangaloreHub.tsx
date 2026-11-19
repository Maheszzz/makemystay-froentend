'use client';

import { useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, plotBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { MapPin } from 'lucide-react';
import { formatSqftRange } from '@/lib/listingInventoryStats';

const HUB_FAQS = [
    {
        question: 'What documents should I check before buying a plot in Bangalore?',
        answer:
            'Review title deed, mother deed chain, encumbrance certificate, approved layout plan, conversion order if agricultural land, and khata (A/B/E-khata) status. Engage a lawyer for high-value parcels.',
    },
    {
        question: 'Are plot sizes listed in sq ft or guntha?',
        answer:
            'Listings usually show square feet or cents/guntha depending on the micro-market. Use filters and compare on a normalized basis before site visits.',
    },
    {
        question: 'Why do some Bangalore plots show limited inventory?',
        answer:
            'Bangalore has fragmented land records and gated community plots. Verified inventory updates as owners onboard — widen area filters if your first search is thin.',
    },
];

const PAGE_TITLE = 'Plots in Bangalore';
const PAGE_SUBTITLE =
    'Residential plots and land parcels across Bangalore. Filter by area and budget.';

export default function PlotBangaloreHub() {
    const [sqftRange, setSqftRange] = useState<{ min: number; max: number } | null>(null);
    const onPlotHubInventoryRange = useCallback((min: number | null, max: number | null) => {
        if (min != null && max != null) setSqftRange({ min, max });
        else setSqftRange(null);
    }, []);

    const helmet = buildPageSEO(plotBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Plots', path: '/plots' },
        { name: 'Plots in Bangalore', path: '/plots/in/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    const subtitleWithRange = sqftRange
        ? `${PAGE_SUBTITLE} (${formatSqftRange(sqftRange.min, sqftRange.max)})`
        : PAGE_SUBTITLE;

    return (
        <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="plot-bangalore-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
                <Properties
                    hideChrome
                    embedPlotHubUi
                    initialCategory="plot"
                    initialCity="bangalore"
                    pageTitle={PAGE_TITLE}
                    pageSubtitle={subtitleWithRange}
                    hero={{
                        breadcrumbs: [
                            { name: 'Home', path: '/' },
                            { name: 'Plots', path: '/plots' },
                            { name: PAGE_TITLE },
                        ],
                        title: PAGE_TITLE,
                        subtitle: subtitleWithRange,
                    }}
                    onPlotHubInventoryRange={onPlotHubInventoryRange}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
                    <FaqSection
                        title="Frequently asked — plots in Bangalore"
                        items={HUB_FAQS}
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
