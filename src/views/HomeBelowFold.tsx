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

            <HomeFaqSection items={homeFaqs} />

            <SafetyPopup isOpen={isSafetyPopupOpen} onClose={onSafetyClose} />
        </>
    );
}
