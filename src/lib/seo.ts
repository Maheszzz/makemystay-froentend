import { buildPropertyOgImageUrl } from '@/lib/ogImage';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';

export interface PageSEOInput {
    title: string;
    description: string;
    path?: string;
    /** Override full canonical URL */
    canonicalUrl?: string;
    ogImage?: string;
    noindex?: boolean;
    /** Comma-separated keywords for legacy crawlers / internal tools */
    keywords?: string;
}

export interface HelmetSEOProps {
    title: string;
    description: string;
    canonicalHref: string;
    ogImage?: string;
    noindex?: boolean;
    keywords?: string;
}

/**
 * Build absolute canonical path (leading slash, no trailing slash except root).
 */
export function canonicalPath(path: string): string {
    if (!path || path === '/') return '/';
    const p = path.startsWith('/') ? path : `/${path}`;
    return p.replace(/\/+$/, '') || '/';
}

export function absoluteUrl(path: string): string {
    const p = canonicalPath(path);
    if (p === '/') return SITE_URL;
    return `${SITE_URL}${p}`;
}

/**
 * Values for react-helmet-async (title, meta, link).
 */
export function buildPageSEO(input: PageSEOInput): HelmetSEOProps {
    const canonicalHref = input.canonicalUrl ?? absoluteUrl(input.path ?? '/');
    const suffix = 'makemystay.ai';
    const title = input.title.includes(suffix) ? input.title : `${input.title} | ${suffix}`;
    return {
        title: title.slice(0, 60), // Keep it within display limits (approx 60 chars)
        description: input.description.slice(0, 155), // Max 155 chars for description
        canonicalHref,
        ogImage: input.ogImage ?? DEFAULT_OG_IMAGE,
        noindex: input.noindex,
        keywords: input.keywords,
    };
}

/** Query keys allowed on `/pg/:slug` (listing UI + programmatic filters). */
const PG_LISTING_QUERY_KEYS = new Set([
    'cat',
    'city',
    'type',
    'min',
    'max',
    'sort',
    'q',
    'wifi',
    'food',
    'ac',
    'price',
    'gender',
    'page',
]);

export function pgListingQueryIsClean(searchParams: URLSearchParams): boolean {
    for (const k of searchParams.keys()) {
        if (!PG_LISTING_QUERY_KEYS.has(k)) return false;
        if (k === 'page' && !isValidListingPageParam(searchParams.get('page'))) return false;
    }
    return true;
}

/** Stable path for canonical + sharing (sorted keys). */
export function stablePgListingCanonical(slug: string, searchParams: URLSearchParams): string {
    const keys = [...searchParams.keys()].filter((k) => PG_LISTING_QUERY_KEYS.has(k)).sort();
    if (keys.length === 0) return `/pg/${slug}`;
    const q = new URLSearchParams();
    for (const k of keys) {
        const v = searchParams.get(k);
        if (v !== null && v !== '') q.set(k, v);
    }
    return `/pg/${slug}?${q.toString()}`;
}

/**
 * PG locality SEO with optional filter query (wifi / food / AC / price tier).
 * Unknown query keys → noindex to avoid soft-404 / spam patterns.
 */
export function pgLocationSeoWithQuery(
    locationName: string,
    slug: string,
    searchParams: URLSearchParams
): PageSEOInput {
    const path = stablePgListingCanonical(slug, searchParams);
    const wifi = searchParams.get('wifi') === 'true';
    const food = searchParams.get('food') === 'true';
    const ac = searchParams.get('ac') === 'true';
    const genderRaw = searchParams.get('gender');
    const gender = genderRaw?.trim().toLowerCase();
    
    // Primary title structure for Locality pages: 50-60 chars limit
    let title = `PG in ${locationName} | Best Coliving`;
    if (wifi || food || ac) {
        title = `Furnished PG in ${locationName}`;
    }

    const tags: string[] = [];
    if (gender === 'male' || gender === 'female') {
        tags.push(gender === 'male' ? 'Boys PG' : 'Girls PG');
    }
    if (tags.length) {
        title = `${tags[0]} in ${locationName}`;
    }

    const description = `Find verified PGs, co-living spaces, rental homes, 1 BHK, 2 BHK and furnished apartments in ${locationName}, Bangalore with makemystay.ai.`;

    return {
        title,
        description,
        path,
    };
}

export function pgLocationSeo(locationName: string, slug: string): PageSEOInput {
    return pgLocationSeoWithQuery(locationName, slug, new URLSearchParams());
}

/** SEO for `/rent/:slug` locality hub (flats & houses on rent). */
export function rentLocationHubSeo(locationName: string, slug: string): PageSEOInput {
    return {
        title: `1 BHK for Rent in ${locationName}`,
        description: `Find verified 1 BHK, 2 BHK, and rental homes in ${locationName}, Bangalore. Zero brokerage, real photos, and transparent pricing on makemystay.ai.`.slice(0, 155),
        path: `/rent/${slug}`,
    };
}

/** Long-tail: `/pg-for-boys-in-:slug` and `/pg-for-girls-in-:slug` (and men/women aliases). */
export function pgGenderLocalitySeo(
    locationName: string,
    slug: string,
    variant: 'male' | 'female' | 'men' | 'women'
): PageSEOInput {
    const isMale = variant === 'male' || variant === 'men';
    const pathPrefix = isMale ? 'pg-for-boys-in' : 'pg-for-girls-in';
    const label = isMale ? 'Boys PG' : 'Girls PG';
    return {
        title: `${label} in ${locationName} | Coliving`,
        description: `Find safe, verified ${label.toLowerCase()} in ${locationName}, Bangalore with WiFi, meals, and security. Zero brokerage on makemystay.ai.`,
        path: `/${pathPrefix}-${slug}`,
    };
}


function normalizeLocationForSeo(location: string | undefined): string {
    const raw = (location || '').replace(/\s+/g, ' ').trim();
    if (!raw) return 'Bangalore';
    return /bangalore/i.test(raw) ? raw : `${raw}, Bangalore`;
}

function buildPropertyMetaTitle(property: Property): string {
    const location = property.location ? property.location.split(',')[0].trim() : 'Bangalore';
    const typeLower = (property.type || '').toLowerCase();
    const isPgType = ['pg', 'hostel', 'coliving'].some(t => typeLower.includes(t));
    const isPG = property.category === 'pg' || isPgType;
    const bhk = property.type || '1BHK';
    const name = formatPropertyTitle(property.title) || property.title || 'Property';

    if (isPG) {
        return `${name} - PG in ${location} | Furnished`.slice(0, 60);
    }

    const rentPrefix = bhk.toLowerCase().includes('bhk') || bhk.toLowerCase().includes('rk') 
        ? bhk 
        : 'Flat';
    return `${name} - ${rentPrefix} for Rent in ${location}`.slice(0, 60);
}

function buildPropertyMetaDescription(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title || 'This property';
    const type = (property.type || 'property').trim();
    const location = normalizeLocationForSeo(property.location);
    const price = (property.price || '').trim();
    const hasPrice = Boolean(price) && !/request|negotiable/i.test(price);

    const priceText = hasPrice ? ` starting from ${price}/month` : '';
    return `Explore ${name}, a verified ${type} for rent in ${location}${priceText}. View photos and book online with makemystay.ai.`.slice(0, 155);
}

/** Meta + canonical for detail pages (handled via /pg/ or /rent/ routers). */
export function propertyDetailPageSeo(property: Property, detailPath: string): PageSEOInput {
    const path = detailPath; // Use the verified path from getPropertyDetailPath
    const description = buildPropertyMetaDescription(property);
    const keywords = [
        formatPropertyTitle(property.title),
        property.type,
        property.location,
        normalizeLocationForSeo(property.location),
        'Bangalore rent',
        'PG coliving',
        'property visit booking',
        'verified property listing',
        'makemystay.ai',
    ]
        .filter(Boolean)
        .join(', ');
    return {
        title: buildPropertyMetaTitle(property),
        description,
        path,
        ogImage: buildPropertyOgImageUrl(property),
        keywords,
    };
}

/** City hub: `/pg/bangalore` — primary “PG in Bangalore” landing. */
export function pgBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'PG in Bangalore from ₹6K | Verified Stays',
        description:
            'Browse verified PGs in Bangalore from ₹6,000/mo. Zero brokerage, real photos, and transparent pricing. Book your stay on MakeMyStay.ai today.',
        path: '/pg/bangalore',
        canonicalUrl: 'https://makemystay.ai/pg/bangalore',
    };
}

/** City hub: `/rent/bangalore` — primary “flats & houses for rent in Bangalore” landing. */
export function rentBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Flats & Houses for Rent in Bangalore | Zero Brokerage',
        description:
            'Browse verified flats and houses for rent in Bangalore with zero brokerage. Compare rent across Koramangala, Whitefield, Bellandur & more.',
        path: '/rent/bangalore',
    };
}

/** City hub: `/buy/in/bangalore` — primary “buy in Bangalore” landing. */
export function buyBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Buy Property in Bangalore | Verified Flats & Homes',
        description:
            'Explore verified apartments, 2BHK/3BHK flats, and homes for sale in Bangalore. Compare prices and shortlist with zero broker bias.',
        path: '/buy/in/bangalore',
    };
}

/** City hub: `/plots/in/bangalore` — primary “plots in Bangalore” landing. */
export function plotBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Plots & Land for Sale in Bangalore | Verified Listings',
        description:
            'Browse verified residential plots and land parcels in Bangalore. Compare sizes, locations, and pricing with transparent listings.',
        path: '/plots/in/bangalore',
    };
}

const PG_FEATURE_PATHS: Record<string, 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single'> = {
    '/pg-with-wifi': 'wifi',
    '/pg-with-food': 'food',
    '/pg-with-ac': 'ac',
    '/pg-for-girls': 'girls',
    '/pg-for-boys': 'boys',
    '/pg-single-room': 'single',
};

export function pgFeaturePathToKind(pathname: string): 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single' | undefined {
    return PG_FEATURE_PATHS[pathname];
}

export function pgFeatureLandingSeo(feature: 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single'): PageSEOInput {
    const titles = {
        wifi: 'PG with WiFi in Bangalore | Verified Stays',
        food: 'PG with Food in Bangalore | Verified Meals',
        ac: 'PG with AC in Bangalore | Verified AC Rooms',
        girls: 'Girls PG in Bangalore | Verified & Safe',
        boys: 'Boys PG in Bangalore | Verified Coliving',
        single: 'Single Room PG in Bangalore | Private Rooms',
    };
    const desc = {
        wifi: 'Looking for PG with reliable WiFi in Bangalore? Explore verified paying guest stays with transparent pricing and book online.',
        food: 'Find PG with meals in Bangalore. Compare verified listings and enquire on MakeMyStay.ai today.',
        ac: 'Discover air-conditioned PG rooms in Bangalore. Verified listings with clear amenities — compare rent and book a visit.',
        girls: 'Find safe, verified ladies PG in Bangalore. CCTV, security, and meal inclusive stays for students and working women.',
        boys: 'Search for boys PG in Bangalore. Managed stays with WiFi, food, and housekeeping for early career tech professionals.',
        single: 'Browse private single occupancy PG rooms in Bangalore. No roommate stress — premium verified coliving options.',
    };
    const paths = {
        wifi: '/pg-with-wifi',
        food: '/pg-with-food',
        ac: '/pg-with-ac',
        girls: '/pg-for-girls',
        boys: '/pg-for-boys',
        single: '/pg-single-room',
    };
    return {
        title: titles[feature],
        description: desc[feature],
        path: paths[feature],
    };
}

/** Comparison guide `/pg-vs-flat-bangalore`. */
export function pgVsFlatBangaloreSeo(): PageSEOInput {
    return {
        title: 'PG vs Flat in Bangalore: Which is Better? (2026)',
        description:
            'Compare PG and rented flats in Bangalore — deposits, meals, independence. Plus FAQs for students and working professionals.',
        path: '/pg-vs-flat-bangalore',
    };
}

/** Homepage title/description for high-conversion SEO (SEO audit Appendix A). */
export function buildHomeSEO(): PageSEOInput {
    return {
        title: 'PG in Bangalore | Coliving, Rental Homes, 1 BHK & 2 BHK',
        description:
            'Find verified PGs, co-living spaces, rental homes, 1 BHK, 2 BHK and furnished apartments in Bangalore with makemystay.ai.',
        path: '/',
    };
}

/** `/about` — trust & E-E-A-T (audit). */
export function buildAboutPageSEO(): PageSEOInput {
    return {
        title: 'About MakeMyStay | Verified Rentals & PG in Bangalore',
        description:
            'MakeMyStay.ai helps you find verified PGs and rentals in Bangalore without brokers. Learn about our mission and how we verify listings.',
        path: '/about',
    };
}

/** `/how-we-verify` — verification story (audit). */
export function buildHowWeVerifyPageSEO(): PageSEOInput {
    return {
        title: 'How MakeMyStay Verifies Properties | Trust & Safety',
        description:
            'Our verification process — photo audit, on-site checks, ID and rent benchmarking — so you can shortlist PGs with confidence.',
        path: '/how-we-verify',
    };
}

/** `/contact-us` */
export function buildContactPageSEO(): PageSEOInput {
    return {
        title: 'Contact MakeMyStay | PG & Rental Support Bangalore',
        description:
            'Reach MakeMyStay at +91 81500 99911 or connect@makemystay.ai for PG enquiries and operator onboarding. Office: HSR Layout.',
        path: '/contact-us',
    };
}

/** `/blog` index */
export function buildBlogIndexSEO(postCount = 0): PageSEOInput {
    const countBit = postCount > 0 ? `${postCount}+ ` : '';
    return {
        title: 'Guides & Insights — PG & Rent in Bangalore (2026)',
        description: `${countBit}expert guides on PG in Bangalore, area-wise rent, legal checklists, and verified rentals — updated for 2026.`,
        path: '/blog',
    };
}

/** `/pg-near-me` */
export function buildPgNearMeSEO(): PageSEOInput {
    return {
        title: 'PG Near Me in Bangalore | Top-Rated Verified Stays',
        description:
            'Searching for PG near me? Find verified paying guest accommodations in Bangalore with WiFi, meals, and 24/7 security.',
        path: '/pg-near-me',
    };
}

export function buildFlatsInBangaloreSEO(): PageSEOInput {
    return {
        title: 'Flats for Rent in Bangalore | 1BHK & 2BHK',
        description:
            'Browse verified flats for rent in Bangalore. Real photos, transparent rent, zero brokerage on MakeMyStay.ai.',
        path: '/flats-in-bangalore',
    };
}

export function build1BhkSEO(): PageSEOInput {
    return {
        title: '1BHK for Rent in Bangalore | Verified Flats',
        description:
            'Find verified 1BHK flats for rent in Bangalore with real photos and transparent pricing. Compare localities and book a visit.',
        path: '/1-bhk',
    };
}

export function build2BhkSEO(): PageSEOInput {
    return {
        title: '2BHK for Rent in Bangalore | Verified Family Homes',
        description:
            'Browse verified 2BHK flats and homes for rent in Bangalore. Zero brokerage on many listings — compare rent across localities.',
        path: '/2bhk',
    };
}

export function buildPrivacyPageSEO(): PageSEOInput {
    return {
        title: 'Privacy Policy',
        description: 'How MakeMyStay Realty collects, uses, and protects your personal information on makemystay.ai.',
        path: '/privacy',
    };
}

export function buildTermsPageSEO(): PageSEOInput {
    return {
        title: 'Terms and Conditions',
        description: 'Terms governing use of makemystay.ai and MakeMyStay Realty rental services in Bangalore.',
        path: '/terms',
    };
}

export function buildRefundPolicyPageSEO(): PageSEOInput {
    return {
        title: 'Refund & Cancellation Policy',
        description: 'Refund and cancellation terms for payments made on makemystay.ai operated by MakeMyStay Realty.',
        path: '/refund-policy',
    };
}

/** Thin / utility routes — do not index. */
export function buildNoindexUtilitySEO(title: string, path: string): PageSEOInput {
    return { title, description: `${SITE_NAME} — ${title}`, path, noindex: true };
}

/** Meta for `/faq` (Help Center). */
export function buildFaqPageSEO(): PageSEOInput {
    return {
        title: 'FAQ — PG, rentals, buying & plots',
        description:
            'Answers about MakeMyStay: PG and rental bookings, documents, deposits, payments, refunds, legal terms, and listing your property in Bangalore.',
        path: '/faq',
    };
}

export function buildResearchPageSEO(): PageSEOInput {
    return {
        title: 'Bangalore PG research, rent index & coliving insights',
        description:
            'MakeMyStay.ai research on Bangalore PG rent, coliving demand, locality trends, tech park corridors, and tenant search behaviour.',
        path: '/research',
    };
}

export function buildReportsPageSEO(): PageSEOInput {
    return {
        title: 'Bangalore PG Rent Index — monthly reports',
        description:
            'Monthly MakeMyStay.ai reports tracking average PG rent, demand corridors, coliving trends, and Bangalore locality-level rental signals.',
        path: '/reports',
    };
}

export function buildStatisticsPageSEO(): PageSEOInput {
    return {
        title: 'Bangalore PG statistics by locality',
        description:
            'Structured Bangalore PG statistics: average rent bands, demand signals, nearby drivers, and audience segments by locality.',
        path: '/statistics',
    };
}

/** Readable phrase from `/pg/:slug` param (strips leading numeric id if present). */
export function humanizePropertySlugParam(slugParam: string | undefined): string {
    if (!slugParam?.trim()) return 'Listing';
    const s = slugParam.trim();
    const rest = /^\d+-(.+)$/.test(s) ? s.replace(/^\d+-/, '') : s;
    if (!rest) return 'Listing';
    return rest
        .split('-')
        .filter(Boolean)
        .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

/** Loading state on property PDP so the document does not keep the shell title. */
export function interimPropertyDetailSeo(slugParam: string | undefined, pathname: string): PageSEOInput {
    const label = humanizePropertySlugParam(slugParam);
    return {
        title: `${label} — property listing`,
        description: `Photos, rent, amenities, and visit booking for this listing in Bangalore on ${SITE_NAME}.`,
        path: canonicalPath(pathname.split('?')[0]),
    };
}

/** Error / not-found PDP: noindex and distinct title from live listings. */
export function propertyErrorSeo(pathname: string): PageSEOInput {
    return {
        title: 'Property not found',
        description: `This listing may have moved or been removed. Browse verified PG and rentals on ${SITE_NAME}.`,
        path: canonicalPath(pathname.split('?')[0]),
        noindex: true,
    };
}

/** Removed or fully booked listing — keep URL, noindex, suggest nearby hubs. */
export function propertyUnavailableSeo(pathname: string, localityLabel?: string): PageSEOInput {
    const area = localityLabel?.trim() ? ` in ${localityLabel}` : '';
    return {
        title: 'Property no longer available',
        description: `This listing${area} is no longer available on ${SITE_NAME}. Explore similar PG and coliving stays nearby.`,
        path: canonicalPath(pathname.split('?')[0]),
        noindex: true,
    };
}

export interface ListingsPageSeoInput {
    pathname: string;
    pageTitle: string;
    pageSubtitle: string;
    category: 'all' | 'pg' | 'rent' | 'buy' | 'plot';
    /** `locationFilter` from listings UI (`all` or city name). */
    cityLabel: string;
    totalCount?: number;
    /** Crawlable pagination (1-based). Page 1 omitted from canonical. */
    listingPage?: number;
    noindex?: boolean;
}

/** Listings index routes (`/pg`, `/rent`, `/properties`, …) + optional `?page=` crawl depth. */
export function isValidListingPageParam(raw: string | null | undefined): boolean {
    if (raw === null || raw === undefined || raw === '') return true;
    if (!/^\d+$/.test(raw.trim())) return false;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 && n <= 100;
}

export function listingsPageSeo(input: ListingsPageSeoInput): PageSEOInput {
    const pathOnly = canonicalPath(input.pathname.split('?')[0]);
    const city = input.cityLabel === 'all' ? 'Bangalore' : input.cityLabel;
    const n = input.totalCount;
    const countBit = typeof n === 'number' && n > 0 ? `${n.toLocaleString()} ` : '';
    const categoryPhrase =
        input.category === 'all'
            ? 'PG, rent & sale'
            : input.category === 'pg'
              ? 'PG'
              : input.category === 'rent'
                ? 'rental'
                : input.category === 'buy'
                  ? 'sale'
                  : 'plot & land';
    const lp = input.listingPage && input.listingPage > 1 ? input.listingPage : undefined;
    const titleBase = `${input.pageTitle} — ${city}`;
    const title = lp ? `${titleBase} — Page ${lp}` : titleBase;
    const description = `${input.pageSubtitle} Explore ${countBit}verified ${categoryPhrase} listings in ${city}. Transparent pricing and expert support on ${SITE_NAME}.`;
    const path = lp ? `${pathOnly}?page=${lp}` : pathOnly;
    return {
        title,
        description,
        path,
        noindex: input.noindex,
    };
}
