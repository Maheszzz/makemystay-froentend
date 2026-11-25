/**
 * Locality SEO Engine: Schema Generator
 * Composes existing schema builders from src/lib/schema.ts to emit a rich @graph
 * JSON-LD schema including Place, GeoCoordinates, LocalBusiness, Breadcrumb,
 * FAQ, ItemList, Speakable, and AggregateRating for maximum SERP dominance.
 */

import { BRAND_CONTACT, BRAND_SAME_AS } from '@/lib/brandEntity';
import type { HydratedLocality } from '@/data/localities';
import { OFFICES } from '@/data/offices';
import {
    buildBreadcrumbSchema,
    buildFaqPageSchema,
    buildItemListSchema,
    buildLocalBusinessSchema,
    buildPlaceSchema,
    type FaqItem
} from '@/lib/schema';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { BreadcrumbItem } from './breadcrumbGenerator';

export interface LocalitySchemaBundle {
    /** Combined @graph JSON-LD schema document */
    graphSchema: Record<string, unknown>;
    /** Individual Place schema node with GeoCoordinates */
    placeSchema: Record<string, unknown>;
    /** Individual FAQPage schema node */
    faqSchema: Record<string, unknown>;
    /** Individual BreadcrumbList schema node */
    breadcrumbSchema: Record<string, unknown>;
    /** Individual ItemList schema node for nearby hubs */
    itemListSchema: Record<string, unknown>;
    /** Individual LocalBusiness schema node */
    localBusinessSchema: Record<string, unknown>;
    /** Individual WebPage Speakable schema node */
    speakableSchema: Record<string, unknown>;
    /** Individual AggregateRating schema node */
    aggregateRatingSchema: Record<string, unknown>;
    /** Individual Organization schema node */
    organizationSchema: Record<string, unknown>;
}

function schemaNodeWithoutContext(schema: Record<string, unknown>): Record<string, unknown> {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

/**
 * Generate a Speakable specification schema for voice search and AI Overviews.
 */
export function buildLocalitySpeakableSchema(locality: HydratedLocality, absoluteUrl: string): Record<string, unknown> {
    return {
        '@type': 'WebPage',
        '@id': `${absoluteUrl}#webpage`,
        url: absoluteUrl,
        name: `PG in ${locality.name}, Bangalore`,
        description: locality.description.slice(0, 300),
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['[data-seo="h1"]', '[data-seo="quick-answer"]', '[data-seo="about-area"]']
        }
    };
}

/**
 * Generate an AggregateRating schema node for the locality stay service.
 */
export function buildLocalityAggregateRatingSchema(locality: HydratedLocality): Record<string, unknown> {
    return {
        '@type': 'RealEstateAgent',
        '@id': `${SITE_URL}/pg/${locality.slug}#service`,
        name: `${SITE_NAME} — PG in ${locality.name}`,
        areaServed: {
            '@type': 'Place',
            name: `${locality.name}, Bangalore`
        },
        priceRange: '₹6,500 – ₹25,000',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: 4.7,
            reviewCount: 248,
            bestRating: 5,
            worstRating: 1
        }
    };
}

/**
 * Compose all schema builders into a unified @graph JSON-LD bundle.
 */
export function generateLocalitySchemaBundle(
    locality: HydratedLocality,
    faqs: FaqItem[],
    breadcrumbs: BreadcrumbItem[]
): LocalitySchemaBundle {
    const absoluteUrl = `${SITE_URL}/pg/${locality.slug}`;

    // 1. Place + GeoCoordinates
    const placeSchema = buildPlaceSchema({
        name: `${locality.name}, Bangalore, Karnataka`,
        description: locality.description,
        address: `${locality.name}, Bangalore, Karnataka, India`,
        geo: {
            latitude: String(locality.latitude),
            longitude: String(locality.longitude)
        }
    });

    // 2. LocalBusiness
    const localBusinessSchema = buildLocalBusinessSchema();

    // 3. BreadcrumbList
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

    // 4. FAQPage
    const faqSchema = buildFaqPageSchema(faqs);

    // 5. ItemList (Nearby Tech Parks & Localities)
    const hubItems = [
        ...locality.nearbyTechParks
            .filter((tp) => OFFICES.some((o) => o.slug === tp.slug))
            .map((tp) => ({
            name: tp.name,
            url: `${SITE_URL}/office/${tp.slug}`
        })),
        ...locality.nearbyLocalities.map((loc) => ({
            name: `PG in ${loc.name}`,
            url: `${SITE_URL}/pg/${loc.slug}`
        }))
    ];
    const itemListSchema = buildItemListSchema(hubItems);

    // 6. Speakable Specification
    const speakableSchema = buildLocalitySpeakableSchema(locality, absoluteUrl);

    // 7. AggregateRating
    const aggregateRatingSchema = buildLocalityAggregateRatingSchema(locality);

    // 8. Organization
    const organizationSchema: Record<string, unknown> = {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/icon-512.png`
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: BRAND_CONTACT.telephone,
            contactType: 'customer support',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi', 'kn']
        },
        sameAs: BRAND_SAME_AS
    };

    // Compose into a unified @graph
    const graphSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        // Organization / LocalBusiness are emitted once site-wide (root layout); repeating them here
        // with different values confused Google. The hard-coded AggregateRating node was removed:
        // ratings in structured data must come from real, visible reviews (Google review-snippet policy).
        '@graph': [
            schemaNodeWithoutContext(placeSchema),
            schemaNodeWithoutContext(breadcrumbSchema),
            schemaNodeWithoutContext(faqSchema),
            schemaNodeWithoutContext(itemListSchema),
            schemaNodeWithoutContext(speakableSchema)
        ]
    };

    return {
        graphSchema,
        placeSchema,
        faqSchema,
        breadcrumbSchema,
        itemListSchema,
        localBusinessSchema,
        speakableSchema,
        aggregateRatingSchema,
        organizationSchema
    };
}
