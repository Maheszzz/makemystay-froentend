/**
 * Tech Park Landing Page Generator: Master Engine
 * Single entry point for dynamically generating complete, strongly typed
 * SEO profiles for any Bangalore Tech Park from src/data/techParks.ts and localities.ts.
 */

import type { Metadata } from 'next';
import {
    TECH_PARKS,
    SEO_TECH_PARKS,
    type TechParkEntry,
    type TechPark
} from '@/data/techParks';
import type { Amenity } from '@/data/amenities';
import type { FaqItem } from '@/lib/schema';
import { buildTechParkBreadcrumbs } from '@/lib/techParkContent';

import {
    generateTechParkHero,
    generateTechParkQuickAnswer,
    generateTechParkAbout,
    generateTechParkRentalGuide,
    generateTechParkCommuteInfo,
    generateTechParkWhoShouldStay,
    generateTechParkAmenities,
    generateNearbyLocalitiesForTechPark,
    generateNearbyMetroForTechPark,
    generateNearbyCompaniesForTechPark,
    type TechParkHeroContent,
    type TechParkRentalGuide,
    type TechParkCommuteInfo,
    type TechParkWhoShouldStay,
    type NearbyLocalityItem,
    type NearbyMetroItem,
    type NearbyCompanyItem,
    type RelatedTechParkItem
} from './landingContent';
import { generateTechParkLandingFaqs } from './landingFaq';
import { generateTechParkLandingMetadata } from './landingMetadata';
import { generateTechParkLandingSchemaBundle } from './landingSchema';
import {
    generateTechParkLandingLinks,
    type TechParkLandingLinks
} from './landingLinks';

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export interface TechParkLandingProfile {
    /** Normalized Tech Park slug (e.g. 'itpl') */
    slug: string;
    /** URL path segment (e.g. 'pg-near-itpl') */
    path: string;
    /** Complete hydrated TechParkEntry */
    park: TechParkEntry;
    /** Hero section content with H1, Subheading, and SEO Intro */
    hero: TechParkHeroContent;
    /** Quick answer paragraph for Google AI Overviews & Speakable */
    quickAnswer: string;
    /** Comprehensive narrative About Tech Park */
    aboutTechPark: string;
    /** Related PG localities derived from localities.ts */
    nearbyLocalities: NearbyLocalityItem[];
    /** 6-tier structured rental pricing guide */
    rentalGuide: TechParkRentalGuide;
    /** Nearby metro stations with operational status & line */
    nearbyMetro: NearbyMetroItem[];
    /** Corporate employers operating in the park */
    nearbyCompanies: NearbyCompanyItem[];
    /** Top coliving & PG amenities */
    topAmenities: Amenity[];
    /** Commute information with walking time, transit, and commute table */
    commuteInfo: TechParkCommuteInfo;
    /** Structured recommendations for Working Professionals, Students, Newcomers */
    whoShouldStay: TechParkWhoShouldStay;
    /** 15+ dynamically generated SEO & AEO FAQs */
    faqs: FaqItem[];
    /** Breadcrumb navigation array */
    breadcrumb: BreadcrumbItem[];
    /** Next.js App Router metadata object */
    metadata: Metadata;
    /** Unified @graph JSON-LD schema document */
    schema: Record<string, unknown>;
    /** Deduplicated internal links for localities, parks, blogs, metro, companies */
    internalLinks: TechParkLandingLinks;
    /** Related Tech Park cards */
    relatedTechParks: RelatedTechParkItem[];
}

/**
 * Normalizes a user-supplied slug or path (e.g. 'pg-near-itpl' or 'itpl' or 'embassy-tech-village')
 * into a matching TechParkEntry from TECH_PARKS or SEO_TECH_PARKS.
 */
export function resolveTechParkEntry(inputSlug: string): TechParkEntry | undefined {
    if (!inputSlug) return undefined;
    const clean = inputSlug
        .toLowerCase()
        .replace(/^\/+|\/+$/g, '')
        .replace(/^pg-near-/, '');

    // 1. Direct match on TECH_PARKS path
    const directPathMatch = TECH_PARKS.find(
        (tp) => tp.path === inputSlug || tp.path === `pg-near-${inputSlug}` || tp.path === `pg-near-${clean}`
    );
    if (directPathMatch) return directPathMatch;

    // 2. Try matching by slug / clean segment against TECH_PARKS path
    const pathMatch = TECH_PARKS.find((tp) => {
        const seg = tp.path.replace(/^pg-near-/, '');
        return seg === clean || seg.replace(/-/g, '') === clean.replace(/-/g, '');
    });
    if (pathMatch) return pathMatch;

    // 3. Fallback to SEO_TECH_PARKS and synthesize a TechParkEntry
    const seoMatch: TechPark | undefined = SEO_TECH_PARKS.find((tp) => {
        return tp.slug === clean || tp.slug.replace(/-/g, '') === clean.replace(/-/g, '') || tp.id === clean;
    });

    if (seoMatch) {
        return {
            path: `pg-near-${seoMatch.slug}`,
            name: seoMatch.name,
            locality: seoMatch.locality,
            hubSlug: seoMatch.locality,
            localitySlugs: [seoMatch.locality, 'whitefield', 'bellandur'],
            description: seoMatch.description,
            quickAnswer: `${seoMatch.name} is a prominent tech park located in ${seoMatch.locality}, Bangalore. Major corporate tenants include ${seoMatch.companies.slice(0, 3).join(', ')}. Monthly PG rent near ${seoMatch.name} starts around ₹7,500 with meals, WiFi, and AC.`,
            tenantProfile: 'Software engineers, consultants, and IT working professionals.',
            companies: seoMatch.companies,
            metroStations: [],
            busStops: [],
            walkingDistancePgAreas: [seoMatch.locality],
            commuteTable: [
                { from: 'Nearest PG Cluster', to: seoMatch.name, mode: 'Walk', peakTime: '10 mins', offPeakTime: '10 mins' },
                { from: 'Main Road Bus Stop', to: seoMatch.name, mode: 'BMTC', peakTime: '15 mins', offPeakTime: '10 mins' }
            ],
            rentTable: [
                { roomType: 'Single Sharing Room', priceRange: '₹14,000 – ₹22,000/mo', note: 'Private room with ensuite washroom' },
                { roomType: 'Double Sharing Room', priceRange: '₹8,500 – ₹13,000/mo', note: 'Twin sharing with WiFi & food' }
            ],
            avgPgCost: '₹7,500 – ₹17,000/mo',
            restaurants: [],
            hospitals: [],
            gyms: [],
            cafes: [],
            groceryStores: [],
            nearbySlugs: [seoMatch.locality],
            relatedTechParkPaths: ['pg-near-itpl', 'pg-near-embassy-techvillage', 'pg-near-ecospace'],
            faqs: [],
            geo: { lat: seoMatch.coordinates.latitude, lng: seoMatch.coordinates.longitude },
            address: `${seoMatch.name}, ${seoMatch.locality}, Bangalore, Karnataka`
        };
    }

    return undefined;
}

/**
 * Get all available clean tech park slugs for generateStaticParams().
 */
export function getTechParkLandingSlugs(): string[] {
    const slugs = new Set<string>();
    for (const tp of TECH_PARKS) {
        const clean = tp.path.replace(/^pg-near-/, '');
        slugs.add(clean);
    }
    for (const tp of SEO_TECH_PARKS) {
        slugs.add(tp.slug);
    }
    return Array.from(slugs);
}

/**
 * Generate a complete, production-ready SEO profile for a Tech Park landing page.
 */
export function generateTechParkLandingProfile(inputSlug: string): TechParkLandingProfile | null {
    const park = resolveTechParkEntry(inputSlug);
    if (!park) return null;

    const cleanSlug = park.path.replace(/^pg-near-/, '');
    const hero = generateTechParkHero(park);
    const quickAnswer = generateTechParkQuickAnswer(park);
    const aboutTechPark = generateTechParkAbout(park);
    const nearbyLocalities = generateNearbyLocalitiesForTechPark(park);
    const rentalGuide = generateTechParkRentalGuide(park);
    const nearbyMetro = generateNearbyMetroForTechPark(park);
    const nearbyCompanies = generateNearbyCompaniesForTechPark(park);
    const topAmenities = generateTechParkAmenities();
    const commuteInfo = generateTechParkCommuteInfo(park);
    const whoShouldStay = generateTechParkWhoShouldStay(park);
    const faqs = generateTechParkLandingFaqs(park);
    const breadcrumb = buildTechParkBreadcrumbs(park);
    const metadata = generateTechParkLandingMetadata(park);
    const schema = generateTechParkLandingSchemaBundle(park, faqs);
    const internalLinks = generateTechParkLandingLinks(park, TECH_PARKS);

    const relatedTechParks: RelatedTechParkItem[] = TECH_PARKS
        .filter(tp => tp.path !== park.path)
        .slice(0, 6)
        .map(tp => ({
            name: tp.name,
            slug: tp.path.replace(/^pg-near-/, ''),
            path: tp.path,
            description: tp.description
        }));

    return {
        slug: cleanSlug,
        path: park.path,
        park,
        hero,
        quickAnswer,
        aboutTechPark,
        nearbyLocalities,
        rentalGuide,
        nearbyMetro,
        nearbyCompanies,
        topAmenities,
        commuteInfo,
        whoShouldStay,
        faqs,
        breadcrumb,
        metadata,
        schema,
        internalLinks,
        relatedTechParks
    };
}
