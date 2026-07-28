import type { Property } from '@/types/api';
import { FEATURED_PROPERTIES } from '@/config/featuredProperties';

/**
 * Sort properties using 4 priority tiers:
 * 1. Priority 1: Properties from the FEATURED_PROPERTIES list always come first.
 * 2. Priority 2: Order of those top properties follows their index in FEATURED_PROPERTIES.
 * 3. Priority 3: Remaining properties are sorted by review count (highest first).
 * 4. Priority 4: If review count is equal, sort by rating (highest first).
 */
export function sortPropertiesByPriorityAndRating(properties: Property[]): Property[] {
    return [...properties].sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();

        const priorityA = FEATURED_PROPERTIES.findIndex((kw) => titleA.includes(kw));
        const priorityB = FEATURED_PROPERTIES.findIndex((kw) => titleB.includes(kw));

        // 1 & 2. Top properties always come first and strictly follow the list order
        if (priorityA !== -1 || priorityB !== -1) {
            if (priorityA === -1) return 1;
            if (priorityB === -1) return -1;
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
        }

        // 3. Remaining properties (or tie between same top keyword): sort by review count (highest first)
        const reviewDiff =
            (Number(b.reviews ?? b.review_count ?? 0) || 0) - (Number(a.reviews ?? a.review_count ?? 0) || 0);
        if (reviewDiff !== 0) return reviewDiff;

        // 4. If review count is equal, sort by rating (highest first)
        return (
            (Number(b.rating ?? b.average_rating ?? 4.8) || 4.8) -
            (Number(a.rating ?? a.average_rating ?? 4.8) || 4.8)
        );
    });
}
