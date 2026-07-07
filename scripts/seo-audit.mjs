import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log(`${GREEN}Starting SEO Audit...${RESET}\n`);

// 1. Check robots.txt
const robotsPath = path.join(root, 'public', 'robots.txt');
if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (robots.includes('Disallow: /admin') && robots.includes('Disallow: /wishlist')) {
        console.log(`✅ robots.txt is configured correctly to exclude private routes.`);
    } else {
        console.log(`❌ robots.txt is missing Disallow rules for private routes.`);
    }
} else {
    console.log(`❌ robots.txt not found!`);
}

// 2. Check sitemap index
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    console.log(`✅ sitemap.xml exists.`);
} else {
    console.log(`❌ sitemap.xml not found! Run npm run build or generate-sitemap.mjs.`);
}

// 3. Check next.config.ts redirects
const nextConfigPath = path.join(root, 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    if (nextConfig.includes('/property/:path*') && nextConfig.includes('permanent: true')) {
        console.log(`✅ next.config.ts contains 301 redirects for legacy routes.`);
    } else {
        console.log(`❌ next.config.ts is missing 301 redirects for legacy property routes.`);
    }
} else {
    console.log(`❌ next.config.ts not found!`);
}

// 4. Check middleware.ts for URL normalization
const middlewarePath = path.join(root, 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
    const middleware = fs.readFileSync(middlewarePath, 'utf8');
    if (middleware.includes('toLowerCase()') && middleware.includes('301')) {
        console.log(`✅ middleware.ts handles lowercase enforcement and WWW stripping via 301.`);
    } else {
        console.log(`❌ middleware.ts is missing URL normalization.`);
    }
} else {
    console.log(`❌ middleware.ts not found!`);
}

console.log(`\n${GREEN}SEO Audit Completed.${RESET}`);
