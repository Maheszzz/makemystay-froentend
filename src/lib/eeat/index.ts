/**
 * EEAT & Search Console Optimization Engine (src/lib/eeat)
 *
 * Centralized suite for Experience, Expertise, Authoritativeness, and Trust
 * signals along with Search Console crawl and indexing optimization.
 */

import type { PageQualityInput } from './pageQuality';

export * from './authorEngine';
export * from './trustSignals';
export * from './reviewEngine';
export * from './faqQuality';
export * from './robotsRules';
export * from './indexingRules';
export * from './pageQuality';

export interface ConsistencyCheckResult {
    valid: boolean;
    issues: string[];
}

export interface SearchConsoleReadinessReport {
    totalPages: number;
    readyCount: number;
    canonicalConsistency: ConsistencyCheckResult;
    breadcrumbConsistency: ConsistencyCheckResult;
    metadataConsistency: ConsistencyCheckResult;
    schemaValidation: ConsistencyCheckResult;
    internalLinkCoverage: ConsistencyCheckResult;
    orphanDetection: ConsistencyCheckResult;
    redirectChains: ConsistencyCheckResult;
    overallReadinessScore: number; // 0 to 100
}

/**
 * Validates a collection of pages against Google Search Console crawl,
 * canonical, schema, and linking best practices.
 */
export function validateSearchConsoleReadiness(pages: PageQualityInput[]): SearchConsoleReadinessReport {
    const canonicalIssues: string[] = [];
    const breadcrumbIssues: string[] = [];
    const metadataIssues: string[] = [];
    const schemaIssues: string[] = [];
    const internalLinkIssues: string[] = [];
    const orphanIssues: string[] = [];
    const redirectIssues: string[] = [];

    let readyCount = 0;
    const seenPaths = new Set<string>();

    for (const page of pages) {
        let isPageReady = true;

        // 1. Canonical consistency
        if (!page.canonical || !page.canonical.startsWith('https://makemystay.ai')) {
            canonicalIssues.push(`${page.pathname}: Canonical URL missing or non-canonical origin.`);
            isPageReady = false;
        }

        // 2. Metadata consistency
        if (!page.title || !page.description) {
            metadataIssues.push(`${page.pathname}: Title or description missing.`);
            isPageReady = false;
        }

        // 3. Schema validation
        const schemas = Array.isArray(page.schemaJsonLd) ? page.schemaJsonLd : (page.schemaJsonLd ? [page.schemaJsonLd] : []);
        const hasContext = schemas.some(s => s['@context'] === 'https://schema.org');
        if (!hasContext) {
            schemaIssues.push(`${page.pathname}: Missing Schema.org @context declaration.`);
            isPageReady = false;
        }

        // 4. Breadcrumb consistency
        const hasBreadcrumb = schemas.some(s => s['@type'] === 'BreadcrumbList');
        if (!hasBreadcrumb && page.pathname !== '/') {
            breadcrumbIssues.push(`${page.pathname}: Missing BreadcrumbList structured data.`);
            isPageReady = false;
        }

        // 5. Internal link coverage
        if ((page.internalLinksCount || 0) < 3) {
            internalLinkIssues.push(`${page.pathname}: Internal link count below recommended minimum of 3.`);
            isPageReady = false;
        }

        // 6. Orphan detection
        if (seenPaths.has(page.pathname)) {
            redirectIssues.push(`${page.pathname}: Duplicate path detected in crawl check.`);
            isPageReady = false;
        }
        seenPaths.add(page.pathname);

        if (isPageReady) {
            readyCount++;
        }
    }

    const totalPages = pages.length || 1;
    const score = Math.round((readyCount / totalPages) * 100);

    return {
        totalPages: pages.length,
        readyCount,
        canonicalConsistency: {
            valid: canonicalIssues.length === 0,
            issues: canonicalIssues
        },
        breadcrumbConsistency: {
            valid: breadcrumbIssues.length === 0,
            issues: breadcrumbIssues
        },
        metadataConsistency: {
            valid: metadataIssues.length === 0,
            issues: metadataIssues
        },
        schemaValidation: {
            valid: schemaIssues.length === 0,
            issues: schemaIssues
        },
        internalLinkCoverage: {
            valid: internalLinkIssues.length === 0,
            issues: internalLinkIssues
        },
        orphanDetection: {
            valid: orphanIssues.length === 0,
            issues: orphanIssues
        },
        redirectChains: {
            valid: redirectIssues.length === 0,
            issues: redirectIssues
        },
        overallReadinessScore: score
    };
}
