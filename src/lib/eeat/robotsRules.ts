/**
 * EEAT & Search Console Optimization Engine: Centralized Robots Rules
 * Formats standardized robots meta tags and HTTP X-Robots-Tag headers
 * supporting index, follow, archive, snippet, image preview, and video preview.
 */

export interface RobotsDirectives {
    index: boolean;
    follow: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
}

export interface RobotsTagOutput {
    /** Meta name="robots" content attribute string e.g. "index, follow, max-image-preview:large..." */
    metaContent: string;
    /** HTTP header value compatible with X-Robots-Tag */
    headerValue: string;
    /** Strongly typed directives object */
    directives: RobotsDirectives;
}

export type RobotsPreset =
    | 'index-follow'
    | 'noindex-nofollow'
    | 'index-nofollow'
    | 'noindex-follow'
    | 'archive-only';

/**
 * Builds standard robots directives from presets and optional overrides.
 */
export function generateRobotsDirectives(
    preset: RobotsPreset = 'index-follow',
    overrides?: Partial<RobotsDirectives>
): RobotsTagOutput {
    let base: RobotsDirectives;

    switch (preset) {
        case 'noindex-nofollow':
            base = {
                index: false,
                follow: false,
                noarchive: true
            };
            break;
        case 'noindex-follow':
            base = {
                index: false,
                follow: true,
                noarchive: true
            };
            break;
        case 'index-nofollow':
            base = {
                index: true,
                follow: false,
                maxImagePreview: 'large',
                maxSnippet: -1,
                maxVideoPreview: -1
            };
            break;
        case 'archive-only':
            base = {
                index: false,
                follow: true,
                noarchive: false
            };
            break;
        case 'index-follow':
        default:
            base = {
                index: true,
                follow: true,
                maxImagePreview: 'large',
                maxSnippet: -1,
                maxVideoPreview: -1
            };
            break;
    }

    const merged: RobotsDirectives = { ...base, ...overrides };

    const tokens: string[] = [
        merged.index ? 'index' : 'noindex',
        merged.follow ? 'follow' : 'nofollow'
    ];

    if (merged.noarchive) tokens.push('noarchive');
    if (merged.nosnippet) tokens.push('nosnippet');

    if (!merged.nosnippet && merged.maxSnippet !== undefined) {
        tokens.push(`max-snippet:${merged.maxSnippet}`);
    }
    if (merged.maxImagePreview) {
        tokens.push(`max-image-preview:${merged.maxImagePreview}`);
    }
    if (merged.maxVideoPreview !== undefined) {
        tokens.push(`max-video-preview:${merged.maxVideoPreview}`);
    }

    const metaContent = tokens.join(', ');

    return {
        metaContent,
        headerValue: metaContent,
        directives: merged
    };
}
