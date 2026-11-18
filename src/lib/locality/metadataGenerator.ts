/**
 * Locality SEO Engine: Metadata Generator
 * Reuses the existing central metadata engine (pageSeoToMetadata & buildPageSEO)
 * to generate SEO Title, Meta Description, Canonical URL, Keywords, OpenGraph,
 * Twitter cards, and Robots directives for locality landing pages.
 */

import type { Metadata } from 'next';
import type { HydratedLocality } from '@/data/localities';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildPageSEO, type HelmetSEOProps, type PageSEOInput } from '@/lib/seo';
import { DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

/**
 * Generate shared PageSEOInput for a locality page.
 */
export function generateLocalitySeoInput(locality: HydratedLocality): PageSEOInput {
    const title = `PG in ${locality.name}, Bangalore (2026) — Verified Coliving`;
    const description = `Find verified PG in ${locality.name}, Bangalore near IT parks. Zero brokerage coliving with food, high-speed WiFi, AC & 24/7 CCTV. Rent starts @ ₹6,500/mo.`;

    const allKeywords = [
        locality.keywords.primary,
        ...locality.keywords.secondary,
        ...locality.keywords.commercial,
        ...locality.keywords.longTail
    ].join(', ');

    return {
        title,
        description,
        path: `/pg/${locality.slug}`,
        ogImage: DEFAULT_OG_IMAGE,
        keywords: allKeywords,
        noindex: false
    };
}

/**
 * Generate Next.js App Router Metadata object for a locality page.
 * Reuses pageSeoToMetadata to include OpenGraph, Twitter, canonical, and Robots tags.
 */
export function generateLocalityMetadata(locality: HydratedLocality): Metadata {
    const input = generateLocalitySeoInput(locality);
    return pageSeoToMetadata(input, { openGraphType: 'website' });
}

/**
 * Generate React Helmet SEO properties for client-side or legacy SPA rendering.
 */
export function generateLocalityHelmetSeo(locality: HydratedLocality): HelmetSEOProps {
    const input = generateLocalitySeoInput(locality);
    return buildPageSEO(input);
}
