/**
 * Single source of truth for brand positioning (SEO, AEO, Organization/LocalBusiness copy, FAQs).
 */

export const BRAND_ONE_LINER =
    'MakeMyStay.ai is a Bangalore-focused real estate and rental platform helping users find verified PGs, flats, and coliving spaces.';

export const BRAND_EXTENDED = `${BRAND_ONE_LINER} Listings use real photos and transparent pricing with zero brokerage for tenants on supported listings — schedule a visit in minutes.`;

/** Social profile URLs (clean URLs without tracking parameters). */
export const BRAND_SOCIAL_URLS = {
    facebook: 'https://www.facebook.com/profile.php?id=61569413385115',
    instagram: 'https://www.instagram.com/makemystay_realty',
    linkedin: 'https://www.linkedin.com/company/makemystay-realty/',
    x: 'https://x.com/Makemystay16268',
} as const;

export const BRAND_SAME_AS: string[] = [
    BRAND_SOCIAL_URLS.instagram,
    BRAND_SOCIAL_URLS.linkedin,
    BRAND_SOCIAL_URLS.facebook,
    BRAND_SOCIAL_URLS.x,
];

export const BRAND_CONTACT = {
    email: 'connect@makemystay.ai',
    telephone: '+918150099911',
} as const;

export interface GrievanceContact {
    label: string;
    href: string;
}

/**
 * Optional grievance-contact link for the footer bottom bar.
 * Set to a non-null entry once official grievance officer details are approved.
 */
export const BRAND_GRIEVANCE: GrievanceContact | null = null;

export interface BrandFaqItem {
    question: string;
    answer: string;
}

export const BRAND_FAQ_ITEMS: BrandFaqItem[] = [
    {
        question: 'What is MakeMyStay.ai?',
        answer: BRAND_ONE_LINER,
    },
    {
        question: 'Is MakeMyStay.ai zero brokerage?',
        answer:
            'MakeMyStay.ai offers zero brokerage for tenants on supported listings. Brokerage and fee terms can vary by property — check the listing page and agreement before you pay any token or deposit.',
    },
    {
        question: 'Which areas does MakeMyStay serve?',
        answer:
            'We focus on Bangalore with verified PG, flat, and coliving inventory across major corridors including HSR Layout, Koramangala, Whitefield, Electronic City, Bellandur, Marathahalli, BTM, Indiranagar, Sarjapur Road, and more. Hyderabad and Pune hubs are available where listings are live.',
    },
    {
        question: 'Are listings on MakeMyStay verified?',
        answer:
            'Listings go through baseline checks for photo consistency, availability, and owner or operator identity before going live, with last-verified dates displayed when verified. Always confirm details on a site visit before paying deposits.',
    },
    {
        question: 'Do you list PGs and flats?',
        answer:
            'Yes. You can browse verified PGs, 1BHK and 2BHK flats for rent, coliving spaces, and other residential categories on MakeMyStay.ai with filters for budget, location, and amenities.',
    },
];
