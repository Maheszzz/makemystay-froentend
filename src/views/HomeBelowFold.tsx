'use client';

import dynamic from 'next/dynamic';
import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import { ServicesGrid } from '@/components/modules/services/ServicesGrid';
import { InvestmentCalculator } from '@/components/modules/calculator/InvestmentCalculator';
import { About } from '@/components/sections/About';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { Comparison } from '@/components/sections/Comparison';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { CTA } from '@/components/sections/CTA';
import { FaqSection } from '@/components/seo/FaqSection';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
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

            <section id="services" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Services</h2>
                    <p className="text-slate-600 mt-2 text-sm sm:text-base">
                        Comprehensive solutions for every real estate need
                    </p>
                </div>
                <ServicesGrid />
            </section>

            <InvestmentCalculator />
            <About />
            <Problem />
            <Solution />
            <Comparison />
            <CaseStudy />
            <CTA />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
                <FaqSection
                    id="home-faq-heading"
                    title="Frequently asked questions"
                    items={homeFaqs}
                    variant="light"
                />
            </div>

            <SafetyPopup isOpen={isSafetyPopupOpen} onClose={onSafetyClose} />
        </>
    );
}
