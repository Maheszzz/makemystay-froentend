import type { LocalityAuthorityProfile } from '@/data/authority/types';
import { SITE_NAME, SITE_URL } from './siteConfig';
import type { FaqItem } from './schema';

function stripContext(schema: Record<string, unknown>) {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

export function buildAuthorityBreadcrumbs(profile: LocalityAuthorityProfile) {
    return [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `PG in ${profile.name}`, path: `/pg/${profile.slug}` },
    ];
}

export function getAuthorityFaqs(profile: LocalityAuthorityProfile): FaqItem[] {
    return profile.faqs.map(f => ({ question: f.question, answer: f.answer }));
}

export function buildAuthorityGraph(profile: LocalityAuthorityProfile, canonicalPath: string) {
    const url = `${SITE_URL}${canonicalPath}`;
    
    const webPage = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: profile.metaTitle,
        description: profile.metaDescription,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        dateModified: profile.lastUpdated,
    };
    
    const faqPage = {
        '@type': 'FAQPage',
        mainEntity: profile.faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    };
    
    const breadcrumbs = {
        '@type': 'BreadcrumbList',
        itemListElement: buildAuthorityBreadcrumbs(profile).map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: {
                '@id': `${SITE_URL}${c.path}`,
                name: c.name,
            },
        })),
    };
    
    const place = {
        '@type': 'Place',
        '@id': `${url}#place`,
        name: profile.name,
        description: profile.introduction.slice(0, 300),
        geo: {
            '@type': 'GeoCoordinates',
            latitude: profile.geo.lat,
            longitude: profile.geo.lng,
        },
        ...(profile.aggregateRating ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: profile.aggregateRating.ratingValue,
                reviewCount: profile.aggregateRating.reviewCount,
            }
        } : {})
    };
    
    const localBusiness = {
        '@type': ['LocalBusiness', 'RealEstateAgent'],
        '@id': `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        url: SITE_URL,
        areaServed: [profile.name, 'Bangalore'].map((name) => ({ '@type': 'Place', name })),
        ...(profile.aggregateRating ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: profile.aggregateRating.ratingValue,
                reviewCount: profile.aggregateRating.reviewCount,
            }
        } : {})
    };

    const dataset = profile.marketDashboard ? {
        '@type': 'Dataset',
        '@id': `${url}#dataset`,
        name: `Rental Market Data for ${profile.name}`,
        description: `Live rental market insights including active listings, average rents by gender, and occupancy rates in ${profile.name}.`,
        url: url,
        creator: {
            '@type': 'Organization',
            name: SITE_NAME
        },
        dateModified: profile.marketDashboard.dataDate,
        isAccessibleForFree: true
    } : null;

    const graphNodes = [
        stripContext(webPage),
        stripContext(faqPage),
        stripContext(breadcrumbs),
        stripContext(place),
        stripContext(localBusiness)
    ];

    if (dataset) {
        graphNodes.push(stripContext(dataset));
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graphNodes,
    };
}
