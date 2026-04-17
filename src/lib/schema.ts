import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';
import { findPgLocationForArea } from '@/data/pgLocations';
import { buildClientSeoAbout } from '@/lib/propertyClientSeoNarrative';
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

/** Organization — brand entity for homepage @graph. */
export function buildOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
    };
}

/** LocalBusiness — Bangalore service area (aligns with footer contact). */
export function buildLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        url: SITE_URL,
        image: DEFAULT_OG_IMAGE,
        telephone: '+91-81500-99911',
        email: 'connect@makemystay.ai',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'HSR Layout, Sector 4',
            addressLocality: 'Bengaluru',
            addressRegion: 'Karnataka',
            postalCode: '560102',
            addressCountry: 'IN',
        },
        areaServed: [
            { '@type': 'City', name: 'Bengaluru' },
            { '@type': 'City', name: 'Hyderabad' },
            { '@type': 'City', name: 'Pune' }
        ],
    };
}

/** Organization + WebSite + LocalBusiness in one graph for the homepage. */
export function buildHomeOrganizationLocalWebGraph() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            schemaNodeWithoutContext(buildOrganizationSchema() as Record<string, unknown>),
            schemaNodeWithoutContext(buildWebSiteSchema() as Record<string, unknown>),
            schemaNodeWithoutContext(buildLocalBusinessSchema() as Record<string, unknown>),
        ],
    };
}

/** Strip @context so nodes can live under a single @graph (recommended for rich results). */
function schemaNodeWithoutContext(schema: Record<string, unknown>) {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

/**
 * Single JSON-LD script: FAQPage + BreadcrumbList + RealEstateAgent (AEO + trust).
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
 * Optional locality FAQs (e.g. PG area guide) are merged into @graph when provided.
 */
export function buildPropertyDetailGraph(
    property: Property,
    detailPath: string,
    localityFaqs?: FaqItem[],
    pdpFaqs?: FaqItem[]
) {
    const path = detailPath.startsWith('/') ? detailPath : `/${detailPath}`;
    const url = `${SITE_URL}${path}`;
    const desc = stripMarkdownLight(
        property.seo_about || buildClientSeoAbout(property) || property.description || ''
    ).slice(0, 5000);
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
    if (property.type) {
        product.category = property.type;
    }
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

    const reviewsList = property.reviews_list?.filter((r) => r && (r.rating > 0 || r.comment?.trim()));
    if (reviewsList && reviewsList.length > 0) {
        product.review = reviewsList.slice(0, 8).map((r) => {
            const node: Record<string, unknown> = {
                '@type': 'Review',
                author: { '@type': 'Person', name: (r.user_name || 'Guest').trim() || 'Guest' },
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: Math.min(5, Math.max(1, r.rating)),
                    bestRating: 5,
                },
                datePublished: r.created_at,
            };
            const body = r.comment?.trim() ? stripMarkdownLight(r.comment).slice(0, 5000) : '';
            if (body) node.reviewBody = body;
            return node;
        });
    }

    const pgLoc = findPgLocationForArea(property.location);
    const isPgHub =
        (property.type || '').toUpperCase() === 'PG' || (property.type || '').toLowerCase() === 'hostel';
    const crumbs = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        ...(isPgHub
            ? [
                  { name: 'PG', path: '/pg' },
                  ...(pgLoc ? [{ name: `PG in ${pgLoc.name}`, path: `/pg/${pgLoc.slug}` }] : []),
              ]
            : [{ name: 'Listings', path: '/properties' }]),
        { name: productName.slice(0, 78), path },
    ]);

    const webPage: Record<string, unknown> = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: productName,
        description: (desc || `${productName} — ${property.type} in ${property.location}`).slice(0, 500),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['[data-seo="pdp-h1"]', '[data-seo="pdp-hero-lead"]', '[data-seo="pdp-about"]'],
        },
    };
    if (images.length > 0) {
        webPage.primaryImageOfPage = { '@type': 'ImageObject', url: images[0] };
    }

    const mergedFaqs = [...(pdpFaqs ?? []), ...(localityFaqs ?? [])].slice(0, 10);

    const graph: Record<string, unknown>[] = [
        schemaNodeWithoutContext(product),
        schemaNodeWithoutContext(webPage),
        schemaNodeWithoutContext(crumbs as Record<string, unknown>),
    ];
    if (mergedFaqs.length > 0) {
        graph.push(schemaNodeWithoutContext(buildFaqPageSchema(mergedFaqs) as Record<string, unknown>));
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
}
