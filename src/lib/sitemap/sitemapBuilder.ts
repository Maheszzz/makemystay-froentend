/**
 * Automated Sitemap & Indexing Engine: XML Builder & Splitter
 * Formats standards-compliant XML sitemaps and image sitemaps,
 * and automatically chunks URL arrays to respect sitemap URL limits.
 */

import type { SitemapUrlEntry } from './urlGenerator';

/**
 * Escapes XML reserved characters to produce valid XML text.
 */
export function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Formats a list of SitemapUrlEntry items into a standard XML <urlset> string.
 */
export function buildXmlSitemap(entries: SitemapUrlEntry[]): string {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    for (const entry of entries) {
        lines.push('  <url>');
        lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
        lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
        lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
        lines.push(`    <priority>${entry.priority.toFixed(2)}</priority>`);
        lines.push('  </url>');
    }

    lines.push('</urlset>');
    return lines.join('\n');
}

/**
 * Formats a list of SitemapUrlEntry items containing image metadata
 * into a Google Image Sitemap XML <urlset> string.
 */
export function buildImageXmlSitemap(entries: SitemapUrlEntry[]): string {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

    for (const entry of entries) {
        if (!entry.images || entry.images.length === 0) continue;
        lines.push('  <url>');
        lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
        for (const img of entry.images) {
            lines.push('    <image:image>');
            lines.push(`      <image:loc>${escapeXml(img.loc)}</image:loc>`);
            if (img.title) {
                lines.push(`      <image:title>${escapeXml(img.title)}</image:title>`);
            }
            if (img.caption) {
                lines.push(`      <image:caption>${escapeXml(img.caption)}</image:caption>`);
            }
            lines.push('    </image:image>');
        }
        lines.push('  </url>');
    }

    lines.push('</urlset>');
    return lines.join('\n');
}

/**
 * Automatically splits a large array of URL entries into batches
 * so that no individual XML sitemap exceeds the specified URL limit.
 * (Standard limit is 50,000 URLs; default here is 10,000 for safety).
 */
export function splitSitemapEntries(
    entries: SitemapUrlEntry[],
    maxUrls = 10000
): SitemapUrlEntry[][] {
    if (!entries || entries.length === 0) return [];
    if (entries.length <= maxUrls) return [entries];

    const batches: SitemapUrlEntry[][] = [];
    for (let i = 0; i < entries.length; i += maxUrls) {
        batches.push(entries.slice(i, i + maxUrls));
    }
    return batches;
}
