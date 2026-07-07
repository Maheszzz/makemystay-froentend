#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SITEMAPS = ['public/sitemap-localities.xml', 'public/sitemap-properties.xml'];
const ADDITIONAL_URLS = [
    // Ensure we test the static hubs
    '/',
    '/pg',
    '/rent',
    '/buy',
    '/properties',
    '/pg-with-wifi',
    '/pg-single-room',
    '/flats-in-bangalore',
    '/1-bhk',
    '/about',
    '/office/rmz-ecoworld',
    // Edge cases
    '/services/contact-agent', // Should be noindex
    '/property/invalid-slug', // Should be 404 or noindex
];

async function fetchHtml(urlPath) {
    const url = `${BASE_URL}${urlPath}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            return { error: `HTTP ${res.status}`, status: res.status };
        }
        const html = await res.text();
        return { html, status: res.status };
    } catch (e) {
        return { error: e.message, status: 0 };
    }
}

function extractTags(html) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    
    // Find all JSON-LD scripts
    const jsonLdScripts = [];
    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
        try {
            jsonLdScripts.push(JSON.parse(match[1]));
        } catch(e) {
            jsonLdScripts.push({ error: "Invalid JSON-LD" });
        }
    }

    return {
        title: titleMatch ? titleMatch[1] : null,
        description: descMatch ? descMatch[1] : null,
        canonical: canonMatch ? canonMatch[1] : null,
        robots: robotsMatch ? robotsMatch[1] : null,
        ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
        ogDescription: ogDescMatch ? ogDescMatch[1] : null,
        ogImage: ogImageMatch ? ogImageMatch[1] : null,
        jsonLdCount: jsonLdScripts.length,
        jsonLdTypes: jsonLdScripts.map(j => j['@type']).join(', ')
    };
}

function parseSitemap(xmlPath) {
    if (!fs.existsSync(xmlPath)) return [];
    const xml = fs.readFileSync(xmlPath, 'utf8');
    const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m => m[1].trim());
    return urls.map(u => {
        try {
            return new URL(u).pathname;
        } catch(e) {
            return u;
        }
    });
}

async function run() {
    let urlsToCrawl = new Set(ADDITIONAL_URLS);
    
    SITEMAPS.forEach(s => {
        const sitemapUrls = parseSitemap(s);
        // Take a sample of 20 URLs from each sitemap to avoid crawling 500+ pages
        const sample = sitemapUrls.slice(0, 20);
        sample.forEach(u => urlsToCrawl.add(u));
    });

    const results = [];
    const urlArray = Array.from(urlsToCrawl);
    
    console.log(`Starting crawl of ${urlArray.length} URLs at ${BASE_URL}...`);
    
    for (let i = 0; i < urlArray.length; i++) {
        const url = urlArray[i];
        console.log(`[${i+1}/${urlArray.length}] Crawling ${url}`);
        
        const { html, status, error } = await fetchHtml(url);
        
        if (error) {
            results.push({ url, status, error });
            continue;
        }
        
        const tags = extractTags(html);
        results.push({ url, status, ...tags });
    }
    
    fs.writeFileSync('seo-audit-results.json', JSON.stringify(results, null, 2));
    console.log(`Audit complete. Results saved to seo-audit-results.json`);
    
    // Quick summary
    const missingTitles = results.filter(r => !r.title && !r.error);
    const noindexPages = results.filter(r => r.robots && r.robots.includes('noindex'));
    
    console.log(`\nSummary:`);
    console.log(`Total URLs Checked: ${results.length}`);
    console.log(`Errors: ${results.filter(r => r.error).length}`);
    console.log(`Missing Titles: ${missingTitles.length}`);
    console.log(`Noindex Pages: ${noindexPages.length}`);
}

run().catch(console.error);
