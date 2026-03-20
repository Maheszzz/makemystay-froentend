import type { Property } from "@/types/api";

/**
 * Convert a property title into a URL-safe slug segment.
 * e.g. "SLC BHK 2 — BTM Layout!" → "slc-bhk-2-btm-layout"
 */
export function titleToSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Build the canonical property detail path: /properties/{id}-{slug}
 * Using the ID prefix means the detail page can always fetch by ID — no
 * separate slug-lookup needed and links stay valid even if the title changes.
 *
 * Examples:
 *   /properties/102-slc-bhk-2
 *   /properties/45-premium-pg-koramangala
 */
export function getPropertyDetailPath(property: Property): string {
    const id = String(property.id);
    const slugPart = property.slug?.trim() || titleToSlug(property.title || '');
    if (slugPart) {
        return `/properties/${id}-${slugPart}`;
    }
    // Bare-ID fallback (very rare — property has no title or slug)
    return `/properties/${id}`;
}

/**
 * Parse a combined "{id}-{slug}" route param back to just the numeric ID.
 * "/properties/102-slc-bhk-2" → param = "102-slc-bhk-2" → returns "102"
 */
export function parsePropertySlugParam(param: string): string {
    const match = param.match(/^(\d+)/);
    return match ? match[1] : param;
}
