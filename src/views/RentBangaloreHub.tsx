'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, rentBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { MapPin } from 'lucide-react';
import { useState, useCallback } from 'react';
import { formatInrRange } from '@/lib/listingInventoryStats';

const HUB_FAQS = [
    {
        question: 'What is the average rent for a 1BHK flat in Bangalore?',
        answer:
            '1BHK flats in Bangalore rent for ₹12,000–₹35,000/month depending on area. Whitefield and Electronic City average ₹15,000–₹22,000. Koramangala and Indiranagar run ₹25,000–₹40,000.',
    },
    {
        question: 'Is there any brokerage for rentals on MakeMyStay?',
        answer:
            'No. MakeMyStay charges zero brokerage to tenants. You pay only rent and a refundable security deposit directly to the owner.',
    },
    {
        question: 'Can I find furnished flats for rent in Bangalore on MakeMyStay?',
        answer:
            'Yes. All listings on MakeMyStay are verified and include furnished, semi-furnished, and unfurnished options. Filter by furnished status on the search page.',
    },
    {
        question: 'What documents do I need to rent a flat in Bangalore?',
        answer:
            "Typically: Aadhaar card, PAN card, last 3 months' salary slips or bank statements, and one passport photo. MakeMyStay guides you through the full documentation process after booking.",
    },
];

const PAGE_TITLE = 'Flats for rent in Bangalore';
const PAGE_SUBTITLE =
    'Apartments and independent homes for rent across Bangalore. Filter by area, BHK, furnishing, and monthly budget.';

export default function RentBangaloreHub() {
    const [rentRange, setRentRange] = useState<{ min: number; max: number } | null>(null);
    const onRentHubInventoryRange = useCallback((min: number | null, max: number | null) => {
        if (min != null && max != null) setRentRange({ min, max });
        else setRentRange(null);
    }, []);

    const helmet = buildPageSEO(rentBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Flats', path: '/rent' },
        { name: 'Flats for rent in Bangalore', path: '/rent/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    return (
        <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="rent-bangalore-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
                <header className="bg-gradient-to-b from-oxblood-900 to-oxblood-700">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 pb-14 md:pb-16">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'Flats', path: '/rent' },
                                { name: 'Flats for rent in Bangalore' },
                            ]}
                        />
                        <div className="mt-4 max-w-3xl">
                            <h1 className="font-serif-display text-[40px] md:text-[48px] font-normal text-white tracking-[-0.015em] leading-[1.08]">
                                {PAGE_TITLE}
                            </h1>
                            <div aria-hidden="true" className="w-12 h-[1px] bg-champagne my-3.5" />
                            <p className="text-blush-muted text-base md:text-lg leading-relaxed max-w-2xl">
                                {PAGE_SUBTITLE}
                                {rentRange ? (
                                    <span className="ml-2 text-white font-medium tabular-nums">
                                        ({formatInrRange(rentRange.min, rentRange.max)}/mo in current listings)
                                    </span>
                                ) : null}
                            </p>
                        </div>
                    </div>
                </header>

                <div>
                    <Properties
                        hideChrome
                        embedRentHubUi
                        initialCategory="rent"
                        initialCity="bangalore"
                        pageTitle={PAGE_TITLE}
                        pageSubtitle={PAGE_SUBTITLE}
                        onRentHubInventoryRange={onRentHubInventoryRange}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
                    <FaqSection
                        title="Frequently asked — rent in Bangalore"
                        items={HUB_FAQS}
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
