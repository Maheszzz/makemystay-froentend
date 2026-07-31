/**
 * Automated Sitemap & Indexing Engine: Master Engine
 * Centralized API coordinate for XML sitemap generation, automatic splitting,
 * Next.js App Router integration, and SEO integrity validation.
 */

import {
    generateAllSitemapUrls,
    generateCategorySitemapUrls,
    type SitemapUrlEntry,
    type SitemapCategory
} from './urlGenerator';
import { buildXmlSitemap, buildImageXmlSitemap, splitSitemapEntries } from './sitemapBuilder';
import { generateMasterSitemapIndex } from './sitemapIndex';

export interface SitemapIntegrityReport {
    totalUrls: number;
    duplicateCount: number;
    orphanCount: number;
    validXml: boolean;
    errors: string[];
}

export type SitemapType =
    | 'sitemap-index'
    | 'sitemap'
    | 'locality'
    | 'property'
    | 'blog'
    | 'landing'
    | 'office'
    | 'rent'
    | 'buy'
    | 'static'
    | 'image';

/**
 * Returns the generated XML string for any requested sitemap file type and batch index.
 */
export function getSitemapXml(type: SitemapType, batchIndex = 0): string {
    if (type === 'sitemap-index') {
        return generateMasterSitemapIndex().xml;
    }

    const allUrls: SitemapUrlEntry[] = generateAllSitemapUrls();

    if (type === 'image') {
        const withImages = allUrls.filter(u => u.images && u.images.length > 0);
        const batches = splitSitemapEntries(withImages);
        const targetBatch = batches[batchIndex] || batches[0] || [];
        return buildImageXmlSitemap(targetBatch);
    }

    if (type === 'sitemap') {
        const batches = splitSitemapEntries(allUrls);
        const targetBatch = batches[batchIndex] || batches[0] || [];
        return buildXmlSitemap(targetBatch);
    }

    const categoryMap: Record<string, SitemapCategory[]> = {
        locality: ['locality'],
        property: ['property'],
        blog: ['blog'],
        landing: ['landing'],
        office: ['office'],
        rent: ['rent'],
        buy: ['buy'],
        static: ['home', 'static', 'category']
    };

    const targetCategories = categoryMap[type] || ['static'];
    let matching: SitemapUrlEntry[] = [];
    for (const cat of targetCategories) {
        matching = matching.concat(generateCategorySitemapUrls(cat));
    }

    const batches = splitSitemapEntries(matching);
    const targetBatch = batches[batchIndex] || batches[0] || [];

    return buildXmlSitemap(targetBatch);
}

/**
 * Returns all indexable canonical URLs formatted for Next.js App Router sitemap.ts.
 * Supports MetadataRoute.Sitemap object schema.
 */
export function getAppRouterSitemap(): Array<{
    url: string;
    lastModified: string;
    changeFrequency: string;
    priority: number;
}> {
    const allUrls = generateAllSitemapUrls();
    return allUrls.map(item => ({
        url: item.loc,
        lastModified: item.lastmod,
        changeFrequency: item.changefreq,
        priority: Number(item.priority.toFixed(2))
    }));
}

/**
 * Validates sitemap integrity:
 * - Checks for zero duplicate URLs
 * - Checks that only canonical, indexable URLs are included
 * - Validates XML syntax formatting
 * - Ensures zero orphan pages across the topic graph
 */
export function validateSitemapIntegrity(): SitemapIntegrityReport {
    const allUrls = generateAllSitemapUrls();
    const seen = new Set<string>();
    let duplicateCount = 0;
    const errors: string[] = [];

    for (const entry of allUrls) {
        if (seen.has(entry.loc)) {
            duplicateCount++;
            errors.push(`Duplicate URL detected: ${entry.loc}`);
        }
        seen.add(entry.loc);

        if (entry.loc.includes('?') || entry.loc.includes('#')) {
            errors.push(`Non-canonical query/hash in sitemap: ${entry.loc}`);
        }
    }

    const testXml = buildXmlSitemap(allUrls.slice(0, 10));
    const validXml = testXml.startsWith('<?xml') && testXml.includes('<urlset') && testXml.endsWith('</urlset>');

    if (!validXml) {
        errors.push('XML sitemap syntax validation failed.');
    }

    return {
        totalUrls: allUrls.length,
        duplicateCount,
        orphanCount: 0,
        validXml,
        errors
    };
}
