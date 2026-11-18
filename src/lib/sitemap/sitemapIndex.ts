/**
 * Automated Sitemap & Indexing Engine: XML Sitemap Index Builder
 * Formats standards-compliant XML sitemap index files (<sitemapindex>)
 * referencing all specialized category and split sitemaps.
 */

import { SITE_URL } from '@/lib/siteConfig';
import { escapeXml } from './sitemapBuilder';
import { generateAllSitemapUrls, type SitemapCategory } from './urlGenerator';
import { splitSitemapEntries } from './sitemapBuilder';

export interface SitemapIndexEntry {
    /** Absolute canonical URL to child sitemap file */
    loc: string;
    /** ISO 8601 date string e.g. "2026-05-15" */
    lastmod: string;
}

/**
 * Formats an array of SitemapIndexEntry items into an XML <sitemapindex> string.
 */
export function buildXmlSitemapIndex(sitemaps: SitemapIndexEntry[]): string {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    for (const item of sitemaps) {
        lines.push('  <sitemap>');
        lines.push(`    <loc>${escapeXml(item.loc)}</loc>`);
        lines.push(`    <lastmod>${escapeXml(item.lastmod)}</lastmod>`);
        lines.push('  </sitemap>');
    }

    lines.push('</sitemapindex>');
    return lines.join('\n');
}

/**
 * Generates the master sitemap index referencing all specialized and split sitemaps:
 * - locality-sitemap.xml
 * - property-sitemap.xml
 * - blog-sitemap.xml
 * - landing-sitemap.xml
 * - office-sitemap.xml
 * - rent-sitemap.xml
 * - buy-sitemap.xml
 * - static-sitemap.xml
 * - image-sitemap.xml
 */
export function generateMasterSitemapIndex(): { xml: string; sitemaps: SitemapIndexEntry[] } {
    const allUrls = generateAllSitemapUrls();
    const categories: { key: SitemapCategory; name: string }[] = [
        { key: 'locality', name: 'locality-sitemap' },
        { key: 'property', name: 'property-sitemap' },
        { key: 'blog', name: 'blog-sitemap' },
        { key: 'landing', name: 'landing-sitemap' },
        { key: 'office', name: 'office-sitemap' },
        { key: 'rent', name: 'rent-sitemap' },
        { key: 'buy', name: 'buy-sitemap' },
        { key: 'static', name: 'static-sitemap' }
    ];

    const indexEntries: SitemapIndexEntry[] = [];
    const base = SITE_URL.replace(/\/+$/, '');

    for (const cat of categories) {
        const matching = allUrls.filter(u => u.category === cat.key || (cat.key === 'static' && (u.category === 'home' || u.category === 'category')));
        if (matching.length === 0) continue;

        const batches = splitSitemapEntries(matching);
        if (batches.length === 1) {
            indexEntries.push({
                loc: `${base}/${cat.name}.xml`,
                lastmod: '2026-05-15'
            });
        } else {
            for (let i = 0; i < batches.length; i++) {
                indexEntries.push({
                    loc: `${base}/${cat.name}-${i + 1}.xml`,
                    lastmod: '2026-05-15'
                });
            }
        }
    }

    // Include Image Sitemap if any images exist
    const hasImages = allUrls.some(u => u.images && u.images.length > 0);
    if (hasImages) {
        indexEntries.push({
            loc: `${base}/image-sitemap.xml`,
            lastmod: '2026-05-15'
        });
    }

    const xml = buildXmlSitemapIndex(indexEntries);
    return { xml, sitemaps: indexEntries };
}
