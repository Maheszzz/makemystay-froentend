/**
 * Generates public/sitemap.xml from static routes + pg-locations.json + blog slugs.
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
    { path: '/pg-with-wifi', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-with-food', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-with-ac', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-vs-flat-bangalore', priority: '0.8', changefreq: 'monthly' },
    { path: '/rent', priority: '0.85', changefreq: 'daily' },
    { path: '/buy', priority: '0.85', changefreq: 'daily' },
    { path: '/plots', priority: '0.8', changefreq: 'weekly' },
    { path: '/faq', priority: '0.75', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/quick-pay', priority: '0.6', changefreq: 'monthly' },
    { path: '/schedule-demo', priority: '0.7', changefreq: 'monthly' },
];

const locJson = JSON.parse(readFileSync(join(root, 'src/data/pg-locations.json'), 'utf8'));

const BLOG_SLUGS = ['how-to-choose-pg-in-bangalore', 'pg-rent-vs-flat-rent-bangalore'];

function urlEntry(loc, priority, changefreq) {
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

let body = '';
for (const s of STATIC_PATHS) {
    const loc = s.path === '/' ? BASE : `${BASE}${s.path}`;
    body += urlEntry(loc, s.priority, s.changefreq);
}

for (const row of locJson) {
    body += urlEntry(`${BASE}/pg/${row.slug}`, '0.85', 'weekly');
}

for (const slug of BLOG_SLUGS) {
    body += urlEntry(`${BASE}/blog/${slug}`, '0.72', 'monthly');
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
const n = STATIC_PATHS.length + locJson.length + BLOG_SLUGS.length;
console.log(`Wrote ${outPublic}${existsSync(join(root, 'dist')) ? ` and ${outDist}` : ''} (${n} URLs)`);
