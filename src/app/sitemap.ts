import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 86400; // 24h — rarely changes

const base = SITE_URL.replace(/\/+$/, '');

/**
 * Lightweight sitemap index for /sitemap.xml.
 * Returns the child sitemaps that are already working. No API calls — cannot time out.
 * Next.js serialises this as a <sitemapindex> when it detects the sitemap() return type.
 *
 * NOTE: Next.js App Router sitemap() does NOT support sitemapindex natively.
 * We serve a plain sitemap with all static + rent/pg URLs here.
 * The existing /sitemap-properties.xml, /sitemap-blog.xml etc. are served separately.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const today = new Date().toISOString().split('T')[0];

    // Core pages
    const core: MetadataRoute.Sitemap = [
        { url: `${base}/`, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
        { url: `${base}/pg`, lastModified: today, changeFrequency: 'daily', priority: 0.95 },
        { url: `${base}/rent`, lastModified: today, changeFrequency: 'daily', priority: 0.95 },
        { url: `${base}/pg/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.95 },
        { url: `${base}/rent/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.95 },

        // BHK city pages
        { url: `${base}/rent/1bhk/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/rent/2bhk/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/rent/3bhk/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/rent/flat/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/rent/apartment/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/rent/furnished/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/rent/1rk/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/rent/service-apartment/bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },

        // 1BHK area combos
        { url: `${base}/rent/1bhk/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/btm`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/marathahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/bellandur`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/sarjapur-road`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/1bhk/indiranagar`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },

        // 2BHK area combos
        { url: `${base}/rent/2bhk/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/indiranagar`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/btm`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/marathahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/bellandur`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/sarjapur-road`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/hebbal`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/jp-nagar`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/2bhk/jayanagar`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },

        // 3BHK area combos
        { url: `${base}/rent/3bhk/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/3bhk/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/3bhk/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/3bhk/indiranagar`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/3bhk/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },

        // Flat area combos
        { url: `${base}/rent/flat/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/marathahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/indiranagar`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/btm`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/bellandur`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/sarjapur-road`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/hebbal`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/rent/flat/jp-nagar`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },

        // Apartment area combos
        { url: `${base}/rent/apartment/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/apartment/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/apartment/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/apartment/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/apartment/marathahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/apartment/btm`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/apartment/bellandur`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/apartment/indiranagar`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },

        // Furnished area combos
        { url: `${base}/rent/furnished/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/furnished/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/furnished/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/furnished/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/furnished/indiranagar`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/furnished/marathahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/furnished/btm`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/furnished/bellandur`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },

        // 1RK area combos
        { url: `${base}/rent/1rk/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/1rk/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/1rk/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/1rk/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/1rk/btm`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/1rk/marathahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/rent/1rk/bellandur`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },

        // Service apartment area combos
        { url: `${base}/rent/service-apartment/koramangala`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${base}/rent/service-apartment/whitefield`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${base}/rent/service-apartment/indiranagar`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },

        // PG areas
        { url: `${base}/pg/koramangala`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg/whitefield`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg/electronic-city`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg/hsr-layout`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg/marathahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg/btm`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg/indiranagar`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg/bellandur`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/pg/hebbal`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/pg/sarjapur-road`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/pg/manyata-tech-park`, lastModified: today, changeFrequency: 'daily', priority: 0.88 },
        { url: `${base}/pg/kr-puram`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/jp-nagar`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/jayanagar`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/rajajinagar`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/nagawara`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/thanisandra`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/hoodi`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/brookefield`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/domlur`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/cv-raman-nagar`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/banaswadi`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/banashankari`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/kadubeesanahalli`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/mahadevapura`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${base}/pg/yeshwanthpur`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },

        // PG gender landing pages
        { url: `${base}/pg-for-girls-in-bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/pg-for-boys-in-bangalore`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },

        // Blog
        { url: `${base}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${base}/blog/1bhk-for-rent-bangalore-guide-2026`, lastModified: today, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${base}/blog/cheapest-areas-rent-1bhk-bangalore-2026`, lastModified: today, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${base}/blog/pg-vs-flat-bangalore-which-is-better-2026`, lastModified: today, changeFrequency: 'monthly', priority: 0.85 },

        // Static
        { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${base}/contact-us`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/how-we-verify`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/pg-vs-flat-bangalore`, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${base}/flats-in-bangalore`, changeFrequency: 'weekly', priority: 0.8 },
    ];

    return core;
}
