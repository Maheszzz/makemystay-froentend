/**
 * After `next build`, assemble a deployable `dist/` folder for EC2 rsync + Node.
 * Run: node scripts/prepare-next-deploy.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const standalone = join(root, '.next/standalone');
const out = join(root, 'dist');

if (!existsSync(standalone)) {
    console.error('Missing .next/standalone — run `next build` first.');
    process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

cpSync(standalone, out, { recursive: true });
cpSync(join(root, '.next/static'), join(out, '.next/static'), { recursive: true });
cpSync(join(root, 'public'), join(out, 'public'), { recursive: true });

// Ensure no legacy static sitemap*.xml files exist in public/ or dist/public/ so Next's dynamic /sitemap.xml is served
for (const dir of [join(root, 'public'), join(out, 'public')]) {
    if (existsSync(dir)) {
        for (const f of readdirSync(dir)) {
            if (/^sitemap.*\.xml$/i.test(f)) {
                rmSync(join(dir, f), { force: true });
            }
        }
    }
}

const heroAvif = join(out, 'public/images/blog/hero-sunset.avif');
if (!existsSync(heroAvif)) {
    console.error('Missing dist hero AVIF — run `npm run optimize:hero` before build.');
    process.exit(1);
}

writeFileSync(
    join(out, 'start.sh'),
    `#!/bin/sh
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT=\${PORT:-3000}
exec node server.js
`,
    { mode: 0o755 },
);

console.log('Prepared dist/ for Next standalone (node server.js, PORT=3000).');
