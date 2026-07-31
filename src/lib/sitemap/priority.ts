/**
 * Automated Sitemap & Indexing Engine: Priority Calculator
 * Calculates SEO XML priority (0.0 to 1.0) based on URL hierarchy and page significance.
 */

import type { SitemapCategory } from './changeFrequency';

/**
 * Returns the recommended XML priority score for a given sitemap category and path.
 */
export function resolvePriority(category: SitemapCategory, path: string): number {
    const cleanPath = path.toLowerCase().replace(/\/+$/, '');

    // 1. Home root
    if (cleanPath === '' || cleanPath === '/') {
        return 1.0;
    }

    // 2. Primary directory hubs
    if (
        cleanPath === '/pg/bangalore' ||
        cleanPath === '/rent/bangalore' ||
        cleanPath === '/properties' ||
        cleanPath === '/blog'
    ) {
        return 0.95;
    }

    // 3. Category & slug-based rules
    switch (category) {
        case 'locality':
            return 0.9;
        case 'property':
        case 'rent':
        case 'landing':
            return 0.85;
        case 'blog':
        case 'buy':
        case 'category':
            return 0.8;
        case 'office':
            return 0.75;
        case 'static':
        default:
            return 0.7;
    }
}
