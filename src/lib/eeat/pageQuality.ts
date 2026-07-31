/**
 * EEAT & Search Console Optimization Engine: Page Quality Validator
 * Analyzes pages for missing H1, missing metadata, missing canonical,
 * missing schema, missing internal links, missing images, thin content,
 * duplicate sections, and weak EEAT to guarantee Search Console readiness.
 */

export interface PageQualityInput {
    pathname: string;
    h1?: string;
    title?: string;
    description?: string;
    canonical?: string;
    schemaJsonLd?: Record<string, any> | Record<string, any>[];
    internalLinksCount?: number;
    imagesCount?: number;
    wordCount?: number;
    hasAuthorBlock?: boolean;
    hasTrustSignals?: boolean;
    hasReviews?: boolean;
    sectionHeadings?: string[];
}

export interface PageQualityReport {
    pathname: string;
    isValid: boolean;
    score: number; // 0 to 100
    missingH1: boolean;
    missingMetadata: boolean;
    missingCanonical: boolean;
    missingSchema: boolean;
    missingInternalLinks: boolean;
    missingImages: boolean;
    thinContent: boolean;
    duplicateSections: boolean;
    weakEeat: boolean;
    issues: string[];
}

/**
 * Validates any generated page against EEAT and Search Console quality benchmarks.
 */
export function validatePageQuality(input: PageQualityInput): PageQualityReport {
    const issues: string[] = [];
    let penalty = 0;

    // 1. Missing H1
    const missingH1 = !input.h1 || input.h1.trim().length === 0;
    if (missingH1) {
        issues.push('Missing H1 tag: Page must have exactly one descriptive H1 heading.');
        penalty += 15;
    }

    // 2. Missing Metadata
    const missingMetadata = !input.title || !input.description || input.title.trim().length === 0 || input.description.trim().length === 0;
    if (missingMetadata) {
        issues.push('Missing Metadata: Title tag and meta description are required.');
        penalty += 20;
    }

    // 3. Missing Canonical
    const missingCanonical = !input.canonical || !input.canonical.startsWith('http');
    if (missingCanonical) {
        issues.push('Missing Canonical: Valid absolute canonical URL is required.');
        penalty += 15;
    }

    // 4. Missing Schema
    const schemas = Array.isArray(input.schemaJsonLd) ? input.schemaJsonLd : (input.schemaJsonLd ? [input.schemaJsonLd] : []);
    const missingSchema = schemas.length === 0;
    if (missingSchema) {
        issues.push('Missing Schema: Structured JSON-LD schema (@context schema.org) is required.');
        penalty += 15;
    }

    // 5. Missing Internal Links
    const linksCount = input.internalLinksCount || 0;
    const missingInternalLinks = linksCount < 3;
    if (missingInternalLinks) {
        issues.push(`Missing Internal Links: Found ${linksCount} links. Minimum 3 contextual internal links required.`);
        penalty += 10;
    }

    // 6. Missing Images
    const imagesCount = input.imagesCount || 0;
    const missingImages = imagesCount === 0;
    if (missingImages) {
        issues.push('Missing Images: Page should include at least 1 relevant visual or infographic.');
        penalty += 10;
    }

    // 7. Thin Content (< 300 words for landing pages, < 600 for blog articles)
    const minWords = input.pathname.startsWith('/blog') ? 600 : 300;
    const wordCount = input.wordCount || 500; // default passing if not checked
    const thinContent = wordCount < minWords;
    if (thinContent) {
        issues.push(`Thin Content: Page has ${wordCount} words (minimum ${minWords} required for ${input.pathname}).`);
        penalty += 25;
    }

    // 8. Duplicate Sections
    let duplicateSections = false;
    if (input.sectionHeadings && input.sectionHeadings.length > 0) {
        const seen = new Set<string>();
        for (const heading of input.sectionHeadings) {
            const norm = heading.toLowerCase().trim();
            if (seen.has(norm)) {
                duplicateSections = true;
                issues.push(`Duplicate Section Heading detected: "${heading}".`);
                penalty += 10;
                break;
            }
            seen.add(norm);
        }
    }

    // 9. Weak EEAT (Missing Author block on blogs, or missing trust signals/reviews on listings)
    const isBlog = input.pathname.startsWith('/blog');
    let weakEeat = false;
    if (isBlog && !input.hasAuthorBlock) {
        weakEeat = true;
        issues.push('Weak EEAT: Blog post is missing an Author/Reviewer EEAT credential block.');
        penalty += 15;
    } else if (!isBlog && !input.hasTrustSignals && !input.hasReviews) {
        weakEeat = true;
        issues.push('Weak EEAT: Page lacks verified trust badges or resident review ratings.');
        penalty += 10;
    }

    const score = Math.max(0, Math.min(100, 100 - penalty));
    const isValid = score >= 75 && !missingMetadata && !missingCanonical && !thinContent;

    return {
        pathname: input.pathname,
        isValid,
        score,
        missingH1,
        missingMetadata,
        missingCanonical,
        missingSchema,
        missingInternalLinks,
        missingImages,
        thinContent,
        duplicateSections,
        weakEeat,
        issues
    };
}
