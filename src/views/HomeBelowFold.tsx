'use client';

import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import { About } from '@/components/sections/About';
import { HomeFaqSection } from '@/components/sections/HomeFaqSection';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import type { HomeInventorySummary } from '@/lib/homeInventoryStats';
import type { ListingsCategoryKey } from '@/lib/listingsCategoryHubs';
import type { FaqItem } from '@/lib/schema';
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
    homeFaqs: FaqItem[];
    homeStats?: HomeInventorySummary | null;
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
    homeStats,
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

            <About homeStats={homeStats} />

            <HomeFaqSection items={homeFaqs} />

            <SafetyPopup isOpen={isSafetyPopupOpen} onClose={onSafetyClose} />
        </>
    );
}
