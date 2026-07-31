/**
 * EEAT & Search Console Optimization Engine: Automatic Indexing Decision Engine
 * Automatically determines index, noindex, and canonical rules based on
 * duplicate pages, parameterized URLs, search filters, empty listings, 404s,
 * and thin content to prevent soft 404s and crawl budget waste in Search Console.
 */

import { SITE_URL } from '@/lib/siteConfig';
import { generateRobotsDirectives, type RobotsTagOutput } from './robotsRules';

export interface IndexingDecision {
    shouldIndex: boolean;
    shouldFollow: boolean;
    canonicalUrl: string;
    robots: RobotsTagOutput;
    reason: string;
}

export interface IndexingContext {
    /** Relative pathname e.g. "/pg/whitefield" or "/pg-in-whitefield" */
    pathname: string;
    /** Query parameters e.g. { gender: "men", sort: "price-asc" } */
    searchParams?: Record<string, string | undefined>;
    /** Whether page is rendering a 404 Not Found state */
    is404?: boolean;
    /** Whether locality/filter returned zero available properties */
    hasEmptyListings?: boolean;
    /** Total word count of main page content */
    wordCount?: number;
    /** Whether page is known to be a duplicate of another canonical path */
    isDuplicate?: boolean;
    /** Explicit canonical override if known */
    overrideCanonical?: string;
}

/**
 * Strips query parameters and trailing slashes to compute a clean canonical path.
 */
function cleanCanonicalPath(pathname: string): string {
    const withoutQuery = pathname.split('?')[0].split('#')[0];
    const clean = withoutQuery.replace(/\/+$/, '');
    // Auto-map legacy /pg-in-[slug] duplicates to canonical /pg/[slug]
    if (clean.startsWith('/pg-in-')) {
        return clean.replace(/^\/pg-in-/, '/pg/');
    }
    return clean || '/';
}

/**
 * Automatically makes the Indexing Decision for any page context.
 */
export function decideIndexingRules(context: IndexingContext): IndexingDecision {
    const cleanPath = cleanCanonicalPath(context.pathname);
    const canonicalUrl = context.overrideCanonical || `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;

    // 1. 404 Not Found State
    if (context.is404) {
        return {
            shouldIndex: false,
            shouldFollow: false,
            canonicalUrl,
            robots: generateRobotsDirectives('noindex-nofollow'),
            reason: '404 Not Found state - excluded from index.'
        };
    }

    // 2. Explicit Duplicate or legacy /pg-in-* path
    if (context.isDuplicate || context.pathname.startsWith('/pg-in-')) {
        return {
            shouldIndex: false,
            shouldFollow: true,
            canonicalUrl,
            robots: generateRobotsDirectives('noindex-follow'),
            reason: 'Duplicate URL pattern (/pg-in-* or mirror) - canonicalized to primary path.'
        };
    }

    // 3. Search parameters / filters (e.g. ?sort=price, ?gender=men, ?page=2)
    const params = context.searchParams || {};
    const hasParams = Object.keys(params).some(k => params[k] !== undefined && params[k] !== '');
    if (hasParams || context.pathname.startsWith('/search')) {
        return {
            shouldIndex: false,
            shouldFollow: true,
            canonicalUrl,
            robots: generateRobotsDirectives('noindex-follow'),
            reason: 'Parameterized search/filter URL - noindex to avoid duplicate content in GSC.'
        };
    }

    // 4. Empty listings (prevents soft 404 penalties in Search Console)
    if (context.hasEmptyListings) {
        return {
            shouldIndex: false,
            shouldFollow: true,
            canonicalUrl,
            robots: generateRobotsDirectives('noindex-follow'),
            reason: 'Locality has 0 active listings - noindexed to prevent Soft 404 in Search Console.'
        };
    }

    // 5. Thin content check (< 150 words)
    if (context.wordCount !== undefined && context.wordCount < 150) {
        return {
            shouldIndex: false,
            shouldFollow: true,
            canonicalUrl,
            robots: generateRobotsDirectives('noindex-follow'),
            reason: `Thin content detected (${context.wordCount} words < 150 threshold).`
        };
    }

    // 6. Default: High-quality canonical indexable page
    return {
        shouldIndex: true,
        shouldFollow: true,
        canonicalUrl,
        robots: generateRobotsDirectives('index-follow'),
        reason: 'Valid canonical page meeting EEAT and quality standards.'
    };
}
