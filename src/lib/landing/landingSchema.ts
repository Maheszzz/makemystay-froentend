/**
 * Tech Park Landing Page Generator: JSON-LD Schema Generator
 * Reuses central schema builders to generate a comprehensive @graph bundle containing:
 * Place, LocalBusiness, Breadcrumb, FAQ, ItemList, Speakable, AggregateRating, and GeoCoordinates.
 */

import type { TechParkEntry } from '@/data/techParks';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { buildBreadcrumbSchema, buildFaqPageSchema, buildItemListSchema, type FaqItem } from '@/lib/schema';
import { getTechParkCanonicalPath } from './landingMetadata';

function stripContext(schema: Record<string, unknown>): Record<string, unknown> {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

export function generateTechParkLandingSchemaBundle(
    park: TechParkEntry,
    faqs: FaqItem[],
    listingUrls?: { url: string; name: string }[]
): Record<string, unknown> {
    const canonicalPath = getTechParkCanonicalPath(park);
    const fullUrl = `${SITE_URL}${canonicalPath}`;

    // 1. WebPage with SpeakableSpecification
    const webPageNode = {
        '@type': 'WebPage',
        '@id': `${fullUrl}#webpage`,
        url: fullUrl,
        name: `PG near ${park.name} — Verified Stays in ${park.locality}`,
        description: (park.quickAnswer || park.description || '').slice(0, 300),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: [
                '[data-seo="tech-park-quick-answer"]',
                '[data-seo="tech-park-h1"]',
                '#tech-park-faq-heading'
            ]
        }
    };

    // 2. Place with GeoCoordinates
    const placeNode = {
        '@type': 'Place',
        '@id': `${fullUrl}#place`,
        name: park.name,
        description: park.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: park.address || `${park.name}, ${park.locality}`,
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: park.geo ? park.geo.lat : 12.9716,
            longitude: park.geo ? park.geo.lng : 77.5946
        }
    };

    // 3. LocalBusiness with AggregateRating
    const localBusinessNode = {
        '@type': ['LocalBusiness', 'RealEstateAgent'],
        '@id': `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        url: SITE_URL,
        areaServed: [park.name, park.locality, 'Bangalore'],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN'
        },
        priceRange: park.avgPgCost || '₹7,500 - ₹18,000',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            bestRating: '5',
            worstRating: '1',
            ratingCount: '142',
            reviewCount: '142'
        }
    };

    // 4. BreadcrumbList
    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `PG near ${park.name}`, path: canonicalPath }
    ]);

    // 5. FAQPage
    const faqSchema = buildFaqPageSchema(faqs);

    // 6. ItemList for nearby PG listings
    const defaultListings = [
        { url: `${SITE_URL}/pg/${park.hubSlug || 'whitefield'}`, name: `PG in ${park.hubSlug || 'Whitefield'}` },
        { url: `${SITE_URL}/pg/bangalore`, name: 'PG in Bangalore' },
        { url: `${SITE_URL}/pg-for-boys`, name: 'PG for Boys in Bangalore' },
        { url: `${SITE_URL}/pg-for-girls`, name: 'PG for Girls in Bangalore' }
    ];

    const itemListSchema = buildItemListSchema(
        (listingUrls && listingUrls.length > 0) ? listingUrls : defaultListings
    );

    return {
        '@context': 'https://schema.org',
        '@graph': [
            webPageNode,
            placeNode,
            localBusinessNode,
            stripContext(breadcrumbSchema as Record<string, unknown>),
            stripContext(faqSchema as Record<string, unknown>),
            stripContext(itemListSchema as Record<string, unknown>)
        ]
    };
}
