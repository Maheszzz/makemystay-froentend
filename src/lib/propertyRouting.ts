import type { Property } from "@/types/api";

function normalizeTypeForRoute(property: Property): string {
    const type = (property.type || '').toString().trim().toLowerCase();
    if (type === 'pg' || type === 'hostel') return 'pg';
    if (property.category === "buy") return "buy";
    return "rent";
}

export function getPropertyDetailPath(property: Property): string {
    const slug = property.slug?.trim();
    if (slug) {
        return `/properties/${normalizeTypeForRoute(property)}/${encodeURIComponent(slug)}`;
    }
    return `/properties/id/${encodeURIComponent(String(property.id))}`;
}
