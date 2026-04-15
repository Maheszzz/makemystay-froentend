import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { stripMarkdownLight } from '@/lib/propertySeoUtils';
import { trimMetaTitle } from '@/lib/propertyDetailCopy';
import { buildClientSeoAbout } from '@/lib/propertyClientSeoNarrative';

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
    const title = input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`;
    return {
        title,
        description: input.description,
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
]);

export function pgListingQueryIsClean(searchParams: URLSearchParams): boolean {
    for (const k of searchParams.keys()) {
        if (!PG_LISTING_QUERY_KEYS.has(k)) return false;
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
    const dirty = !pgListingQueryIsClean(searchParams);
    const wifi = searchParams.get('wifi') === 'true';
    const food = searchParams.get('food') === 'true';
    const ac = searchParams.get('ac') === 'true';
    const price = searchParams.get('price');

    let title = `Best PG in ${locationName} (₹6k–₹18k) | WiFi, food & security`;
    const tags: string[] = [];
    if (wifi) tags.push('WiFi PGs');
    if (food) tags.push('food included');
    if (ac) tags.push('AC rooms');
    if (price === 'low') tags.push('budget-friendly');
    if (price === 'mid') tags.push('mid-range');
    if (price === 'high') tags.push('premium');
    if (tags.length) {
        title = `PG in ${locationName}: ${tags.join(' · ')} | Verified stays ₹6k–₹18k`;
    }

    let description = `Find verified PG in ${locationName}, Bangalore — compare rent (₹6,000–₹18,000/mo), meals, WiFi & safety. Listings on ${SITE_NAME}.`;
    if (tags.length) {
        description = `PG in ${locationName} — ${tags.join(', ')}. Browse verified listings with transparent pricing; book visits or pay tokens online where enabled.`;
    }

    return {
        title,
        description,
        path,
        noindex: dirty,
    };
}

export function pgLocationSeo(locationName: string, slug: string): PageSEOInput {
    return pgLocationSeoWithQuery(locationName, slug, new URLSearchParams());
}

function ogImageFromProperty(property: Property): string | undefined {
    let raw: string | undefined = property.image;
    if (Array.isArray(property.images) && property.images.length > 0) {
        const first = property.images[0];
        raw = typeof first === 'string' ? first : undefined;
    }
    if (!raw?.trim()) return undefined;
    const u = raw.trim();
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return absoluteUrl(u.startsWith('/') ? u : `/${u}`);
}

function normalizeLocationForSeo(location: string | undefined): string {
    const raw = (location || '').replace(/\s+/g, ' ').trim();
    if (!raw) return 'Bangalore';
    return /bangalore/i.test(raw) ? raw : `${raw}, Bangalore`;
}

function buildPropertyMetaTitle(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title || 'Property';
    const type = (property.type || 'Property').trim();
    const location = normalizeLocationForSeo(property.location);
    const isRent = property.category === 'rent';
    const price = (property.price || '').trim();
    const hasPrice = Boolean(price) && !/request|negotiable/i.test(price);

    const base = `${name} ${type} in ${location}`.replace(/\s+/g, ' ').trim();

    if (isRent && hasPrice) {
        return trimMetaTitle(`${base} (${price}/month) | Rent, Photos & Visit Booking`, 68);
    }

    if (isRent) {
        return trimMetaTitle(`${base} | Rent, Photos & Visit Booking`, 68);
    }

    return trimMetaTitle(`${base} | Photos, Details & Site Visit`, 68);
}

function buildPropertyMetaDescription(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title || 'This property';
    const type = (property.type || 'property').trim();
    const location = normalizeLocationForSeo(property.location);
    const isRent = property.category === 'rent';
    const price = (property.price || '').trim();
    const hasPrice = Boolean(price) && !/request|negotiable/i.test(price);

    const amenityBits = [
        property.wifi ? 'WiFi' : '',
        property.food ? 'food' : '',
        property.housekeeping ? 'housekeeping' : '',
        property.power_backup ? 'power backup' : '',
    ].filter(Boolean);
    const amenityText = amenityBits.length > 0 ? ` Explore ${amenityBits.slice(0, 3).join(', ')}, amenities,` : ' Explore amenities,';

    if (isRent && hasPrice) {
        return `${name} offers a ${type} for rent in ${location} from ${price}/month. View photos, location highlights,${amenityText} and book a visit online with ${SITE_NAME}.`;
    }

    if (isRent) {
        return `${name} offers a ${type} for rent in ${location}. View photos, location highlights,${amenityText} and book a visit online with ${SITE_NAME}.`;
    }

    return `Explore ${name}, a ${type} in ${location}. View photos, locality details, amenities, pricing guidance, and schedule a site visit with ${SITE_NAME}.`;
}

/** Meta + canonical for `/properties/:slug` detail pages. */
export function propertyDetailPageSeo(property: Property, detailPath: string): PageSEOInput {
    // Canonical should prioritize /pg/ authority route
    const path = detailPath.startsWith('/pg/') ? detailPath : `/pg${detailPath.startsWith('/') ? detailPath : `/${detailPath}`}`.replace('/properties/', '/pg/');
    const longPlain = stripMarkdownLight(
        property.seo_about || buildClientSeoAbout(property) || property.description || ''
    )
        .replace(/\s+/g, ' ')
        .trim();
    const description = buildPropertyMetaDescription(property) || longPlain.slice(0, 160);
    const keywords = [
        formatPropertyTitle(property.title),
        property.type,
        property.location,
        normalizeLocationForSeo(property.location),
        'Bangalore rent',
        'PG coliving',
        'property visit booking',
        'verified property listing',
        SITE_NAME,
    ]
        .filter(Boolean)
        .join(', ');
    return {
        title: buildPropertyMetaTitle(property),
        description,
        path,
        ogImage: ogImageFromProperty(property) ?? DEFAULT_OG_IMAGE,
        keywords,
    };
}

/** City hub: `/pg/bangalore` — primary “PG in Bangalore” landing. */
export function pgBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Best PG in Bangalore (₹6k–₹15k) | verified & affordable coliving',
        description:
            'Find the best PG in Bangalore with WiFi, meals, and 24/7 security. Browse verified listings by location (Whitefield, BTM, Marathahalli), compare rent starting from ₹6000, and book directly.',
        path: '/pg/bangalore',
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
        wifi: 'PG with WiFi in Bangalore | High-speed internet — verified listings',
        food: 'PG with food in Bangalore | Meals included — verified PG stays',
        ac: 'PG with AC in Bangalore | Cool rooms — verified listings',
        girls: 'Girls PG in Bangalore | Safe & verified female accommodations',
        boys: 'Boys PG in Bangalore | Affordable male coliving & PG stays',
        single: 'Single Room PG in Bangalore | Private rooms with no sharing',
    };
    const desc = {
        wifi: 'Looking for PG with reliable WiFi in Bangalore? Explore verified paying guest stays with transparent pricing, filters for connectivity, and book online.',
        food: 'Find PG with meals in Bangalore — veg and non-veg plans vary by operator. Compare verified listings and enquire on MakeMyStay.ai.',
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
        title: 'PG vs flat in Bangalore: cost, flexibility & which is better (2026)',
        description:
            'Compare PG and rented flats in Bangalore — deposits, meals, independence, and who each option suits. Plus FAQs for students and working professionals.',
        path: '/pg-vs-flat-bangalore',
    };
}

/** Homepage title/description for high-conversion SEO. */
export function buildHomeSEO(): PageSEOInput {
    return {
        title: 'Best PG & verified rentals in Bangalore',
        description:
            'Find affordable PG and coliving spaces in Bangalore with WiFi, food, 24/7 security & premium amenities. Browse verified listings, compare rent, and book with MakeMyStay.ai.',
        path: '/',
    };
}
