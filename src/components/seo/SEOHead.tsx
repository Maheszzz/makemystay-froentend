import { Helmet } from 'react-helmet-async';
import type { HelmetSEOProps } from '@/lib/seo';

interface SEOHeadProps extends HelmetSEOProps {
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
            {ogImage && <meta property="og:image" content={ogImage} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
        </Helmet>
    );
}
