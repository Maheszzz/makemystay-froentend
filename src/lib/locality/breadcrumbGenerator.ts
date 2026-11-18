/**
 * Locality SEO Engine: Breadcrumb Generator
 * Generates canonical breadcrumb navigation hierarchy for locality pages
 * (Home -> PG in Bangalore -> Current Locality) for UI and BreadcrumbList schema.
 */

import type { HydratedLocality } from '@/data/localities';

export interface BreadcrumbItem {
    /** Label displayed in breadcrumb trail */
    name: string;
    /** Relative canonical URL path */
    path: string;
}

/**
 * Generate standard 3-tier breadcrumb trail for a locality page.
 */
export function generateLocalityBreadcrumb(locality: HydratedLocality): BreadcrumbItem[] {
    return [
        { name: 'Home', path: '/' },
        { name: 'PG in Bangalore', path: '/properties' },
        { name: `PG in ${locality.name}`, path: `/pg/${locality.slug}` }
    ];
}
