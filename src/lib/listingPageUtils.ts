import type { Property } from '@/types/api';
import { plotSqftFromProperty } from '@/lib/listingInventoryStats';
import { propertyMatchesPgGenderFilter } from '@/lib/propertySeoUtils';

export const LISTING_CATEGORY_KEYS = ['all', 'pg', 'rent', 'buy', 'plot'] as const;
export type ListingCategoryKey = (typeof LISTING_CATEGORY_KEYS)[number];

/** Tab labels aligned with main navbar (`PGs`, `Flats`). */
export const LISTING_TAB_LABEL: Record<ListingCategoryKey, string> = {
    all: 'All',
    pg: 'PGs',
    rent: 'Flats',
    buy: 'Buy',
    plot: 'Plots',
};

export function getListingHeaderCopy(category: ListingCategoryKey, cityLabel: string) {
    switch (category) {
        case 'pg':
            return {
                title: `PGs in ${cityLabel}`,
                subtitle: `PGs and coliving homes across ${cityLabel} — filter by area, budget, and amenities.`,
            };
        case 'rent':
            return {
                title: `Flats for rent in ${cityLabel}`,
                subtitle: `Flats and independent homes for rent across ${cityLabel} — filter by area, BHK, and budget.`,
            };
        case 'buy':
            return {
                title: `Homes to buy in ${cityLabel}`,
                subtitle: `Residential flats and homes for sale in ${cityLabel}, with transparent pricing.`,
            };
        case 'plot':
            return {
                title: `Plots in ${cityLabel}`,
                subtitle: `Residential land and plot listings across ${cityLabel}, with area and budget filters.`,
            };
        case 'all':
        default:
            return {
                title: `Properties in ${cityLabel}`,
                subtitle: `PGs, flats for rent, homes to buy, and plots across ${cityLabel}.`,
            };
    }
}

export function formatResultHeading(count: number, category: ListingCategoryKey, areaOrCity: string): string {
    const plural = count !== 1;
    let noun = plural ? 'properties' : 'property';
    if (category === 'pg') noun = plural ? 'PGs' : 'PG';
    else if (category === 'rent') noun = plural ? 'flats for rent' : 'flat for rent';
    else if (category === 'buy') noun = plural ? 'homes to buy' : 'home to buy';
    else if (category === 'plot') noun = plural ? 'plots' : 'plot';
    return `${count.toLocaleString('en-IN')} ${noun} in ${areaOrCity}`;
}

export function parsePropertyPriceInr(priceStr?: string): number | null {
    if (!priceStr) return null;
    const s = priceStr.trim();
    if (!s || /request|negotiable/i.test(s)) return null;
    if (/\bcr\b/i.test(s)) {
        const n = parseFloat(s.replace(/[^\d.]/g, ''));
        return Number.isFinite(n) && n > 0 ? n * 1_00_00_000 : null;
    }
    if (/\b(?:l|lac|lakh|lakhs)\b/i.test(s)) {
        const n = parseFloat(s.replace(/[^\d.]/g, ''));
        return Number.isFinite(n) && n > 0 ? n * 1_00_000 : null;
    }
    const n = parseFloat(s.replace(/[₹,\s]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : null;
}

export interface BudgetPreset {
    id: string;
    label: string;
    min: string;
    max: string;
}

export function getBudgetPresetsForCategory(category: ListingCategoryKey): BudgetPreset[] {
    if (category === 'pg') {
        return [
            { id: 'under-10k', label: 'Under ₹10k', min: '', max: '10000' },
            { id: '10k-15k', label: '₹10k – ₹15k', min: '10000', max: '15000' },
            { id: '15k-plus', label: '₹15k+', min: '15000', max: '' },
        ];
    }
    if (category === 'rent') {
        return [
            { id: 'under-20k', label: 'Under ₹20k', min: '', max: '20000' },
            { id: '20k-35k', label: '₹20k – ₹35k', min: '20000', max: '35000' },
            { id: '35k-plus', label: '₹35k+', min: '35000', max: '' },
        ];
    }
    if (category === 'buy' || category === 'plot') {
        return [
            { id: 'under-1cr', label: 'Under ₹1 Cr', min: '', max: '10000000' },
            { id: '1cr-2cr', label: '₹1 Cr – ₹2 Cr', min: '10000000', max: '20000000' },
            { id: '2cr-plus', label: '₹2 Cr+', min: '20000000', max: '' },
        ];
    }
    return [
        { id: 'under-12k', label: 'Under ₹12k', min: '', max: '12000' },
        { id: '12k-25k', label: '₹12k – ₹25k', min: '12000', max: '25000' },
        { id: '25k-plus', label: '₹25k+', min: '25000', max: '' },
    ];
}

export function formatFurnishingLabel(raw: string): string {
    const clean = raw.replace(/_/g, ' ').trim().toLowerCase();
    return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : raw;
}

export interface AvailableTypeFilters {
    pgGenders: ('male' | 'female')[];
    pgSharing: string[];
    hasPgFood: boolean;
    bhkTypes: string[];
    furnishingOptions: { value: string; label: string }[];
    plotSizeBuckets: { id: string; label: string; min?: number; max?: number }[];
}

const SHARING_ORDER = ['Single', 'Double', 'Triple', 'Private'];
const FURNISHING_ORDER = ['fully_furnished', 'semi_furnished', 'unfurnished'];

function hasStrictGenderCue(p: Property, gender: 'male' | 'female'): boolean {
    const text = [p.title, p.description, p.type, p.gender, ...(p.features ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    if (gender === 'female') {
        return /\b(female|girls|ladies|women|girls pg|ladies pg)\b/i.test(text);
    }
    return /\b(male|boys|gents|men|boys pg|gents pg)\b/i.test(text);
}

/**
 * Inspects loaded API properties to expose ONLY filter chips that actually exist in real inventory.
 */
export function deriveAvailableFilterOptions(
    list: Property[],
    activeSelections?: {
        gender?: 'male' | 'female';
        sharing?: string;
        food?: boolean;
        typeFilter?: string;
        furnishing?: string;
        plotSize?: string;
    },
): AvailableTypeFilters {
    const pgGenders: ('male' | 'female')[] = [];
    if (list.some((p) => hasStrictGenderCue(p, 'male') && propertyMatchesPgGenderFilter(p, 'male')) || activeSelections?.gender === 'male') {
        pgGenders.push('male');
    }
    if (list.some((p) => hasStrictGenderCue(p, 'female') && propertyMatchesPgGenderFilter(p, 'female')) || activeSelections?.gender === 'female') {
        pgGenders.push('female');
    }

    const sharingSet = new Set<string>();
    for (const p of list) {
        if (Array.isArray(p.sharing)) {
            for (const s of p.sharing) {
                const norm = SHARING_ORDER.find((o) => o.toLowerCase() === s.trim().toLowerCase());
                if (norm) sharingSet.add(norm);
            }
        }
    }
    if (activeSelections?.sharing) {
        const norm = SHARING_ORDER.find((o) => o.toLowerCase() === activeSelections.sharing!.toLowerCase());
        if (norm) sharingSet.add(norm);
    }
    const pgSharing = SHARING_ORDER.filter((s) => sharingSet.has(s));

    const hasPgFood = list.some((p) => Boolean(p.food)) || Boolean(activeSelections?.food);

    const bhkSet = new Set<string>();
    const furnSet = new Set<string>();
    const plotSqfts: number[] = [];

    for (const p of list) {
        const pt = (p.type || '').trim();
        if (pt && !/^(pg|plot|hostel)$/i.test(pt)) {
            bhkSet.add(pt);
        }
        if (typeof p.furnishing === 'string' && p.furnishing.trim()) {
            furnSet.add(p.furnishing.trim().toLowerCase());
        }
        const sq = plotSqftFromProperty(p);
        if (sq != null && (p.category === 'plot' || pt.toLowerCase() === 'plot')) {
            plotSqfts.push(sq);
        }
    }
    if (activeSelections?.typeFilter && activeSelections.typeFilter !== 'all') {
        bhkSet.add(activeSelections.typeFilter);
    }
    if (activeSelections?.furnishing) {
        furnSet.add(activeSelections.furnishing.toLowerCase());
    }

    const bhkTypes = Array.from(bhkSet).sort((a, b) => a.localeCompare(b, 'en-IN'));
    const furnishingOptions = Array.from(furnSet)
        .sort((a, b) => {
            const ia = FURNISHING_ORDER.indexOf(a);
            const ib = FURNISHING_ORDER.indexOf(b);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        })
        .map((value) => ({ value, label: formatFurnishingLabel(value) }));

    const plotSizeBuckets: AvailableTypeFilters['plotSizeBuckets'] = [];
    if (plotSqfts.length > 0) {
        if (plotSqfts.some((s) => s < 1200) || activeSelections?.plotSize === 'under-1200') {
            plotSizeBuckets.push({ id: 'under-1200', label: 'Under 1,200 sq ft', max: 1200 });
        }
        if (plotSqfts.some((s) => s >= 1200 && s <= 2400) || activeSelections?.plotSize === '1200-2400') {
            plotSizeBuckets.push({ id: '1200-2400', label: '1,200–2,400 sq ft', min: 1200, max: 2400 });
        }
        if (plotSqfts.some((s) => s > 2400) || activeSelections?.plotSize === '2400-plus') {
            plotSizeBuckets.push({ id: '2400-plus', label: '2,400+ sq ft', min: 2400 });
        }
    }

    return {
        pgGenders,
        pgSharing,
        hasPgFood,
        bhkTypes,
        furnishingOptions,
        plotSizeBuckets,
    };
}

export function buildEmptyFilterWhatsappMessage(params: {
    categoryLabel: string;
    areaOrCity: string;
    searchQuery: string;
    minPrice: string;
    maxPrice: string;
    typeFilter: string;
    genderFilter?: string;
    sharingFilter?: string;
    furnishingFilter?: string;
    foodOn?: boolean;
    wifiOn?: boolean;
}): string {
    const parts: string[] = [];
    if (params.searchQuery.trim()) parts.push(`area/query "${params.searchQuery.trim()}"`);
    if (params.typeFilter && params.typeFilter !== 'all') parts.push(params.typeFilter);
    if (params.genderFilter) parts.push(`${params.genderFilter} only`);
    if (params.sharingFilter) parts.push(`${params.sharingFilter} sharing`);
    if (params.furnishingFilter) parts.push(formatFurnishingLabel(params.furnishingFilter));
    if (params.foodOn) parts.push('with meals');
    if (params.wifiOn) parts.push('with WiFi');
    if (params.minPrice || params.maxPrice) {
        const min = params.minPrice ? `₹${Number(params.minPrice).toLocaleString('en-IN')}` : '₹0';
        const max = params.maxPrice ? `₹${Number(params.maxPrice).toLocaleString('en-IN')}` : 'any';
        parts.push(`budget ${min}–${max}`);
    }
    const detail = parts.length > 0 ? ` matching ${parts.join(', ')}` : '';
    return `Hi! I'm looking for ${params.categoryLabel} in ${params.areaOrCity}${detail} on MakeMyStay.ai. Could you share matching options?`;
}
