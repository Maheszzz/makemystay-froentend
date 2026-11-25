'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, rentBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { Link } from '@/lib/navigation';
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
                <Properties
                    hideChrome
                    embedRentHubUi
                    initialCategory="rent"
                    initialCity="bangalore"
                    pageTitle={PAGE_TITLE}
                    pageSubtitle={PAGE_SUBTITLE}
                    hero={{
                        breadcrumbs: [
                            { name: 'Home', path: '/' },
                            { name: 'Flats', path: '/rent' },
                            { name: PAGE_TITLE },
                        ],
                        title: PAGE_TITLE,
                        subtitle: rentRange
                            ? `${PAGE_SUBTITLE} (${formatInrRange(rentRange.min, rentRange.max)}/mo in current listings)`
                            : PAGE_SUBTITLE,
                    }}
                    onRentHubInventoryRange={onRentHubInventoryRange}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-12">
                    <section aria-labelledby="rent-bangalore-areas-heading">
                        <h2 id="rent-bangalore-areas-heading" className="text-xl font-bold text-slate-900 mb-4">
                            Browse Flats for Rent by Area in Bangalore
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {[
                                { label: 'Hebbal', slug: 'hebbal' },
                                { label: 'JP Nagar', slug: 'jp-nagar' },
                                { label: 'HSR Layout', slug: 'hsr-layout' },
                                { label: 'Whitefield', slug: 'whitefield' },
                                { label: 'Marathahalli', slug: 'marathahalli' },
                                { label: 'Bellandur', slug: 'bellandur' },
                                { label: 'Sarjapur Road', slug: 'sarjapur-road' },
                                { label: 'Indiranagar', slug: 'indiranagar' },
                                { label: 'BTM Layout', slug: 'btm' },
                                { label: 'Koramangala', slug: 'koramangala' },
                                { label: 'Electronic City', slug: 'electronic-city' },
                                { label: 'Jayanagar', slug: 'jayanagar' },
                            ].map((area) => (
                                <Link
                                    key={area.slug}
                                    to={`/rent/${area.slug}`}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-brand-red/40 hover:text-brand-red transition-colors"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" aria-hidden />
                                    Rent in {area.label}
                                </Link>
                            ))}
                        </div>
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
