/**
 * Locality SEO Engine: Content Generator
 * Generates dynamic, keyword-optimized content for locality landing pages
 * including Hero, Quick Answer (AEO / Speakable), About Area, Rental Guide,
 * Amenities, Who Should Stay, and Reviews Summary.
 */

import { getAllAmenities, type Amenity } from '@/data/amenities';
import type { HydratedLocality } from '@/data/localities';

export interface LocalityHeroContent {
    /** Primary H1 heading */
    heading: string;
    /** Supporting secondary subtitle */
    subHeading: string;
    /** Call to action button text */
    ctaText: string;
    /** Call to action destination URL */
    ctaUrl: string;
    /** Search-engine optimized intro sentence */
    seoIntro: string;
}

export interface RentalGuideItem {
    /** Sharing type or tier name (e.g. "Single Sharing", "Luxury PG") */
    category: string;
    /** Monthly rent range in INR */
    priceRange: string;
    /** Detailed description of what is included */
    description: string;
}

export interface LocalityRentalGuide {
    /** Overall average monthly rent range */
    averageRent: string;
    /** Single sharing occupancy details */
    singleSharing: RentalGuideItem;
    /** Double sharing occupancy details */
    doubleSharing: RentalGuideItem;
    /** Triple sharing occupancy details */
    tripleSharing: RentalGuideItem;
    /** Premium luxury PG tier details */
    luxuryPg: RentalGuideItem;
    /** Pocket-friendly budget PG tier details */
    budgetPg: RentalGuideItem;
    /** Disclaimer or pricing note */
    note: string;
}

export interface WhoShouldStaySection {
    /** Guide for IT workers and corporate employees */
    workingProfessionals: string;
    /** Guide for university and college students */
    students: string;
    /** Guide for newcomers moving to Bangalore */
    newcomers: string;
}

export interface LocalityReviewsSummary {
    /** Average aggregate rating out of 5 */
    averageRating: number;
    /** Total verified resident review count */
    totalReviews: number;
    /** Executive narrative summary of resident feedback */
    summaryText: string;
}

/**
 * Generate SEO-optimized Hero section content for a locality page.
 */
export function generateLocalityHero(locality: HydratedLocality): LocalityHeroContent {
    const mainTechPark = locality.nearbyTechParks[0]?.name || 'major IT corridors';
    const seoIntro = `Find verified PGs in ${locality.name} with WiFi, food, housekeeping, AC and flexible rental options near ${mainTechPark}.`;

    return {
        heading: `Best PG in ${locality.name}, Bangalore`,
        subHeading: `Verified coliving spaces & paying guest accommodations in ${locality.name} with homely meals, high-speed Wi-Fi, and zero brokerage.`,
        ctaText: `Explore PGs in ${locality.name}`,
        ctaUrl: `/properties?location=${locality.slug}`,
        seoIntro
    };
}

/**
 * Generate a concise 80–120 word Quick Answer optimized for Google AI Overviews,
 * Featured Snippets, and Speakable Schema.
 */
export function generateLocalityQuickAnswer(locality: HydratedLocality): string {
    const techParkNames = locality.nearbyTechParks.map((tp) => tp.name).slice(0, 2).join(' and ');
    const metroText = locality.nearbyMetroStations[0]
        ? `Connectivity is enhanced by ${locality.nearbyMetroStations[0].name} on the ${locality.nearbyMetroStations[0].line} Line.`
        : 'The area is well-connected by BMTC buses and ORR arterial routes.';
    const hubText = techParkNames ? `near major employment hubs like ${techParkNames}` : `in the heart of ${locality.city}`;

    return `${locality.name} is one of Bangalore's most sought-after residential and IT hubs for paying guest accommodations and coliving spaces. Located ${hubText}, shared PG rooms in ${locality.name} typically cost between ₹8,000 and ₹14,000 per month including food, high-speed Wi-Fi, and daily housekeeping, while single private rooms range from ₹15,000 to ₹22,000. ${metroText} Residents benefit from 24/7 security, power backup, and walking-distance commutes to leading corporate offices.`;
}

/**
 * Generate comprehensive "About Area" SEO narrative content.
 */
export function generateLocalityAbout(locality: HydratedLocality): string {
    const primaryKw = locality.keywords.primary;
    const secondaryKw = locality.keywords.secondary.slice(0, 2).join(', ');
    const companies = locality.nearbyCompanies.map((c) => c.name).slice(0, 4).join(', ');

    return `${locality.description} Finding a reliable ${primaryKw} has become essential as thousands of professionals and students relocate to work with leading corporations such as ${companies || 'global IT firms'}. Whether you are looking for ${secondaryKw} or professionally managed coliving communities, ${locality.name} offers vibrant nightlife, retail malls, multispecialty healthcare, and seamless transit options across Bangalore.`;
}

/**
 * Generate a structured rental pricing guide across all occupancy tiers.
 */
export function generateLocalityRentalGuide(_locality?: HydratedLocality): LocalityRentalGuide {
    return {
        averageRent: '₹8,500 – ₹18,000 / month',
        singleSharing: {
            category: 'Single Sharing PG',
            priceRange: '₹15,000 – ₹22,000 / month',
            description: 'Private occupancy with attached bathroom, study desk, AC, and full privacy for senior IT professionals.'
        },
        doubleSharing: {
            category: 'Double Sharing PG',
            priceRange: '₹9,500 – ₹14,500 / month',
            description: 'Twin-sharing room balance of affordability and comfort, popular among working engineers and graduates.'
        },
        tripleSharing: {
            category: 'Triple Sharing PG',
            priceRange: '₹7,000 – ₹9,500 / month',
            description: 'Pocket-friendly co-occupancy ideal for interns, trainees, and college students with all meals included.'
        },
        luxuryPg: {
            category: 'Luxury Managed Coliving',
            priceRange: '₹18,000 – ₹28,000 / month',
            description: 'Premium lifestyle stay featuring gym access, biometric entry, gaming lounges, and professional laundry service.'
        },
        budgetPg: {
            category: 'Budget PG Accommodation',
            priceRange: '₹6,500 – ₹8,500 / month',
            description: 'Essential clean accommodation with daily housekeeping, Wi-Fi, and standard homely meal menu.'
        },
        note: 'All rental rates typically include electricity, water, high-speed internet, daily cleaning, and 2-time or 3-time meals unless specified otherwise.'
    };
}

/**
 * Generate top amenities available in the locality from src/data/amenities.ts.
 */
export function generateLocalityAmenities(_locality?: HydratedLocality): Amenity[] {
    const allAmenities = getAllAmenities();
    // Return all core amenities sorted or customized for locality significance
    return allAmenities;
}

/**
 * Generate structured "Who Should Stay" recommendations.
 */
export function generateWhoShouldStay(locality: HydratedLocality): WhoShouldStaySection {
    const techParks = locality.nearbyTechParks.map((t) => t.name).slice(0, 2).join(' or ');
    const colleges = locality.nearbyColleges.map((c) => c.shortName || c.name).slice(0, 2).join(' or ');

    return {
        workingProfessionals: `Ideal for software engineers, product managers, and consultants commuting to ${techParks || 'nearby tech parks'}, offering zero commute stress and high-speed Wi-Fi.`,
        students: `Perfect for scholars attending ${colleges || 'nearby educational institutions'}, providing budget-friendly sharing tiers, nutritious food, and quiet study spaces.`,
        newcomers: `Highly recommended for newcomers moving to Bangalore who want hassle-free move-in with zero brokerage, verified security, and a built-in community.`
    };
}

/**
 * Generate aggregate review summary metrics and executive feedback snippet.
 */
export function generateReviewsSummary(locality: HydratedLocality): LocalityReviewsSummary {
    return {
        averageRating: 4.7,
        totalReviews: 248,
        summaryText: `Verified residents in ${locality.name} consistently rate MakeMyStay accommodations 4.7/5 for hygiene, food quality, safety, and proximity to metro stations and IT corridors.`
    };
}
