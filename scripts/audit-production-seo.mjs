#!/usr/bin/env node
/**
 * Production SEO crawl for sitemap-discovered URLs.
 * Checks live status, redirects, canonical, robots, H1/title/meta, and JSON-LD.
 */
import { writeFileSync } from 'fs';

const args = process.argv.slice(2);
const BASE = 'https://makemystay.ai';

function argValue(name, fallback) {
    const idx = args.indexOf(name);
    return idx >= 0 ? args[idx + 1] : fallback;
}

const startSitemap = argValue('--sitemap', `${BASE}/sitemap.xml`);
const sample = Number(argValue('--sample', '0')) || 0;
const concurrency = Math.max(1, Math.min(20, Number(argValue('--concurrency', '8')) || 8));
const timeoutMs = Math.max(1000, Number(argValue('--timeout', '20000')) || 20000);
const outFile = argValue('--out', '');

function locs(xml) {
    return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1].trim());
}

function isSitemapIndex(xml) {
    return /<sitemapindex[\s>]/i.test(xml);
}

async function fetchText(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'User-Agent': 'MakeMyStay-ProductionSeoAudit/1.0',
                Accept: 'text/html,application/xml,text/xml,*/*',
                ...(options.headers || {}),
            },
            signal: controller.signal,
        });
        return {
            ok: true,
            status: res.status,
            url: res.url,
            finalUrl: res.url,
            headers: Object.fromEntries(res.headers.entries()),
            text: await res.text(),
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            url,
            finalUrl: url,
            headers: {},
            text: '',
            error: error instanceof Error ? error.message : String(error),
        };
    } finally {
        clearTimeout(timer);
    }
}

async function discoverUrls(sitemapUrl, seen = new Set()) {
    if (seen.has(sitemapUrl)) return [];
    seen.add(sitemapUrl);
    const res = await fetchText(sitemapUrl);
    if (!res.ok || res.status >= 400) {
        return [{ type: 'sitemap-error', url: sitemapUrl, status: res.status, error: res.error }];
    }
    const entries = locs(res.text);
    if (!isSitemapIndex(res.text)) return entries.map((url) => ({ type: 'url', sitemap: sitemapUrl, url }));
    const nested = await Promise.all(entries.map((url) => discoverUrls(url, seen)));
    return nested.flat();
}

function matchOne(html, re) {
    return html.match(re)?.[1]?.trim() || '';
}

function htmlSignals(html, requestedUrl, finalUrl) {
    const canonical = matchOne(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
        || matchOne(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
    const title = matchOne(html, /<title[^>]*>([\s\S]*?)<\/title>/i).replace(/\s+/g, ' ');
    const description = matchOne(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)
        || matchOne(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
    const robots = matchOne(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i)
        || matchOne(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["'][^>]*>/i);
    const h1 = matchOne(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
    const jsonLdCount = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi)].length;
    const looksError = /Something went wrong|Application error|Internal Server Error|Bad Gateway/i.test(html);
    const canonicalPath = canonical ? new URL(canonical, finalUrl).pathname + new URL(canonical, finalUrl).search : '';
    const requestedPath = new URL(requestedUrl).pathname + new URL(requestedUrl).search;
    return {
        canonical,
        canonicalMatchesRequested: canonical ? canonicalPath === requestedPath : false,
        title,
        description,
        robots,
        h1,
        jsonLdCount,
        looksError,
    };
}

async function crawlOne(entry) {
    if (entry.type !== 'url') return entry;
    const res = await fetchText(entry.url, { redirect: 'follow' });
    const contentType = res.headers['content-type'] || '';
    const html = contentType.includes('text/html') || res.text.includes('<html');
    return {
        type: 'page',
        sitemap: entry.sitemap,
        url: entry.url,
        status: res.status,
        finalUrl: res.finalUrl,
        redirected: res.finalUrl !== entry.url,
        error: res.error || '',
        ...(html ? htmlSignals(res.text, entry.url, res.finalUrl) : {}),
    };
}

async function mapLimited(items, limit, worker) {
    const out = new Array(items.length);
    let next = 0;
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (next < items.length) {
                const current = next++;
                out[current] = await worker(items[current]);
            }
        }),
    );
    return out;
}

let entries = await discoverUrls(startSitemap);
const discoveryErrors = entries.filter((e) => e.type === 'sitemap-error');
entries = entries.filter((e) => e.type === 'url');
const deduped = [...new Map(entries.map((e) => [e.url, e])).values()];
const crawlTargets = sample > 0 ? deduped.slice(0, sample) : deduped;
const results = await mapLimited(crawlTargets, concurrency, crawlOne);

const summary = {
    discoveredUrls: deduped.length,
    crawledUrls: results.length,
    discoveryErrors: discoveryErrors.length,
    status: {},
    redirected: results.filter((r) => r.redirected).length,
    missingCanonical: results.filter((r) => r.status === 200 && !r.canonical).length,
    canonicalMismatch: results.filter((r) => r.status === 200 && r.canonical && !r.canonicalMatchesRequested).length,
    noindex: results.filter((r) => /noindex/i.test(r.robots || '')).length,
    missingTitle: results.filter((r) => r.status === 200 && !r.title).length,
    missingDescription: results.filter((r) => r.status === 200 && !r.description).length,
    missingH1: results.filter((r) => r.status === 200 && !r.h1).length,
    missingJsonLd: results.filter((r) => r.status === 200 && !r.jsonLdCount).length,
    errorLookingHtml: results.filter((r) => r.status === 200 && r.looksError).length,
};
for (const r of results) summary.status[r.status] = (summary.status[r.status] || 0) + 1;

const report = { summary, discoveryErrors, results };
console.log(JSON.stringify(summary, null, 2));
const issues = results.filter(
    (r) =>
        r.status >= 400 ||
        r.status === 0 ||
        r.redirected ||
        (r.status === 200 && (!r.canonical || !r.canonicalMatchesRequested || !r.title || !r.description || !r.h1 || !r.jsonLdCount || r.looksError)),
);
for (const r of issues.slice(0, 80)) {
    console.log(`${r.status} ${r.url}${r.redirected ? ` -> ${r.finalUrl}` : ''}`);
    if (r.canonical && !r.canonicalMatchesRequested) console.log(`  canonical: ${r.canonical}`);
    if (!r.title) console.log('  missing title');
    if (!r.description) console.log('  missing description');
    if (!r.h1) console.log('  missing h1');
    if (!r.jsonLdCount) console.log('  missing json-ld');
    if (r.looksError) console.log('  error-looking html');
}
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
if (results.some((r) => r.status >= 500 || r.status === 0)) process.exit(2);
