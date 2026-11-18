/**
 * Locality SEO Engine: Master Engine
 * Single entry point for dynamically generating complete, strongly typed
 * SEO profiles for any Bangalore locality from the centralized SEO data layer.
 *
 * Designed to be consumed by:
 * - Locality landing pages (e.g., /pg/[slug])
 * - Programmatic SEO engines & sitemap builders
 * - AI content & blog generation pipelines
 */

import type { Metadata } from 'next';
import { getAllLocalities, getHydratedLocality, type HydratedLocality } from '@/data/localities';
import type { Amenity } from '@/data/amenities';
import type { College } from '@/data/colleges';
import type { Company } from '@/data/companies';
import type { Hospital } from '@/data/hospitals';
import type { MetroStation } from '@/data/metroStations';
import type { TechPark } from '@/data/techParks';
import type { FaqItem } from '@/lib/schema';

import {
    generateLocalityAbout,
    generateLocalityAmenities,
    generateLocalityHero,
    generateLocalityQuickAnswer,
    generateLocalityRentalGuide,
    generateReviewsSummary,
    generateWhoShouldStay,
    type LocalityHeroContent,
    type LocalityRentalGuide,
    type LocalityReviewsSummary,
    type WhoShouldStaySection
} from './contentGenerator';
import { generateLocalityFaqs } from './faqGenerator';
import { generateRelatedAreas, type RelatedLocalitiesSection } from './relatedAreas';
import { generateLocalityMetadata } from './metadataGenerator';
import { generateLocalitySchemaBundle, type LocalitySchemaBundle } from './schemaGenerator';
import { generateLocalityBreadcrumb, type BreadcrumbItem } from './breadcrumbGenerator';
import { generateLocalityInternalLinks, type LocalityInternalLinks } from './internalLinks';

export interface LocalitySeoProfile {
    /** URL-friendly locality slug */
    slug: string;
    /** Full hydrated locality entity from src/data/localities */
    locality: HydratedLocality;
    /** Hero section content with H1, Subheading, CTA, and SEO Intro */
    hero: LocalityHeroContent;
    /** 80–120 word Quick Answer optimized for Google AI Overviews & Speakable */
    quickAnswer: string;
    /** Comprehensive About Area descriptive narrative */
    aboutArea: string;
    /** Structured rental pricing guide across single/double/triple/luxury/budget tiers */
    rentalGuide: LocalityRentalGuide;
    /** Nearby corporate tech parks and IT campuses */
    nearbyTechParks: TechPark[];
    /** Nearby operational metro stations */
    nearbyMetroStations: MetroStation[];
    /** Nearby multispecialty hospitals */
    nearbyHospitals: Hospital[];
    /** Nearby colleges and engineering institutions */
    nearbyColleges: College[];
    /** Leading corporate employers operating in the locality */
    nearbyCompanies: Company[];
    /** Top PG and coliving amenities available */
    topAmenities: Amenity[];
    /** Structured "Who Should Stay" recommendations */
    whoShouldStay: WhoShouldStaySection;
    /** Nearby areas, IT corridors, and business districts */
    relatedLocalities: RelatedLocalitiesSection;
    /** 15+ dynamically generated SEO and AEO FAQs */
    faqs: FaqItem[];
    /** Aggregate resident review rating and narrative snippet */
    reviewsSummary: LocalityReviewsSummary;
    /** 3-tier Breadcrumb navigation hierarchy */
    breadcrumb: BreadcrumbItem[];
    /** Next.js App Router metadata object (Title, Description, Canonical, OG, Twitter) */
    metadata: Metadata;
    /** Unified @graph JSON-LD schema document */
    jsonLdSchema: Record<string, unknown>;
    /** Individual schema builder nodes */
    schemaBundle: LocalitySchemaBundle;
    /** Deduplicated internal link clusters */
    internalLinks: LocalityInternalLinks;
}

/**
 * Generate a complete, strongly typed SEO profile for any locality slug.
 * Requires only the `localitySlug` (e.g. "whitefield", "bellandur").
 */
export function generateLocalitySeoProfile(localitySlug: string): LocalitySeoProfile | undefined {
    const locality = getHydratedLocality(localitySlug);
    if (!locality) return undefined;

    // 1. Generate Core Content Sections
    const hero = generateLocalityHero(locality);
    const quickAnswer = generateLocalityQuickAnswer(locality);
    const aboutArea = generateLocalityAbout(locality);
    const rentalGuide = generateLocalityRentalGuide(locality);
    const topAmenities = generateLocalityAmenities(locality);
    const whoShouldStay = generateWhoShouldStay(locality);
    const reviewsSummary = generateReviewsSummary(locality);

    // 2. Generate Navigation & Linking
    const relatedLocalities = generateRelatedAreas(locality);
    const breadcrumb = generateLocalityBreadcrumb(locality);
    const internalLinks = generateLocalityInternalLinks(locality);

    // 3. Generate FAQs
    const faqs = generateLocalityFaqs(locality);

    // 4. Generate Metadata & Schema (Reusing existing engines)
    const metadata = generateLocalityMetadata(locality);
    const schemaBundle = generateLocalitySchemaBundle(locality, faqs, breadcrumb);

    return {
        slug: locality.slug,
        locality,
        hero,
        quickAnswer,
        aboutArea,
        rentalGuide,
        nearbyTechParks: locality.nearbyTechParks,
        nearbyMetroStations: locality.nearbyMetroStations,
        nearbyHospitals: locality.nearbyHospitals,
        nearbyColleges: locality.nearbyColleges,
        nearbyCompanies: locality.nearbyCompanies,
        topAmenities,
        whoShouldStay,
        relatedLocalities,
        faqs,
        reviewsSummary,
        breadcrumb,
        metadata,
        jsonLdSchema: schemaBundle.graphSchema,
        schemaBundle,
        internalLinks
    };
}

/**
 * Helper alias for retrieving a locality SEO profile by slug.
 */
export function getLocalitySeoProfile(localitySlug: string): LocalitySeoProfile | undefined {
    return generateLocalitySeoProfile(localitySlug);
}

/**
 * Get all available locality slugs in the centralized SEO data layer.
 */
export function getLocalitySlugs(): string[] {
    return getAllLocalities().map((loc) => loc.slug);
}

/**
 * Generate full SEO profiles for all localities in the data layer.
 */
export function getAllLocalitySeoProfiles(): LocalitySeoProfile[] {
    return getLocalitySlugs()
        .map((slug) => generateLocalitySeoProfile(slug))
        .filter((profile): profile is LocalitySeoProfile => Boolean(profile));
}
