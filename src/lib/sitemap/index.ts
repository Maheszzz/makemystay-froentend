/**
 * Automated Sitemap & Indexing Engine (src/lib/sitemap)
 *
 * Centralized, relationship-driven XML sitemap engine supporting:
 * - Dynamic URL discovery across Home, Locality, Property, Rent, Buy,
 *   Office, Tech Park Landing, Blog, and Category pages.
 * - Standards-compliant XML and Google Image sitemaps.
 * - Automatic URL limit batching and splitting.
 * - Next.js App Router sitemap integration.
 * - Canonical-only SEO integrity validation.
 */

export * from './changeFrequency';
export * from './priority';
export * from './urlGenerator';
export * from './sitemapBuilder';
export * from './sitemapIndex';
export * from './sitemapEngine';
