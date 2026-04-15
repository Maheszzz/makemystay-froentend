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

function tokenizeSlugSource(value: string | undefined): string[] {
    if (!value) return [];
    return value
        .toLowerCase()
        .replace(/\bin\b/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

/**
 * SEO-first semantic slug:
 * name + type + locality/city while deduping repeated words.
 *
 * Example:
 * "New Living Homes" + "1BHK" + "Bellandur, Bangalore"
 *   → "new-living-homes-1bhk-bellandur-bangalore"
 */
export function buildPropertySeoSlug(property: Pick<Property, 'title' | 'type' | 'location' | 'slug'>): string {
    const orderedTokens = [
        ...tokenizeSlugSource(property.title),
        ...tokenizeSlugSource(property.type),
        ...tokenizeSlugSource(property.location),
    ];
    const deduped = orderedTokens.filter((token, index) => orderedTokens.indexOf(token) === index);
    const semanticSlug = deduped.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return semanticSlug || property.slug?.trim() || titleToSlug(property.title || '');
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
    const slugPart = buildPropertySeoSlug(property);
    if (slugPart) {
        // High-authority semantic route: /pg/{id}-{slug}
        return `/pg/${id}-${slugPart}`;
    }
    // Bare-ID fallback
    return `/pg/${id}`;
}

/**
 * Parse a combined "{id}-{slug}" route param back to just the numeric ID.
 * "/properties/102-slc-bhk-2" → param = "102-slc-bhk-2" → returns "102"
 */
export function parsePropertySlugParam(param: string): string {
    const match = param.match(/^(\d+)/);
    return match ? match[1] : param;
}
