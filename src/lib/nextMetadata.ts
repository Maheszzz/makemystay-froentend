import type { Metadata } from 'next';
import { absoluteUrl, buildPageSEO, type PageSEOInput } from '@/lib/seo';
import {
    SITE_AUTHOR,
    SITE_NAME,
    SITE_PUBLISHER,
    THEME_COLOR,
    TWITTER_SITE_HANDLE,
} from '@/lib/siteConfig';

export type PageMetadataOptions = {
    openGraphType?: 'website' | 'article';
};

/** Maps shared `PageSEOInput` / `buildPageSEO` output to Next.js App Router metadata (SSR `<head>`). */
export function pageSeoToMetadata(input: PageSEOInput, options?: PageMetadataOptions): Metadata {
    const seo = buildPageSEO(input);
    const ogType = options?.openGraphType ?? 'website';
    return {
        title: { absolute: seo.title },
        description: seo.description,
        keywords: seo.keywords,
        authors: [{ name: SITE_AUTHOR }],
        publisher: SITE_PUBLISHER,
        category: 'real estate',
        alternates: { canonical: seo.canonicalHref },
        robots: seo.noindex
            ? { index: false, follow: true, googleBot: { index: false, follow: true } }
            : {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                    'max-video-preview': -1,
                },
            },
        other: {
            'theme-color': THEME_COLOR,
            language: 'en-IN',
        },
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: seo.canonicalHref,
            siteName: SITE_NAME,
            locale: 'en_IN',
            type: ogType,
            images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            site: TWITTER_SITE_HANDLE,
            title: seo.title,
            description: seo.description,
            images: seo.ogImage ? [seo.ogImage] : undefined,
        },
    };
}

/**
 * For any URL requested with query parameters (?city=...&food=true&price=high...),
 * enforce `<meta name="robots" content="noindex, follow">` and ensure the canonical
 * tag points to the clean path without parameters.
 */
export function applyQueryNoindex(
    metadata: Metadata,
    searchParams?: Record<string, string | string[] | undefined> | null,
    cleanPath?: string,
): Metadata {
    if (!searchParams || Object.keys(searchParams).length === 0) {
        return metadata;
    }
    const existingCanonical =
        typeof metadata.alternates?.canonical === 'string'
            ? metadata.alternates.canonical.split('?')[0]
            : undefined;
    const canonical = cleanPath ? absoluteUrl(cleanPath) : existingCanonical;

    return {
        ...metadata,
        robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
        },
        ...(canonical
            ? {
                  alternates: {
                      ...metadata.alternates,
                      canonical,
                  },
              }
            : {}),
    };
}
