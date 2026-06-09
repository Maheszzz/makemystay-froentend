#!/usr/bin/env node
/**
 * Validate sitemap URL health for crawl-critical XML files.
 *
 * Examples:
 *   node scripts/validate-sitemap-urls.mjs --sitemap public/sitemap-localities.xml --base http://localhost:3000
 *   node scripts/validate-sitemap-urls.mjs --sitemap https://makemystay.ai/sitemap-properties.xml --sample 100
 */
import { readFileSync } from 'fs';

const args = process.argv.slice(2);

function argValue(name, fallback) {
    const idx = args.indexOf(name);
    return idx >= 0 ? args[idx + 1] : fallback;
}

function argValues(name) {
    const values = [];
    for (let i = 0; i < args.length; i += 1) {
        if (args[i] === name && args[i + 1]) values.push(args[i + 1]);
    }
    return values;
}

const sitemapTargets = args.includes('--sitemap')
    ? argValues('--sitemap')
    : ['public/sitemap-localities.xml', 'public/sitemap-properties.xml'];
const baseOverride = argValue('--base', '');
const sample = Number(argValue('--sample', '0')) || 0;
const concurrency = Math.max(1, Math.min(20, Number(argValue('--concurrency', '8')) || 8));
const timeoutMs = Math.max(1000, Number(argValue('--timeout', '15000')) || 15000);

async function readXml(target) {
    if (/^https?:\/\//i.test(target)) {
        const res = await fetch(target, { headers: { Accept: 'application/xml,text/xml,*/*' } });
        if (!res.ok) throw new Error(`Failed to fetch ${target}: ${res.status}`);
        return res.text();
    }
    return readFileSync(target, 'utf8');
}

function urlsFromXml(xml) {
    return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1].trim());
}

function withBaseOverride(url) {
    if (!baseOverride) return url;
    const parsed = new URL(url);
    return `${baseOverride.replace(/\/+$/, '')}${parsed.pathname}${parsed.search}`;
}

async function checkUrl(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(withBaseOverride(url), {
            method: 'GET',
            redirect: 'manual',
            headers: { 'User-Agent': 'MakeMyStay-SitemapValidator/1.0' },
            signal: controller.signal,
        });
        const location = res.headers.get('location') || '';
        return { url, status: res.status, location };
    } catch (error) {
        return { url, status: 0, error: error instanceof Error ? error.message : String(error) };
    } finally {
        clearTimeout(timer);
    }
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

let allUrls = [];
for (const target of sitemapTargets.filter(Boolean)) {
    const xml = await readXml(target);
    allUrls.push(...urlsFromXml(xml));
}
allUrls = [...new Set(allUrls)];
if (sample > 0) allUrls = allUrls.slice(0, sample);

const results = await mapLimited(allUrls, concurrency, checkUrl);
const failures = results.filter((r) => r.status < 200 || r.status >= 400);
const redirects = results.filter((r) => r.status >= 300 && r.status < 400);

console.log(`Checked ${results.length} sitemap URLs (${failures.length} failures, ${redirects.length} redirects).`);
for (const r of [...failures, ...redirects].slice(0, 100)) {
    const detail = r.error ? ` ${r.error}` : r.location ? ` -> ${r.location}` : '';
    console.log(`${r.status} ${r.url}${detail}`);
}

if (failures.length > 0) process.exit(1);
