/**
 * Programmatic Blog Engine: Deduplicated Internal Linking Generator
 * Dynamically links blog articles to relevant localities, tech parks,
 * other blog articles, and property pages with zero duplicate URLs.
 */

import { SEO_LOCALITIES } from '@/data/localities';
import { TECH_PARKS } from '@/data/techParks';
import { BLOG_POSTS } from '@/data/blogPosts';

export interface BlogInternalLinks {
    localities: Array<{ name: string; path: string }>;
    techParks: Array<{ name: string; path: string }>;
    blogs: Array<{ title: string; path: string }>;
    propertyPages: Array<{ name: string; path: string }>;
}

export function generateBlogInternalLinks(currentSlug: string, hubSlug: string): BlogInternalLinks {
    const seenPaths = new Set<string>();
    seenPaths.add(`/blog/${currentSlug}`);

    // 1. Relevant Localities (up to 5)
    const localities: Array<{ name: string; path: string }> = [];
    for (const loc of SEO_LOCALITIES) {
        const path = `/pg/${loc.slug}`;
        if (!seenPaths.has(path) && localities.length < 5) {
            seenPaths.add(path);
            localities.push({
                name: `PG in ${loc.name}`,
                path
            });
        }
    }

    // 2. Tech Parks (up to 4)
    const techParks: Array<{ name: string; path: string }> = [];
    for (const tp of TECH_PARKS) {
        const path = `/${tp.path}`;
        if (!seenPaths.has(path) && techParks.length < 4) {
            seenPaths.add(path);
            techParks.push({
                name: `PG near ${tp.name}`,
                path
            });
        }
    }

    // 3. Related Blogs (up to 6)
    const blogs: Array<{ title: string; path: string }> = [];
    for (const p of BLOG_POSTS) {
        const path = `/blog/${p.slug}`;
        if (!seenPaths.has(path) && blogs.length < 6) {
            seenPaths.add(path);
            blogs.push({
                title: p.title,
                path
            });
        }
    }

    // 4. Property Pages / Rent Hubs
    const propertyPages: Array<{ name: string; path: string }> = [
        { name: `Browse All Bangalore PGs`, path: `/pg/bangalore` },
        { name: `Rental Hub in ${hubSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`, path: `/rent/${hubSlug}` },
        { name: `Whitefield Coliving Stays`, path: `/pg/whitefield` }
    ].filter(link => {
        if (seenPaths.has(link.path)) return false;
        seenPaths.add(link.path);
        return true;
    });

    return {
        localities,
        techParks,
        blogs,
        propertyPages
    };
}
