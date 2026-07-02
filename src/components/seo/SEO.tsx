'use client';

import { Helmet } from 'react-helmet-async';
import { JsonLd } from './JsonLd';
import {
    GEO_PLACENAME,
    GEO_POSITION,
    GEO_REGION,
    OG_LOCALE,
    SITE_AUTHOR,
    SITE_NAME,
    SITE_PUBLISHER,
    THEME_COLOR,
    TWITTER_SITE_HANDLE,
} from '@/lib/siteConfig';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    image?: string;
    type?: string;
    schema?: Record<string, any> | Array<Record<string, any>>;
    noindex?: boolean;
}

export function SEO({
    title,
    description,
    keywords,
    canonical,
    image,
    type = 'website',
    schema,
    noindex = false,
}: SEOProps) {
    const formattedTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const robotsContent = noindex 
        ? 'noindex, follow' 
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    return (
        <>
            <Helmet>
                <title>{formattedTitle}</title>
                <meta name="description" content={description} />
                <meta name="robots" content={robotsContent} />
                <meta name="theme-color" content={THEME_COLOR} />
                <meta name="author" content={SITE_AUTHOR} />
                <meta name="publisher" content={SITE_PUBLISHER} />
                <meta name="language" content="en-IN" />
                <meta name="geo.region" content={GEO_REGION} />
                <meta name="geo.placename" content={GEO_PLACENAME} />
                <meta name="geo.position" content={GEO_POSITION} />
                <meta name="ICBM" content={GEO_POSITION.replace(';', ', ')} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content={type} />
                <meta property="og:title" content={formattedTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:site_name" content={SITE_NAME} />
                <meta property="og:locale" content={OG_LOCALE} />
                {canonical && <meta property="og:url" content={canonical} />}
                {image && <meta property="og:image" content={image} />}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={TWITTER_SITE_HANDLE} />
                <meta name="twitter:title" content={formattedTitle} />
                <meta name="twitter:description" content={description} />
                {image && <meta name="twitter:image" content={image} />}

                {/* Canonical */}
                {canonical && <link rel="canonical" href={canonical} />}

                {/* Keywords */}
                {keywords && <meta name="keywords" content={keywords} />}
            </Helmet>
            {schema && (
                <JsonLd
                    id="dynamic-seo-schema"
                    data={schema}
                />
            )}
        </>
    );
}
