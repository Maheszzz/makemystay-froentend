import type { Property } from '@/types/api';

/** Rough parse of displayed INR price for JSON-LD Offer (best-effort). */
export function parseInrOfferAmount(priceDisplay: string): number | undefined {
    const s = priceDisplay.trim();
    if (!s || /request|negotiable/i.test(s)) return undefined;
    if (/cr/i.test(s)) {
        const n = parseFloat(s.replace(/[^\d.]/g, ''));
        return Number.isFinite(n) ? n * 1_00_00_000 : undefined;
    }
    const n = parseFloat(s.replace(/[₹,\s]/g, ''));
    return Number.isFinite(n) ? n : undefined;
}

export function stripMarkdownLight(text: string): string {
    return text.replace(/\*\*?|__|\*|_/g, '').replace(/\s+/g, ' ').trim();
}

export function propertyLikelyHasAc(property: Property): boolean {
    const blob = [property.type, ...(property.features ?? [])].join(' ').toLowerCase();
    return /\bac\b|air[\s-]*condition|a\/c|split/i.test(blob);
}

export function propertyMatchesPgFeatureFilters(
    property: Property,
    f: { wifi?: boolean; food?: boolean; ac?: boolean }
): boolean {
    if (f.wifi && !property.wifi) return false;
    if (f.food && !property.food) return false;
    if (f.ac && !propertyLikelyHasAc(property)) return false;
    return true;
}
