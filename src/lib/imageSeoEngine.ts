import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export type ImageLayoutPreset = 'hero' | 'card' | 'grid' | 'full' | 'thumbnail';

export interface ImageSeoContext {
    propertyName?: string;
    locality?: string;
    city?: string;
    category?: string;
    roomType?: string;
    index?: number;
    totalImages?: number;
    isVerified?: boolean;
    customAlt?: string;
    customTitle?: string;
    customCaption?: string;
    author?: string;
    license?: string;
}

export interface ImageSeoInput {
    url: string;
    context?: ImageSeoContext;
    layout?: ImageLayoutPreset;
    priority?: boolean;
    width?: number;
    height?: number;
    customSizes?: string;
    customWidths?: number[];
}

export interface ImageObjectSchema {
    '@context': string;
    '@type': 'ImageObject';
    url: string;
    contentUrl: string;
    name?: string;
    caption?: string;
    description?: string;
    width?: number;
    height?: number;
    author?: {
        '@type': 'Person' | 'Organization';
        name: string;
    };
    license?: string;
    representativeOfPage?: boolean;
}

export interface ImageGallerySchema {
    '@context': string;
    '@type': 'ImageGallery';
    name: string;
    description?: string;
    numberOfItems: number;
    itemListElement: Array<{
        '@type': 'ListItem';
        position: number;
        item: Omit<ImageObjectSchema, '@context'>;
    }>;
}

export interface ImageSeoResult {
    url: string;
    alt: string;
    title: string;
    caption: string;
    srcSet: string;
    sizes: string;
    loading: 'lazy' | 'eager';
    decoding: 'async';
    fetchPriority: 'auto' | 'high' | 'low';
    width?: number;
    height?: number;
    structuredData: ImageObjectSchema;
}

export interface ImageSeoAuditResult {
    score: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'F';
    passed: string[];
    warnings: string[];
    issues: string[];
}

const DEFAULT_RESPONSIVE_WIDTHS: Record<ImageLayoutPreset, number[]> = {
    hero: [640, 800, 1024, 1280, 1600, 1920],
    full: [640, 800, 1024, 1280, 1600],
    card: [320, 400, 640, 800, 1024],
    grid: [320, 480, 640, 800],
    thumbnail: [150, 300, 400],
};

const DEFAULT_RESPONSIVE_SIZES: Record<ImageLayoutPreset, string> = {
    hero: '100vw',
    full: '(max-width: 1024px) 100vw, 1280px',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    grid: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
    thumbnail: '(max-width: 640px) 50vw, 200px',
};

function resolveAbsoluteUrl(url: string | undefined): string {
    if (!url || !url.trim()) return '';
    const u = url.trim();
    if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) {
        return u;
    }
    if (u.startsWith('/')) {
        return `${SITE_URL}${u}`;
    }
    return `${SITE_URL}/${u}`;
}

/**
 * Automatically generates contextual, keyword-rich SEO alt text for images.
 */
export function generateImageAltText(context: ImageSeoContext = {}): string {
    if (context.customAlt?.trim()) {
        return context.customAlt.trim();
    }

    const tokens: string[] = [];
    if (context.roomType) {
        tokens.push(context.roomType.trim());
    } else if (context.category) {
        tokens.push(`${context.category.trim()} stay`);
    } else {
        tokens.push('Property view');
    }

    if (context.propertyName) {
        tokens.push(`at ${context.propertyName.trim()}`);
    }

    if (context.locality) {
        tokens.push(`in ${context.locality.trim()}`);
    }

    if (
        context.city &&
        (!context.locality ||
            !context.locality.toLowerCase().includes(context.city.toLowerCase()))
    ) {
        tokens.push(context.city.trim());
    }

    if (context.isVerified) {
        tokens.push('- Verified Stay');
    }

    const base = tokens.join(' ').replace(/\s+/g, ' ').trim();
    if (context.index !== undefined && context.index > 0) {
        return `${base} - photo ${context.index + 1}`;
    }
    return base || `Verified PG accommodation in Bangalore on ${SITE_NAME}`;
}

/**
 * Automatically generates clean hover title tooltip text.
 */
export function generateImageTitleText(context: ImageSeoContext = {}): string {
    if (context.customTitle?.trim()) {
        return context.customTitle.trim();
    }

    const name = context.propertyName ? context.propertyName.trim() : SITE_NAME;
    const location = [context.locality, context.city].filter(Boolean).join(', ');
    const suffix = location ? ` (${location})` : '';
    const photoIdx =
        context.index !== undefined && context.index > 0 ? ` [Photo ${context.index + 1}]` : '';

    return `${name}${suffix}${photoIdx}`.trim();
}

/**
 * Automatically generates informative figure caption text.
 */
export function generateImageCaptionText(context: ImageSeoContext = {}): string {
    if (context.customCaption?.trim()) {
        return context.customCaption.trim();
    }

    const name = context.propertyName ? context.propertyName.trim() : SITE_NAME;
    const room = context.roomType ? `${context.roomType.trim()} at ` : '';
    const loc = [context.locality, context.city || 'Bangalore'].filter(Boolean).join(', ');
    const verified = context.isVerified ? ' (Verified Property)' : '';
    const idx =
        context.index !== undefined && context.totalImages && context.totalImages > 1
            ? ` — Photo ${context.index + 1} of ${context.totalImages}`
            : '';

    return `${room}${name}, ${loc}${verified}${idx}`.trim();
}

/**
 * Calculates responsive srcSet string with CDN/Unsplash resizing support.
 */
export function generateResponsiveSrcSet(
    url: string,
    layout: ImageLayoutPreset = 'card',
    customWidths?: number[],
): string {
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
        return '';
    }

    const widths = customWidths && customWidths.length > 0 ? customWidths : DEFAULT_RESPONSIVE_WIDTHS[layout];
    const isUnsplash = url.includes('images.unsplash.com');

    return widths
        .map((w) => {
            let resized = url;
            if (isUnsplash) {
                const base = url.split('?')[0];
                resized = `${base}?auto=format,compress&fit=crop&q=80&w=${w}`;
            }
            return `${resized} ${w}w`;
        })
        .join(', ');
}

/**
 * Builds Schema.org ImageObject JSON-LD for rich snippets and SEO indexing.
 */
export function buildImageObjectJsonLd(
    url: string,
    context: ImageSeoContext = {},
    dimensions?: { width?: number; height?: number },
    representativeOfPage = false,
): ImageObjectSchema {
    const absUrl = resolveAbsoluteUrl(url);
    const alt = generateImageAltText(context);
    const title = generateImageTitleText(context);
    const caption = generateImageCaptionText(context);

    const schema: ImageObjectSchema = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        url: absUrl,
        contentUrl: absUrl,
        name: title,
        caption: caption,
        description: alt,
    };

    if (dimensions?.width && dimensions.width > 0) {
        schema.width = dimensions.width;
    }
    if (dimensions?.height && dimensions.height > 0) {
        schema.height = dimensions.height;
    }
    if (context.author?.trim()) {
        schema.author = {
            '@type': 'Person',
            name: context.author.trim(),
        };
    }
    if (context.license?.trim()) {
        schema.license = context.license.trim();
    }
    if (representativeOfPage || (context.index !== undefined && context.index === 0)) {
        schema.representativeOfPage = true;
    }

    return schema;
}

/**
 * Builds Schema.org ImageGallery JSON-LD for multi-image presentations.
 */
export function buildImageGalleryJsonLd(
    name: string,
    images: Array<{ url: string; context?: ImageSeoContext; width?: number; height?: number }>,
    description?: string,
): ImageGallerySchema {
    const itemListElement = images.map((img, index) => {
        const obj = buildImageObjectJsonLd(img.url, { ...img.context, index }, {
            width: img.width,
            height: img.height,
        });
        const { '@context': _, ...itemWithoutContext } = obj;
        return {
            '@type': 'ListItem' as const,
            position: index + 1,
            item: itemWithoutContext,
        };
    });

    const schema: ImageGallerySchema = {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: name.trim(),
        numberOfItems: images.length,
        itemListElement,
    };

    if (description?.trim()) {
        schema.description = description.trim();
    }

    return schema;
}

/**
 * Core Image SEO Engine function: Generates all SEO attributes, responsive sizes, lazy loading, and schema.
 */
export function generateImageSeoMeta(input: ImageSeoInput): ImageSeoResult {
    const context = input.context || {};
    const layout = input.layout || 'card';

    const absUrl = resolveAbsoluteUrl(input.url);
    const alt = generateImageAltText(context);
    const title = generateImageTitleText(context);
    const caption = generateImageCaptionText(context);
    const srcSet = generateResponsiveSrcSet(absUrl, layout, input.customWidths);
    const sizes = input.customSizes || DEFAULT_RESPONSIVE_SIZES[layout];

    const priority = input.priority === true;
    const loading = priority ? 'eager' : 'lazy';
    const fetchPriority = priority ? 'high' : 'auto';

    const structuredData = buildImageObjectJsonLd(
        absUrl,
        context,
        { width: input.width, height: input.height },
        priority || (context.index !== undefined && context.index === 0),
    );

    return {
        url: absUrl,
        alt,
        title,
        caption,
        srcSet,
        sizes,
        loading,
        decoding: 'async',
        fetchPriority,
        width: input.width,
        height: input.height,
        structuredData,
    };
}

/**
 * Diagnostic tool: Analyzes and scores an image's SEO quality out of 100.
 */
export function analyzeImageSeoScore(result: ImageSeoResult): ImageSeoAuditResult {
    const passed: string[] = [];
    const warnings: string[] = [];
    const issues: string[] = [];
    let score = 100;

    if (!result.alt || !result.alt.trim()) {
        issues.push('Missing alt text attribute.');
        score -= 30;
    } else if (result.alt.length < 15) {
        warnings.push('Alt text is too short (< 15 characters). Add more descriptive locality/property context.');
        score -= 10;
    } else {
        passed.push('Alt text is descriptive and keyword-aware.');
    }

    if (result.title) {
        passed.push('Title tooltip attribute is present.');
    } else {
        warnings.push('Title tooltip attribute is missing.');
        score -= 5;
    }

    if (result.caption) {
        passed.push('Figure caption text is generated.');
    } else {
        warnings.push('Figure caption text is missing.');
        score -= 5;
    }

    if (result.srcSet && result.srcSet.includes('w')) {
        passed.push('Responsive srcSet attribute configured.');
    } else {
        warnings.push('Responsive srcSet is missing.');
        score -= 10;
    }

    if (result.loading === 'lazy' || result.fetchPriority === 'high') {
        passed.push(`Optimal performance strategy configured (${result.loading}, fetchpriority=${result.fetchPriority}).`);
    } else {
        warnings.push('Loading strategy not explicitly optimized.');
        score -= 10;
    }

    if (result.width && result.height) {
        passed.push('Explicit width and height provided (zero layout shift).');
    } else {
        warnings.push('Missing explicit width and height dimensions; could cause Cumulative Layout Shift (CLS).');
        score -= 15;
    }

    if (result.structuredData && result.structuredData['@type'] === 'ImageObject') {
        passed.push('Valid Schema.org ImageObject structured data present.');
    } else {
        issues.push('ImageObject structured data is missing.');
        score -= 20;
    }

    const boundedScore = Math.max(0, Math.min(100, score));
    let grade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'F';
    if (boundedScore >= 95) grade = 'A+';
    else if (boundedScore >= 85) grade = 'A';
    else if (boundedScore >= 75) grade = 'B';
    else if (boundedScore >= 60) grade = 'C';

    return {
        score: boundedScore,
        grade,
        passed,
        warnings,
        issues,
    };
}
