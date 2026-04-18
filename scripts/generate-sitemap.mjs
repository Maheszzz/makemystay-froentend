/**
 * Generates public/sitemap.xml from static routes + locality hubs + blog + live property detail pages.
 * Run after build: node scripts/generate-sitemap.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const BASE = 'https://makemystay.ai';

const STATIC_PATHS = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/contact-us', priority: '0.85', changefreq: 'monthly' },
    { path: '/properties', priority: '0.9', changefreq: 'daily' },
    { path: '/pg', priority: '0.95', changefreq: 'daily' },
    { path: '/pg/bangalore', priority: '0.96', changefreq: 'daily' },
    { path: '/pg/hyderabad', priority: '0.94', changefreq: 'daily' },
    { path: '/pg/pune', priority: '0.94', changefreq: 'daily' },
    { path: '/pg-with-wifi', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-with-food', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-with-ac', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-vs-flat-bangalore', priority: '0.8', changefreq: 'monthly' },
    { path: '/rent', priority: '0.85', changefreq: 'daily' },
    { path: '/rent/bangalore', priority: '0.93', changefreq: 'daily' },
    { path: '/rent/hyderabad', priority: '0.92', changefreq: 'daily' },
    { path: '/rent/pune', priority: '0.92', changefreq: 'daily' },
    // /buy and /plots omitted while inventory is thin (pages use noindex); city hubs remain via loop where needed.
    { path: '/faq', priority: '0.75', changefreq: 'monthly' },
    { path: '/about', priority: '0.78', changefreq: 'monthly' },
    { path: '/how-we-verify', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/quick-pay', priority: '0.6', changefreq: 'monthly' },
    { path: '/schedule-demo', priority: '0.7', changefreq: 'monthly' },
];

const locJson = JSON.parse(readFileSync(join(root, 'src/data/pg-locations.json'), 'utf8'));

const BLOG_SLUGS = [
    'how-to-choose-pg-in-bangalore',
    'pg-rent-vs-flat-rent-bangalore',
    'best-pg-areas-bangalore-it-pros',
    'pg-deposits-notice-period-guide',
    'safety-guide-female-pg-bangalore',
    'rental-agreement-bangalore',
    'tenant-acquisition-24-hours',
    'dynamic-pricing-coliving-revenue',
    'bangalore-rental-laws-compliance',
    'ai-vs-brokers-real-estate-future',
    'emerging-rental-hotspots-bangalore-2027'
];

function titleToSlug(title = '') {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function tokenizeSlugSource(value = '') {
    return value
        .toLowerCase()
        .replace(/\bin\b/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function buildPropertySeoSlug(property) {
    const orderedTokens = [
        ...tokenizeSlugSource(property.property_name),
        ...tokenizeSlugSource(property.property_type),
        ...tokenizeSlugSource(property.location),
    ];
    const deduped = orderedTokens.filter((token, index) => orderedTokens.indexOf(token) === index);
    return deduped.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '') || property.slug || titleToSlug(property.property_name || '');
}

function buildPropertyDetailPath(property) {
    const id = String(property.id || '').trim();
    const slug = buildPropertySeoSlug(property);
    const category = (property.category || '').toLowerCase();
    const typeLower = (property.property_type || '').toLowerCase();
    const isPgType = ['pg', 'hostel', 'coliving'].some(t => typeLower.includes(t));
    
    const prefix = (isPgType || category === 'pg') ? 'pg' : (category === 'rent' ? 'rent' : 'property');
    return slug ? `/${prefix}/${id}-${slug}` : `/${prefix}/${id}`;
}

function resolveApiBase() {
    const raw = (process.env.VITE_API_BASE_URL || process.env.VITE_API_URL || '/api/v1').trim();
    if (!raw) return `${BASE}/api/v1`;
    if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, '');
    if (raw.startsWith('/')) return `${BASE}${raw}`.replace(/\/+$/, '');
    return `${BASE}/${raw}`.replace(/\/+$/, '');
}

function urlEntry(loc, priority, changefreq) {
    const lastmod = new Date().toISOString();
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

async function fetchAllProperties() {
    const apiBase = resolveApiBase();
    const rows = [];
    const limit = 100;
    let skip = 0;
    let total = Infinity;

    while (skip < total) {
        const url = `${apiBase}/realty/properties?skip=${skip}&limit=${limit}&sort_by=newest`;
        const response = await fetch(url, {
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch property sitemap rows from ${url}: ${response.status}`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        total = typeof payload?.total === 'number' ? payload.total : items.length;
        rows.push(...items);

        if (items.length === 0) break;
        skip += items.length;
    }

    return rows.filter((row) => row && row.id);
}

let body = '';
for (const s of STATIC_PATHS) {
    const loc = s.path === '/' ? BASE : `${BASE}${s.path}`;
    body += urlEntry(loc, s.priority, s.changefreq);
}

for (const row of locJson) {
    body += urlEntry(`${BASE}/pg/${row.slug}`, '0.85', 'weekly');
    
    // Programmatic Hubs (v2 SEO)
    const hubSlug = row.slug === 'btm' ? 'btm-layout' : row.slug;
    body += urlEntry(`${BASE}/pg-in-${hubSlug}`, '0.92', 'daily');
    
    // Hyper-Long-Tail Price Tiers
    body += urlEntry(`${BASE}/pg-in-${hubSlug}-under-10000`, '0.88', 'weekly');
    body += urlEntry(`${BASE}/pg-in-${hubSlug}-under-15000`, '0.88', 'weekly');
    
    // Top intent hubs for rentals — canonical `/rent/{slug}` (legacy `/rent-in-*` redirects in app + public/_redirects)
    const rentAreas = ['whitefield', 'marathahalli', 'btm', 'koramangala', 'hsr-layout', 'electronic-city', 'indiranagar', 'bellandur', 'hebbal', 'jp-nagar', 'bannerghatta-road', 'sarjapur-road'];
    if (rentAreas.includes(row.slug)) {
        body += urlEntry(`${BASE}/rent/${row.slug}`, '0.90', 'daily');
    }
}

body += urlEntry(`${BASE}/flats-in-bangalore`, '0.90', 'daily');

for (const slug of BLOG_SLUGS) {
    body += urlEntry(`${BASE}/blog/${slug}`, '0.72', 'monthly');
}

let propertyCount = 0;
try {
    const properties = await fetchAllProperties();
    for (const property of properties) {
        body += urlEntry(`${BASE}${buildPropertyDetailPath(property)}`, '0.88', 'daily');
    }
    propertyCount = properties.length;
} catch (error) {
    console.warn(`Property sitemap generation skipped: ${error instanceof Error ? error.message : String(error)}`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}</urlset>
`;

const outPublic = join(root, 'public/sitemap.xml');
writeFileSync(outPublic, xml);
const outDist = join(root, 'dist/sitemap.xml');
if (existsSync(join(root, 'dist'))) {
    writeFileSync(outDist, xml);
}
const n = STATIC_PATHS.length + locJson.length + BLOG_SLUGS.length + propertyCount;
console.log(`Wrote ${outPublic}${existsSync(join(root, 'dist')) ? ` and ${outDist}` : ''} (${n} URLs)`);
