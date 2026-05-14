import { Helmet } from 'react-helmet-async';
import type { HelmetSEOProps } from '@/lib/seo';
import { OG_LOCALE, SITE_NAME, TWITTER_SITE_HANDLE } from '@/lib/siteConfig';

interface SEOHeadProps extends HelmetSEOProps {
    prerenderStatus?: number;
    prerenderHeaders?: Record<string, string>;
    ogType?: 'website' | 'article';
}

/**
 * Centralized meta + Open Graph + Twitter for listing/marketing pages.
 */
export function SEOHead({
    title,
    description,
    canonicalHref,
    ogImage,
    noindex,
    keywords,
    prerenderStatus,
    prerenderHeaders,
    ogType = 'website',
}: SEOHeadProps) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords ? <meta name="keywords" content={keywords} /> : null}
            <link rel="canonical" href={canonicalHref} />
            <meta name="robots" content={noindex ? "noindex, follow" : "max-image-preview:large"} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalHref} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content={OG_LOCALE} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={TWITTER_SITE_HANDLE} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
            
            {/* Prerender.io specific tags */}
            {prerenderStatus && (
                <meta name="prerender-status-code" content={prerenderStatus.toString()} />
            )}
            {prerenderHeaders && Object.entries(prerenderHeaders).map(([key, value]) => (
                <meta key={key} name="prerender-header" content={`${key}: ${value}`} />
            ))}
        </Helmet>
    );
}
