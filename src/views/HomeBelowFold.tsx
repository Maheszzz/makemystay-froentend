'use client';

import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import { About } from '@/components/sections/About';
import { FaqSection } from '@/components/seo/FaqSection';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import type { ListingsCategoryKey } from '@/lib/listingsCategoryHubs';
import type { Property } from '@/types/api';
import dynamic from 'next/dynamic';

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

            <About />

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
