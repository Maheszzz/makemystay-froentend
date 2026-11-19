/**
 * Single source of truth for brand positioning (SEO, AEO, Organization/LocalBusiness copy, FAQs, optional entity configs).
 */

export const BRAND_ONE_LINER =
    'MakeMyStay.ai is a Bangalore-first rental and property platform helping you find verified PGs, flats, and coliving spaces.';

export const BRAND_EXTENDED = `${BRAND_ONE_LINER} Listings use real photos and transparent pricing, with zero brokerage for tenants on supported listings — book a visit in minutes.`;

/** Social profile URLs (clean URLs without tracking parameters; keep in sync with Footer). */
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

/**
 * Grievance contact config for the footer.
 * Keep null until official grievance officer details are supplied; Footer hides the link when null.
 */
export const BRAND_GRIEVANCE_CONTACT: { label: string; href: string } | null = null;

/**
 * Founder profile config for /about.
 * Keep photoPath, quote, and linkedinUrl null until approved assets/copy are supplied.
 */
export const FOUNDER_PROFILE: {
    name: string;
    role: string;
    bio: string;
    photoPath: string | null;
    quote: string | null;
    linkedinUrl: string | null;
} = {
    name: 'Madhava R',
    role: 'Founder, MakeMyStay',
    bio: 'Madhava founded MakeMyStay to replace scattered listing information and broker follow-ups with clear pricing, real property photos, and direct visit scheduling.',
    photoPath: null,
    quote: null,
    linkedinUrl: null,
};

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
            'MakeMyStay.ai offers zero brokerage for tenants on supported listings. Fees and deposit terms can vary by property — always check the listing page and rental agreement before paying any token.',
    },
    {
        question: 'Which areas does MakeMyStay serve?',
        answer:
            'We focus on Bangalore across major corridors including HSR Layout, Koramangala, Whitefield, Electronic City, Bellandur, Marathahalli, BTM Layout, Indiranagar, and Sarjapur Road.',
    },
    {
        question: 'How does MakeMyStay verify listings?',
        answer:
            'Listings go through baseline checks for photo consistency, operator identity on file, and rent or price sanity before going live. Always confirm details during a site visit before paying deposits.',
    },
    {
        question: 'Do you list PGs and flats?',
        answer:
            'Yes. You can browse PGs, 1BHK and 2BHK flats for rent, homes to buy, and plots on MakeMyStay.ai with filters for budget, area, and amenities.',
    },
];
