import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';
import { parseInrOfferAmount, stripMarkdownLight } from '@/lib/propertySeoUtils';
import { buildPropertyProductName } from '@/lib/propertyDetailCopy';

export interface FaqItem {
    question: string;
    answer: string;
}

/** FAQPage JSON-LD for rich results + AEO. */
export function buildFaqPageSchema(faqs: FaqItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    };
}

/** Local business / agent snippet for area pages. */
export function buildRealEstateAgentSchema(areaName: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: SITE_NAME,
        url: SITE_URL,
        areaServed: {
            '@type': 'Place',
            name: `${areaName}, Bangalore, India`,
        },
        priceRange: '₹6000–₹18000',
    };
}

/** BreadcrumbList for PG location pages. */
export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            item: `${SITE_URL}${it.path.startsWith('/') ? it.path : `/${it.path}`}`,
        })),
    };
}

/** WebSite + SearchAction for homepage rich results. */
export function buildWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/properties?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

/** Strip @context so nodes can live under a single @graph (recommended for rich results). */
function schemaNodeWithoutContext(schema: Record<string, unknown>) {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

/**
 * Single JSON-LD script: FAQPage + BreadcrumbList + RealEstateAgent (AEO + hierarchy).
 */
export function buildPgLocationCombinedGraph(
    faqs: FaqItem[],
    breadcrumbItems: { name: string; path: string }[],
    areaName: string
) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            schemaNodeWithoutContext(buildFaqPageSchema(faqs) as Record<string, unknown>),
            schemaNodeWithoutContext(buildBreadcrumbSchema(breadcrumbItems) as Record<string, unknown>),
            schemaNodeWithoutContext(buildRealEstateAgentSchema(areaName) as Record<string, unknown>),
        ],
    };
}

export function stringifySchema(data: unknown): string {
    return JSON.stringify(data);
}

function absoluteImageUrl(url: string | undefined): string | undefined {
    if (!url || !url.trim()) return undefined;
    const u = url.trim();
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `${SITE_URL}${u}`;
    return `${SITE_URL}/${u}`;
}

/**
 * Product + Offer + BreadcrumbList for property detail pages (long-tail + rich results).
 */
export function buildPropertyDetailGraph(property: Property, detailPath: string) {
    const path = detailPath.startsWith('/') ? detailPath : `/${detailPath}`;
    const url = `${SITE_URL}${path}`;
    const desc = stripMarkdownLight(property.description || '').slice(0, 5000);
    const images: string[] = [];
    if (Array.isArray(property.images)) {
        for (const img of property.images) {
            const raw = typeof img === 'string' ? img : (img as { image_url?: string })?.image_url;
            const abs = absoluteImageUrl(raw);
            if (abs) images.push(abs);
        }
    }
    const primary = absoluteImageUrl(property.image);
    if (primary && !images.includes(primary)) images.unshift(primary);
    // Offer omitted when price is not parseable (e.g. "Price on Request") — expected.
    const priceAmount = parseInrOfferAmount(property.price);
    const availability = property.is_available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock';
    const productName = buildPropertyProductName(property);

    const product: Record<string, unknown> = {
        '@type': 'Product',
        name: productName,
        description: desc || `${productName} — ${property.type} in ${property.location}`,
        sku: String(property.id),
        brand: { '@type': 'Brand', name: SITE_NAME },
        url,
    };
    if (images.length > 0) product.image = images.length === 1 ? images[0] : images;

    if (priceAmount !== undefined) {
        product.offers = {
            '@type': 'Offer',
            url,
            priceCurrency: 'INR',
            price: priceAmount,
            priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            availability,
        };
    }

    if (property.average_rating != null && (property.review_count ?? property.reviews)) {
        product.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: property.average_rating,
            reviewCount: property.review_count ?? property.reviews ?? 0,
        };
    }

    const crumbs = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Listings', path: '/properties' },
        { name: productName.slice(0, 80), path },
    ]);

    return {
        '@context': 'https://schema.org',
        '@graph': [
            schemaNodeWithoutContext(product),
            schemaNodeWithoutContext(crumbs as Record<string, unknown>),
        ],
    };
}
