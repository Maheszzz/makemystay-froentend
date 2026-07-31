/**
 * Programmatic Blog Engine: Types and Interfaces
 * Supports 14+ blog types targeting Topical Authority Clusters for Localities and Tech Parks.
 */

import type { Metadata } from 'next';
import type { FaqItem } from '@/lib/schema';

export type BlogType =
    | 'best-pg'
    | 'luxury-pg'
    | 'budget-pg'
    | 'single-sharing'
    | 'double-sharing'
    | 'triple-sharing'
    | 'cost-of-living'
    | 'area-guide'
    | 'tech-park-guide'
    | 'comparison'
    | 'student-guide'
    | 'working-professional-guide'
    | 'commute-guide'
    | 'rental-guide';

export interface ProgrammaticBlogInput {
    blogType: BlogType;
    localitySlug?: string;
    techParkSlug?: string;
    secondarySlug?: string; // For comparison articles e.g. whitefield vs marathahalli
}

export interface BlogSectionTable {
    headers: string[];
    rows: string[][];
    caption?: string;
}

export interface BlogSection {
    id: string;
    title: string;
    content: string[];
    table?: BlogSectionTable;
}

export interface BlogRentalInsights {
    averageRent: string;
    priceTable: Array<{
        roomType: string;
        priceRange: string;
        note: string;
    }>;
    analysis: string[];
}

export interface BlogTocItem {
    id: string;
    title: string;
}

export interface ProgrammaticBlogPost {
    /** Main article title */
    title: string;
    /** URL slug segment e.g. "best-pg-in-whitefield" */
    slug: string;
    /** The resolved blog type */
    blogType: BlogType;
    /** Hero header metadata */
    hero: {
        heading: string;
        subHeading: string;
        category: string;
        date: string;
        readTimeMin: number;
    };
    /** Quick summary paragraph (100–150 words) targeting Google AI Overviews & Speakable */
    quickSummary: string;
    /** Introductory paragraphs */
    introduction: string[];
    /** 8+ comprehensive long-form content sections (2500+ words total) */
    mainContent: BlogSection[];
    /** Structured rental pricing guide and analysis */
    rentalInsights: BlogRentalInsights;
    /** Nearby IT tech parks */
    nearbyTechParks: Array<{
        name: string;
        path: string;
        distance: string;
        note?: string;
    }>;
    /** Nearby Namma Metro connectivity */
    nearbyMetro: Array<{
        name: string;
        line: string;
        distance: string;
        status: string;
    }>;
    /** Nearby corporate employers */
    nearbyCompanies: Array<{
        name: string;
        industry: string;
        note?: string;
    }>;
    /** 10–15 SEO & AEO FAQ items */
    faqs: FaqItem[];
    /** Related blog recommendations */
    relatedBlogs: Array<{
        title: string;
        path: string;
    }>;
    /** Related locality PG guides */
    relatedLocalities: Array<{
        name: string;
        path: string;
    }>;
    /** Deduplicated internal link clusters */
    internalLinks: {
        localities: Array<{ name: string; path: string }>;
        techParks: Array<{ name: string; path: string }>;
        blogs: Array<{ title: string; path: string }>;
        propertyPages: Array<{ name: string; path: string }>;
    };
    /** Complete Next.js App Router metadata object */
    metadata: Metadata;
    /** Unified JSON-LD @graph schema bundle */
    schema: Record<string, unknown>;
    /** Breadcrumb navigation array */
    breadcrumb: Array<{ name: string; path: string }>;
    /** Automatically generated Table of Contents */
    tableOfContents: BlogTocItem[];
    /** Article authorship metadata */
    author: {
        name: string;
        type: 'Organization' | 'Person';
        role?: string;
    };
    /** ISO timestamp of last update */
    updatedDate: string;
    /** Estimated reading time in minutes */
    estimatedReadingTime: number;
}
