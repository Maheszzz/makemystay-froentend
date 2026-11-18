/**
 * Homepage "new launch" spotlight — Urban Homes (HSR Layout).
 * Matched by id/slug/title from API; fetched by id if not in the current list.
 */
export const FEATURED_LAUNCH = {
    propertyId: 299,
    listingType: 'rent' as const,
    slug: 'ekta-infinity-apartments-2bhk-chikkakannalli',
    titleIncludes: 'ekta',
    locationIncludes: 'chikkakannalli',
    badge: 'New launch',
    headlineLead: 'Ekta – Infinity, Designed for',
    headlineAccent: 'You.',
    subheadline: 'Premium PG, Coliving & 1BHK in Bangalore — now on MakeMyStay.',
    bullets: ['Move-in ready', 'Verified listing', 'Zero brokerage'] as const,
    priceFromLabel: 'From ₹20,000 - 30,000 /mo ',
    socialProof: {
        label: 'Happy Tenants',
        rating: 5,
        reviewCount: 320,
    },
} as const;
