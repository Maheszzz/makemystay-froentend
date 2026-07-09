/**
 * Content engine for Tech Park Pillar Pages.
 * Generates page copy, tables, FAQs, and JSON-LD schema from TechParkEntry data.
 */

import type { TechParkEntry } from '@/data/techParks';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { FaqItem } from '@/lib/schema';

// ─── Schema builders ──────────────────────────────────────────────────────────

function stripContext(schema: Record<string, unknown>) {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

/** WebPage node with Speakable for AEO */
function buildTechParkWebPageNode(park: TechParkEntry, canonicalPath: string) {
    const url = `${SITE_URL}${canonicalPath}`;
    return {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `PG near ${park.name} — Verified Stays in ${park.locality}`,
        description: park.quickAnswer.slice(0, 300),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: [
                '[data-seo="tech-park-quick-answer"]',
                '[data-seo="tech-park-h1"]',
                '#tech-park-faq-heading',
            ],
        },
    };
}

/** BreadcrumbList for tech park pages */
export function buildTechParkBreadcrumbs(park: TechParkEntry) {
    return [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `PG near ${park.name}`, path: `/${park.path}` },
    ];
}

/** FAQPage node from tech park data */
function buildTechParkFaqNode(park: TechParkEntry) {
    return {
        '@type': 'FAQPage',
        mainEntity: park.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    };
}

/** BreadcrumbList node */
function buildBreadcrumbNode(park: TechParkEntry, _canonicalPath: string) {
    const crumbs = buildTechParkBreadcrumbs(park);
    return {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: `${SITE_URL}${c.path}`,
        })),
    };
}

/** Place node for the tech park itself */
function buildTechParkPlaceNode(park: TechParkEntry) {
    return {
        '@type': 'Place',
        '@id': `${SITE_URL}/${park.path}#place`,
        name: park.name,
        description: park.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: park.address,
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: park.geo.lat,
            longitude: park.geo.lng,
        },
    };
}

/** LocalBusiness node for MakeMyStay as the service provider */
function buildLocalBusinessNode(park: TechParkEntry) {
    return {
        '@type': ['LocalBusiness', 'RealEstateAgent'],
        '@id': `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        url: SITE_URL,
        areaServed: [park.name, park.locality, 'Bangalore'],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
        },
        priceRange: park.avgPgCost,
    };
}

/**
 * Full JSON-LD @graph for a tech park pillar page.
 * Includes: WebPage, FAQPage, BreadcrumbList, Place, LocalBusiness.
 */
export function buildTechParkPillarGraph(park: TechParkEntry, canonicalPath: string) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            stripContext(buildTechParkWebPageNode(park, canonicalPath)),
            stripContext(buildTechParkFaqNode(park)),
            stripContext(buildBreadcrumbNode(park, canonicalPath)),
            stripContext(buildTechParkPlaceNode(park)),
            stripContext(buildLocalBusinessNode(park)),
        ],
    };
}

// ─── SEO metadata helpers ─────────────────────────────────────────────────────

export interface TechParkMetaInput {
    title: string;
    description: string;
    path: string;
    ogImage?: string;
}

export function buildTechParkMeta(park: TechParkEntry): TechParkMetaInput {
    const title = `PG near ${park.name} | Verified Stays in ${park.locality.split(',')[0]}`;
    const description = `Find verified PG and coliving near ${park.name}, ${park.locality.split(',')[0]}, Bangalore. Average rent ${park.avgPgCost}. Compare rooms with WiFi, food, and AC on ${SITE_NAME}.`;
    return {
        title: title.slice(0, 60),
        description: description.slice(0, 155),
        path: `/${park.path}`,
    };
}

// ─── Content generation helpers ───────────────────────────────────────────────

/** Format the FAQs from TechParkEntry as FaqItem[] for schema + rendering */
export function getTechParkFaqs(park: TechParkEntry): FaqItem[] {
    return park.faqs.map((f) => ({ question: f.question, answer: f.answer }));
}

/** Build the commute table markdown for the content section */
export function buildCommuteTableHtml(park: TechParkEntry): string {
    const rows = park.commuteTable
        .map(
            (r) =>
                `<tr><td>${r.from}</td><td>${r.to}</td><td>${r.mode}</td><td>${r.peakTime}</td><td>${r.offPeakTime}</td></tr>`
        )
        .join('');
    return `<table>
        <thead><tr><th>From</th><th>To</th><th>Mode</th><th>Peak</th><th>Off-Peak</th></tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

/** Build a descriptive text paragraph about the park for the hero section */
export function buildTechParkHeroParagraph(park: TechParkEntry): string {
    const companyList = park.companies.slice(0, 5).join(', ');
    return `${park.description} Key tenants include ${companyList}, and more than ${park.companies.length > 6 ? '6+ other companies' : 'several other organizations'}. The ${park.walkingDistancePgAreas[0]?.split('(')[0]?.trim() ?? 'nearest residential areas'} offer the closest PG options, with average double sharing rent of ${park.rentTable.find(r => r.roomType.includes('Double'))?.priceRange ?? park.avgPgCost} per month.`;
}

/** Build a summary string listing the top nearby amenities */
export function buildAmenitySummary(park: TechParkEntry): string {
    const parts: string[] = [];
    if (park.hospitals.length) parts.push(`nearest hospital: ${park.hospitals[0].name} (${park.hospitals[0].distance})`);
    if (park.gyms.length) parts.push(`gym: ${park.gyms[0].name} (${park.gyms[0].distance})`);
    if (park.groceryStores.length) parts.push(`grocery: ${park.groceryStores[0].name} (${park.groceryStores[0].distance})`);
    return parts.join(' · ');
}
