import { generateImageTitleText, generateImageCaptionText } from './imageSeoEngine';

export interface SitemapImageRecord {
    url: string;
    title?: string;
    caption?: string;
    geoLocation?: string;
    license?: string;
}

export interface ImageSitemapEntityOptions {
    defaultGeoLocation?: string;
    defaultLicense?: string;
    maxImages?: number;
}

const DEFAULT_OPTIONS: Required<ImageSitemapEntityOptions> = {
    defaultGeoLocation: 'Bangalore, Karnataka, India',
    defaultLicense: 'https://makemystay.ai/terms',
    maxImages: 50,
};

/**
 * Escapes XML text for safe sitemap serialization.
 */
export function escapeXmlString(value: string | number | boolean | undefined): string {
    if (value === undefined || value === null) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Normalizes an image URL to be absolute for XML sitemaps.
 */
export function normalizeSitemapImageUrl(url: string | undefined, baseUrl = 'https://makemystay.ai'): string {
    if (!url || !url.trim() || url.startsWith('data:') || url.startsWith('blob:')) {
        return '';
    }
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    if (trimmed.startsWith('/')) {
        return `${baseUrl.replace(/\/+$/, '')}${trimmed}`;
    }
    return `${baseUrl.replace(/\/+$/, '')}/${trimmed}`;
}

/**
 * Generates an XML `<image:image>` block for a sitemap entry.
 */
export function serializeSitemapImageTag(record: SitemapImageRecord): string {
    const loc = normalizeSitemapImageUrl(record.url);
    if (!loc) return '';

    return [
        '  <image:image>',
        `    <image:loc>${escapeXmlString(loc)}</image:loc>`,
        record.caption ? `    <image:caption>${escapeXmlString(record.caption)}</image:caption>` : '',
        record.title ? `    <image:title>${escapeXmlString(record.title)}</image:title>` : '',
        record.geoLocation ? `    <image:geo_location>${escapeXmlString(record.geoLocation)}</image:geo_location>` : '',
        record.license ? `    <image:license>${escapeXmlString(record.license)}</image:license>` : '',
        '  </image:image>',
    ]
        .filter(Boolean)
        .join('\n');
}

/**
 * Extracts and formats sitemap image records from a property listing.
 */
export function extractPropertySitemapImages(
    property: {
        id?: string | number;
        title?: string;
        property_name?: string;
        location?: string;
        image?: string;
        images?: Array<string | { image_url?: string; title?: string; caption?: string }>;
        type?: string;
        property_type?: string;
    },
    options: ImageSitemapEntityOptions = {},
): SitemapImageRecord[] {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const results: SitemapImageRecord[] = [];
    const name = (property.title || property.property_name || 'PG Stay').trim();
    const loc = (property.location || 'Bangalore').trim();

    const addImg = (urlStr: string | undefined, index: number) => {
        if (!urlStr) return;
        const absUrl = normalizeSitemapImageUrl(urlStr);
        if (!absUrl) return;
        if (results.some((r) => r.url === absUrl)) return;

        const ctx = {
            propertyName: name,
            locality: loc,
            city: 'Bangalore',
            category: property.type || property.property_type || 'PG',
            index,
            isVerified: true,
        };

        results.push({
            url: absUrl,
            title: generateImageTitleText(ctx),
            caption: generateImageCaptionText(ctx),
            geoLocation: opts.defaultGeoLocation,
            license: opts.defaultLicense,
        });
    };

    if (property.image) {
        addImg(property.image, 0);
    }

    if (Array.isArray(property.images)) {
        for (let i = 0; i < property.images.length && results.length < opts.maxImages; i++) {
            const raw = property.images[i];
            const urlStr = typeof raw === 'string' ? raw : raw?.image_url;
            addImg(urlStr, i);
        }
    }

    return results;
}

/**
 * Wraps XML body with Google Image sitemap namespace.
 */
export function wrapImageSitemapUrlset(body: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}</urlset>\n`;
}
