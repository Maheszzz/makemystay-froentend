#!/usr/bin/env node
/**
 * Build-time sitemap & 410 verification check.
 *
 * Boots the built Next.js server on a local port, fetches /sitemap.xml,
 * verifies every single URL in the sitemap returns HTTP 200 (no redirects,
 * no 404s, no 500s, no query params, no spaces, no /_next/ paths), and
 * verifies all 25 permanently removed URLs return HTTP 410 Gone.
 *
 * Exits with code 1 on any failure (failing the build).
 */
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const PORT = Number(process.env.VERIFY_SITEMAP_PORT || 3099);
const BASE = `http://127.0.0.1:${PORT}`;
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

const GONE_URLS = [
    '/pg/7-hills-1rk-marathahalli-bangalore',
    '/pg/baner',
    '/pg/bilekahalli-under-15000',
    '/pg/kharadi',
    '/pg/madhapur',
    '/pg/madhapur-under-10000',
    '/pg/munnekolala',
    '/pg/nagawara-under-10000',
    '/pg/sgr-enclave',
    '/pg/urban-living',
    '/pg-for-boys-in-baner',
    '/pg-for-boys-in-mysore-road',
    '/pg-for-boys-in-nayandahalli',
    '/pg-for-girls-in-hebbal-kempapura',
    '/pg-for-girls-in-hinjewadi',
    '/pg-for-girls-in-hitech-city',
    '/pg-for-girls-in-kaikondrahalli',
    '/pg-for-girls-in-koramangala-4th-block',
    '/pg-for-girls-in-madhapur',
    '/pg-for-girls-in-mysore-road',
    '/pg-for-girls-in-richmond-town',
    '/pg-for-girls-in-tumkur-road',
    '/pg-for-girls-in-wakad',
    '/pg-in-madhapur-under-10000',
    '/rent/cv%20raman%20nagar',
];

const GONE_SET = new Set([
    ...GONE_URLS,
    '/rent/cv raman nagar',
]);

async function waitForServer(maxWaitMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
        try {
            const res = await fetch(`${BASE}/robots.txt`, { redirect: 'manual' });
            if (res.status > 0) return;
        } catch {
            // Server not ready yet
        }
        await new Promise((r) => setTimeout(r, 400));
    }
    throw new Error(`Next.js server did not become ready on ${BASE} within ${maxWaitMs}ms`);
}

async function fetchStatus(pathOrUrl) {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${BASE}${pathOrUrl}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            method: 'GET',
            redirect: 'manual',
            headers: { 'User-Agent': 'MakeMyStay-BuildSitemapCheck/1.0' },
            signal: controller.signal,
        });
        return {
            url,
            status: res.status,
            location: res.headers.get('location') || '',
        };
    } catch (err) {
        return {
            url,
            status: 0,
            error: err instanceof Error ? err.message : String(err),
        };
    } finally {
        clearTimeout(timer);
    }
}

async function mapLimited(items, limit, worker) {
    const out = new Array(items.length);
    let idx = 0;
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (idx < items.length) {
                const current = idx++;
                out[current] = await worker(items[current]);
            }
        }),
    );
    return out;
}

function startServer() {
    const standaloneEntry = join(process.cwd(), '.next', 'standalone', 'server.js');
    const env = {
        ...process.env,
        PORT: String(PORT),
        HOSTNAME: '127.0.0.1',
        NODE_ENV: 'production',
    };

    if (existsSync(standaloneEntry)) {
        return spawn(process.execPath, [standaloneEntry], {
            env,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
    }

    const nextBin = join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
    return spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(PORT)], {
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
}

async function main() {
    const server = startServer();
    let serverErr = '';
    server.stderr?.on('data', (d) => {
        serverErr += d.toString();
    });

    try {
        await waitForServer();

        // 1. Fetch and validate /sitemap.xml
        const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { redirect: 'manual' });
        if (sitemapRes.status !== 200) {
            throw new Error(`/sitemap.xml returned ${sitemapRes.status} (expected 200)`);
        }
        const xml = await sitemapRes.text();
        const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1].trim());
        if (locs.length === 0) {
            throw new Error('/sitemap.xml contains 0 <loc> URLs');
        }

        const hygieneErrors = [];
        const localPaths = [];
        for (const loc of locs) {
            let parsed;
            try {
                parsed = new URL(loc);
            } catch {
                hygieneErrors.push(`Invalid URL in sitemap: ${loc}`);
                continue;
            }
            const pathname = parsed.pathname;
            let decoded = pathname;
            try {
                decoded = decodeURIComponent(pathname);
            } catch {
                // ignore
            }
            if (parsed.search) hygieneErrors.push(`Query param in sitemap: ${loc}`);
            if (/\s/.test(loc) || /%20/i.test(loc) || /\s/.test(decoded)) {
                hygieneErrors.push(`Space in sitemap URL: ${loc}`);
            }
            if (pathname.startsWith('/_next/')) hygieneErrors.push(`/_next/ path in sitemap: ${loc}`);
            if (GONE_SET.has(pathname.toLowerCase()) || GONE_SET.has(decoded.toLowerCase())) {
                hygieneErrors.push(`410 Gone URL still in sitemap: ${loc}`);
            }
            localPaths.push(pathname);
        }

        if (hygieneErrors.length > 0) {
            console.error('Sitemap hygiene failures:\n' + hygieneErrors.join('\n'));
            process.exitCode = 1;
            return;
        }

        // 2. Fetch every sitemap URL and require HTTP 200
        const results = await mapLimited(localPaths, CONCURRENCY, fetchStatus);
        const non200 = results.filter((r) => r.status !== 200);
        if (non200.length > 0) {
            console.error(`FAIL: ${non200.length}/${results.length} sitemap URLs did not return 200:`);
            for (const r of non200) {
                console.error(`  ${r.status} ${r.url}${r.location ? ` -> ${r.location}` : ''}${r.error ? ` (${r.error})` : ''}`);
            }
            process.exitCode = 1;
            return;
        }
        console.log(`PASS: All ${results.length} sitemap URLs returned HTTP 200.`);

        // 3. Verify all 25 Step 1 URLs return HTTP 410 Gone
        const goneResults = await mapLimited(GONE_URLS, CONCURRENCY, fetchStatus);
        const badGone = goneResults.filter((r) => r.status !== 410);
        if (badGone.length > 0) {
            console.error(`FAIL: ${badGone.length}/${goneResults.length} removed URLs did not return 410:`);
            for (const r of badGone) {
                console.error(`  ${r.status} ${r.url}${r.location ? ` -> ${r.location}` : ''}`);
            }
            process.exitCode = 1;
            return;
        }
        console.log(`PASS: All ${goneResults.length} removed URLs returned HTTP 410 Gone.`);
    } finally {
        try {
            server.kill('SIGTERM');
        } catch {
            // ignore
        }
        if (process.exitCode && serverErr.trim()) {
            console.error('Server stderr:\n' + serverErr.slice(-1500));
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
