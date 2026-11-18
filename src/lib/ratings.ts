import type { Property, Review } from '@/types/api';

/** Minimum number of approved reviews required before displaying an aggregate star rating. */
export const MIN_REVIEWS_FOR_RATING = 3;

export interface QualifiedRatingSummary {
    showRating: boolean;
    rating: number;
    reviewCount: number;
    approvedReviews: Review[];
}

export function getApprovedReviews(reviews?: Review[] | null): Review[] {
    if (!Array.isArray(reviews)) return [];
    return reviews.filter((r) => r && (!r.status || r.status === 'approved') && r.rating > 0);
}

/**
 * Returns rating/count only when backed by at least `MIN_REVIEWS_FOR_RATING` reviews.
 * When `requireReviewsList` is true (e.g. PDP), requires real `reviews_list` items behind the count.
 */
export function getQualifiedRatingSummary(
    property: Pick<Property, 'rating' | 'average_rating' | 'reviews' | 'review_count' | 'reviews_list'> | null | undefined,
    options: { requireReviewsList?: boolean } = {},
): QualifiedRatingSummary {
    if (!property) {
        return { showRating: false, rating: 0, reviewCount: 0, approvedReviews: [] };
    }

    const approvedReviews = getApprovedReviews(property.reviews_list);

    if (approvedReviews.length > 0) {
        const avg = approvedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / approvedReviews.length;
        const count = approvedReviews.length;
        return {
            showRating: count >= MIN_REVIEWS_FOR_RATING && avg > 0,
            rating: Number(avg.toFixed(1)),
            reviewCount: count,
            approvedReviews,
        };
    }

    if (options.requireReviewsList) {
        return { showRating: false, rating: 0, reviewCount: 0, approvedReviews: [] };
    }

    const count = Number(property.review_count ?? property.reviews ?? 0) || 0;
    const avg = Number(property.average_rating ?? property.rating ?? 0) || 0;

    return {
        showRating: count >= MIN_REVIEWS_FOR_RATING && avg > 0,
        rating: avg,
        reviewCount: count,
        approvedReviews: [],
    };
}
