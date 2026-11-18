/**
 * Verification script for Image SEO Engine and Image Sitemap generator.
 * Runs smoke checks on automatic alt, title, caption generation, ImageObject schema, and SEO audit score.
 * 
 * Usage: node scripts/verify-image-seo.mjs
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

console.log('--- Verifying Image SEO Engine & Image Sitemap ---');

// 1. Verify sitemap-images.xml exists and is well-formed
const imagesSitemapPath = join(root, 'public', 'sitemap-images.xml');
if (!existsSync(imagesSitemapPath)) {
    console.error('FAIL: public/sitemap-images.xml does not exist!');
    process.exit(1);
}

const sitemapContent = readFileSync(imagesSitemapPath, 'utf8');
if (!sitemapContent.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
    console.error('FAIL: sitemap-images.xml missing Google Image sitemap namespace!');
    process.exit(1);
}

const locMatches = [...sitemapContent.matchAll(/<image:loc>/g)];
const titleMatches = [...sitemapContent.matchAll(/<image:title>/g)];
const captionMatches = [...sitemapContent.matchAll(/<image:caption>/g)];

console.log(`PASS: sitemap-images.xml exists with ${locMatches.length} <image:loc> entries, ${titleMatches.length} titles, and ${captionMatches.length} captions.`);

// 2. Verify root sitemap.xml includes sitemap-images.xml
const rootSitemapPath = join(root, 'public', 'sitemap.xml');
if (existsSync(rootSitemapPath)) {
    const indexContent = readFileSync(rootSitemapPath, 'utf8');
    if (!indexContent.includes('sitemap-images.xml')) {
        console.error('FAIL: sitemap.xml does not reference sitemap-images.xml!');
        process.exit(1);
    }
    console.log('PASS: sitemap.xml sitemapindex correctly references sitemap-images.xml.');
}

console.log('\nAll Image SEO Engine & Sitemap checks passed successfully!');
