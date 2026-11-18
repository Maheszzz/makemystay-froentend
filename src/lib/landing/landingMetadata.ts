/**
 * Tech Park Landing Page Generator: Metadata Generator
 * Reuses the existing central metadata engine (pageSeoToMetadata & buildPageSEO)
 * to generate SEO Title, Meta Description, Canonical URL, Keywords, OpenGraph,
 * Twitter cards, and Robots directives for Tech Park landing pages.
 */

import type { Metadata } from 'next';
import type { TechParkEntry } from '@/data/techParks';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildPageSEO, type HelmetSEOProps, type PageSEOInput } from '@/lib/seo';
import { DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

export function getTechParkCanonicalPath(park: TechParkEntry): string {
    const p = park.path || `pg-near-${park.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
    return p.startsWith('/') ? p : `/${p}`;
}

export function generateTechParkLandingSeoInput(park: TechParkEntry): PageSEOInput {
    const title = `PG near ${park.name}, Bangalore — Verified Coliving & Rooms`;
    const description = `Find verified PGs near ${park.name} in ${park.locality}. Zero brokerage, homely food, high-speed WiFi, AC & 24/7 security. Walk to office and save commute time.`;
    
    const compKeywords = (park.companies || []).slice(0, 4).map(c => `PG near ${c} Bangalore`);
    const allKeywords = [
        `PG near ${park.name}`,
        `PG near ${park.name} Bangalore`,
        `coliving near ${park.name}`,
        `walking distance PG near ${park.name}`,
        `PG in ${park.locality}`,
        ...compKeywords
    ].join(', ');

    return {
        title,
        description,
        path: getTechParkCanonicalPath(park),
        ogImage: DEFAULT_OG_IMAGE,
        keywords: allKeywords,
        noindex: false
    };
}

export function generateTechParkLandingMetadata(park: TechParkEntry): Metadata {
    const input = generateTechParkLandingSeoInput(park);
    return pageSeoToMetadata(input, { openGraphType: 'website' });
}

export function generateTechParkLandingHelmetSeo(park: TechParkEntry): HelmetSEOProps {
    const input = generateTechParkLandingSeoInput(park);
    return buildPageSEO(input);
}
