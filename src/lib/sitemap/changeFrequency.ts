/**
 * Automated Sitemap & Indexing Engine: Change Frequency Rule Engine
 * Assigns XML sitemap changefreq values based on content velocity and type.
 */

export type ChangeFreq =
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';

export type SitemapCategory =
    | 'home'
    | 'property'
    | 'locality'
    | 'rent'
    | 'buy'
    | 'office'
    | 'landing'
    | 'blog'
    | 'static'
    | 'category';

/**
 * Returns the recommended XML changefreq for a given sitemap category.
 */
export function resolveChangeFrequency(category: SitemapCategory): ChangeFreq {
    switch (category) {
        case 'home':
        case 'property':
        case 'locality':
        case 'rent':
        case 'buy':
            return 'daily';
        case 'landing':
        case 'blog':
        case 'category':
            return 'weekly';
        case 'office':
        case 'static':
        default:
            return 'monthly';
    }
}
