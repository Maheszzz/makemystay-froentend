'use client';

import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { PG_LOCATIONS } from '@/data/pgLocations';
import { buildPageSEO, rentBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { ChevronRight, MapPin } from 'lucide-react';
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

    const topSlugs = PG_LOCATIONS.slice(0, 16);
    const subtitleWithRange = rentRange
        ? `${PAGE_SUBTITLE} (${formatInrRange(rentRange.min, rentRange.max)}/mo in current listings)`
        : PAGE_SUBTITLE;

    return (
        <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="rent-bangalore-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
                <Properties
                    hideChrome
                    embedRentHubUi
                    initialCategory="rent"
                    initialCity="bangalore"
                    pageTitle={PAGE_TITLE}
                    pageSubtitle={subtitleWithRange}
                    hero={{
                        breadcrumbs: [
                            { name: 'Home', path: '/' },
                            { name: 'Flats for rent in Bangalore' },
                        ],
                        title: PAGE_TITLE,
                        subtitle: subtitleWithRange,
                    }}
                    onRentHubInventoryRange={onRentHubInventoryRange}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20 space-y-14">
                    <section aria-labelledby="top-areas-heading">
                        <div className="mb-6">
                            <h2 id="top-areas-heading" className="font-heading text-2xl font-bold text-ink tracking-tight">
                                Browse flats by area in Bangalore
                            </h2>
                            <p className="text-slate mt-1 text-sm md:text-base">
                                Select a locality to view rental options and local FAQs.
                            </p>
                        </div>
                        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3.5" aria-label="Rent areas">
                            {topSlugs.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    to={`/rent/${loc.slug}`}
                                    className="group flex items-center justify-between p-4 rounded-[12px] bg-white border border-line hover:border-red/40 transition-colors"
                                >
                                    <span className="inline-flex items-center gap-2 min-w-0">
                                        <MapPin className="w-4 h-4 text-red shrink-0" aria-hidden="true" />
                                        <span className="text-sm font-semibold text-ink group-hover:text-red truncate">
                                            Flats in {loc.name}
                                        </span>
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate shrink-0" aria-hidden="true" />
                                </Link>
                            ))}
                        </nav>
                    </section>

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
