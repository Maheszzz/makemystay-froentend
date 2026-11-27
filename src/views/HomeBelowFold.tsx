'use client';

import dynamic from 'next/dynamic';
import { InvestmentCalculator } from '@/components/modules/calculator/InvestmentCalculator';
import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import { FounderSection } from '@/components/sections/FounderSection';
import { HomeCtaBand } from '@/components/sections/home/HomeCtaBand';
import { HomeFaqSection } from '@/components/sections/home/HomeFaqSection';
import { HomeIntro } from '@/components/sections/home/HomeIntro';
import { HowItWorks } from '@/components/sections/home/HowItWorks';
import { Link } from '@/lib/navigation';
import type { HomeInventorySummary } from '@/lib/homePageData';
import type { ListingsCategoryKey } from '@/lib/listingsCategoryHubs';
import type { Property } from '@/types/api';

const SafetyPopup = dynamic(
    () => import('@/components/modals/SafetyPopup').then((m) => ({ default: m.SafetyPopup })),
    { ssr: false },
);

interface HomeBelowFoldProps {
    listingsCategory: ListingsCategoryKey;
    searchQuery: string;
    heroFilters: HeroSearchFilters;
    setHeroFilters: (next: HeroSearchFilters) => void;
    isSafetyPopupOpen: boolean;
    onSafetyClose: () => void;
    homeFaqs: { question: string; answer: string }[];
    homeInventory?: HomeInventorySummary;
    initialProperties?: Property[];
}

export function HomeBelowFold({
    listingsCategory,
    searchQuery,
    heroFilters,
    setHeroFilters,
    isSafetyPopupOpen,
    onSafetyClose,
    homeFaqs,
    homeInventory,
    initialProperties,
}: HomeBelowFoldProps) {
    return (
        <>
            <PropertyGrid
                category={listingsCategory}
                searchQuery={searchQuery}
                cardVariant="project"
                filters={heroFilters}
                setFilters={setHeroFilters}
                initialProperties={initialProperties}
            />

            <HomeIntro summary={homeInventory} />

            <InvestmentCalculator />

            <HowItWorks tokenEnabledCount={homeInventory?.tokenEnabledCount ?? 0} />

            <FounderSection bgClass="bg-page" />

            <HomeCtaBand />

            <section
                aria-labelledby="home-area-directory-heading"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200/70"
            >
                <h2 id="home-area-directory-heading" className="text-lg font-bold text-slate-900 mb-4">
                    Explore Flats for Rent &amp; Boys/Girls PGs Across Bangalore
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2">Flats for Rent by Area</h3>
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-slate-600">
                            {[
                                { label: 'Rent in Hebbal', to: '/rent/hebbal' },
                                { label: 'Rent in JP Nagar', to: '/rent/jp-nagar' },
                                { label: 'Rent in HSR Layout', to: '/rent/hsr-layout' },
                                { label: 'Rent in Whitefield', to: '/rent/whitefield' },
                                { label: 'Rent in Marathahalli', to: '/rent/marathahalli' },
                                { label: 'Rent in Bellandur', to: '/rent/bellandur' },
                                { label: 'Rent in Sarjapur Road', to: '/rent/sarjapur-road' },
                                { label: 'Rent in Indiranagar', to: '/rent/indiranagar' },
                                { label: 'Rent in BTM Layout', to: '/rent/btm' },
                                { label: 'Rent in Koramangala', to: '/rent/koramangala' },
                                { label: 'Rent in Electronic City', to: '/rent/electronic-city' },
                            ].map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className="hover:text-brand-red hover:underline">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2">Boys PG by Area</h3>
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-slate-600">
                            {[
                                { label: 'Boys PG in Marathahalli', to: '/pg-for-boys-in-marathahalli' },
                                { label: 'Boys PG in Electronic City', to: '/pg-for-boys-in-electronic-city' },
                                { label: 'Boys PG in Sarjapur Road', to: '/pg-for-boys-in-sarjapur-road' },
                                { label: 'Boys PG in Nagawara', to: '/pg-for-boys-in-nagawara' },
                                { label: 'Boys PG in Koramangala', to: '/pg-for-boys-in-koramangala' },
                                { label: 'Boys PG in CV Raman Nagar', to: '/pg-for-boys-in-cv-raman-nagar' },
                                { label: 'Boys PG in KR Puram', to: '/pg-for-boys-in-kr-puram' },
                                { label: 'Boys PG in Thanisandra', to: '/pg-for-boys-in-thanisandra' },
                                { label: 'Boys PG in Manyata Tech Park', to: '/pg-for-boys-in-manyata-tech-park' },
                            ].map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className="hover:text-brand-red hover:underline">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2">Girls PG by Area</h3>
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-slate-600">
                            {[
                                { label: 'Girls PG in Whitefield', to: '/pg-for-girls-in-whitefield' },
                                { label: 'Girls PG in Indiranagar', to: '/pg-for-girls-in-indiranagar' },
                                { label: 'Girls PG in Marathahalli', to: '/pg-for-girls-in-marathahalli' },
                                { label: 'Girls PG in Brookefield', to: '/pg-for-girls-in-brookefield' },
                                { label: 'Girls PG in CV Raman Nagar', to: '/pg-for-girls-in-cv-raman-nagar' },
                                { label: 'Girls PG in Banaswadi', to: '/pg-for-girls-in-banaswadi' },
                                { label: 'Girls PG in Hoodi', to: '/pg-for-girls-in-hoodi' },
                                { label: 'Girls PG in Thanisandra', to: '/pg-for-girls-in-thanisandra' },
                                { label: 'Girls PG in Yeshwanthpur', to: '/pg-for-girls-in-yeshwanthpur' },
                                { label: 'Girls PG in Rajajinagar', to: '/pg-for-girls-in-rajajinagar' },
                            ].map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className="hover:text-brand-red hover:underline">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <HomeFaqSection items={homeFaqs} />

            <SafetyPopup isOpen={isSafetyPopupOpen} onClose={onSafetyClose} />
        </>
    );
}
