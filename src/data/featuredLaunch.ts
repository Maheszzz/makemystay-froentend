/**
 * Homepage "new launch" spotlight — Urban Homes (HSR Layout).
 * Matched by id/slug/title from API; fetched by id if not in the current list.
 */
export const FEATURED_LAUNCH = {
    propertyId: 298,
    listingType: 'rent' as const,
    slug: 'ekta-homes-1-1bhk-chikkakannalli',
    titleIncludes: 'ekta homes',
    locationIncludes: 'chikkakannalli',
    badge: 'New launch',
    headlineLead: 'Ekta Homes, Designed for',
    headlineAccent: 'You.',
    subheadline: 'Premium 1BHK,2BHK & 1RK in Chikkakannalli — now on MakeMyStay.',
    bullets: ['Move-in ready', 'Verified listing', 'Zero brokerage'] as const,
    priceFromLabel: 'From ₹20,000 - 30,000 /mo ',
    socialProof: {
        label: 'Happy Tenants',
        rating: 5,
        reviewCount: 320,
    },
} as const;
