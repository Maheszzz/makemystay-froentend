/**
 * Programmatic Blog Engine: Master Engine
 * Coordinates the automated generation of 3,000+ word SEO blog articles
 * across Localities, Tech Parks, and Topical Authority Clusters.
 */

import { BLOG_POSTS, getBlogPost, type BlogPost } from '@/data/blogPosts';
import { getLocalitySlugs } from '@/lib/locality';
import { getHydratedLocality } from '@/data/localities';
import type {
    ProgrammaticBlogInput,
    ProgrammaticBlogPost,
    BlogSection
} from './blogTypes';

import {
    resolveHubNameAndData,
    generateBlogHero,
    generateBlogQuickSummary,
    generateBlogIntro,
    generateBlogMainContent,
    generateBlogRentalInsights,
    generateBlogNearbyParks,
    generateBlogNearbyMetro,
    generateBlogNearbyCompanies,
    generateBlogToc
} from './blogContent';
import { generateBlogFaqs } from './blogFaq';
import { generateBlogPostMetadata } from './blogMetadata';
import { generateBlogSchemaBundle } from './blogSchema';
import { generateBlogInternalLinks } from './blogLinks';

/**
 * Parses any URL slug segment into a structured ProgrammaticBlogInput.
 */
export function resolveBlogInputFromSlug(slug: string): ProgrammaticBlogInput | undefined {
    if (!slug) return undefined;
    const clean = slug.toLowerCase().replace(/^\/+|\/+$/g, '');

    // 1. Check exact known patterns
    if (clean === 'best-areas-for-it-employees') {
        return { blogType: 'working-professional-guide', localitySlug: 'whitefield' };
    }

    // 2. Comparison: e.g. whitefield-vs-marathahalli
    const comparisonMatch = clean.match(/^([a-z0-9-]+)-vs-([a-z0-9-]+)$/);
    if (comparisonMatch) {
        return {
            blogType: 'comparison',
            localitySlug: comparisonMatch[1],
            secondarySlug: comparisonMatch[2]
        };
    }

    // 3. Tech Park Guide: e.g. pg-near-itpl-guide or pg-near-ecospace-guide
    if (clean.startsWith('pg-near-') && clean.endsWith('-guide')) {
        const tpSlug = clean.replace(/^pg-near-/, '').replace(/-guide$/, '');
        return { blogType: 'tech-park-guide', techParkSlug: tpSlug };
    }

    // 4. Locality blog types: e.g. best-pg-in-whitefield, cost-of-living-whitefield, luxury-pg-whitefield
    if (clean.startsWith('best-pg-in-')) {
        const locSlug = clean.replace(/^best-pg-in-/, '');
        return { blogType: 'best-pg', localitySlug: locSlug };
    }
    if (clean.startsWith('cost-of-living-')) {
        const locSlug = clean.replace(/^cost-of-living-/, '');
        return { blogType: 'cost-of-living', localitySlug: locSlug };
    }
    if (clean.startsWith('luxury-pg-')) {
        const locSlug = clean.replace(/^luxury-pg-/, '');
        return { blogType: 'luxury-pg', localitySlug: locSlug };
    }
    if (clean.startsWith('single-sharing-pg-')) {
        const locSlug = clean.replace(/^single-sharing-pg-/, '');
        return { blogType: 'single-sharing', localitySlug: locSlug };
    }
    if (clean.startsWith('double-sharing-pg-')) {
        const locSlug = clean.replace(/^double-sharing-pg-/, '');
        return { blogType: 'double-sharing', localitySlug: locSlug };
    }
    if (clean.startsWith('triple-sharing-pg-')) {
        const locSlug = clean.replace(/^triple-sharing-pg-/, '');
        return { blogType: 'triple-sharing', localitySlug: locSlug };
    }
    if (clean.startsWith('budget-pg-')) {
        const locSlug = clean.replace(/^budget-pg-/, '');
        return { blogType: 'budget-pg', localitySlug: locSlug };
    }
    if (clean.startsWith('area-guide-')) {
        const locSlug = clean.replace(/^area-guide-/, '');
        return { blogType: 'area-guide', localitySlug: locSlug };
    }
    if (clean.startsWith('rental-guide-')) {
        const locSlug = clean.replace(/^rental-guide-/, '');
        return { blogType: 'rental-guide', localitySlug: locSlug };
    }
    if (clean.startsWith('commute-guide-')) {
        const locSlug = clean.replace(/^commute-guide-/, '');
        return { blogType: 'commute-guide', localitySlug: locSlug };
    }
    if (clean.startsWith('student-guide-')) {
        const locSlug = clean.replace(/^student-guide-/, '');
        return { blogType: 'student-guide', localitySlug: locSlug };
    }
    if (clean.startsWith('working-professional-guide-')) {
        const locSlug = clean.replace(/^working-professional-guide-/, '');
        return { blogType: 'working-professional-guide', localitySlug: locSlug };
    }

    // 5. Default fallback for any remaining locality-like slug
    const locSlugs = getLocalitySlugs();
    if (locSlugs.includes(clean)) {
        return { blogType: 'area-guide', localitySlug: clean };
    }

    return undefined;
}

/**
 * Returns all unique blog slugs for Next.js App Router generateStaticParams().
 * Automatically includes existing static blog posts + programmatic locality/tech-park articles.
 */
export function getProgrammaticBlogSlugs(): string[] {
    const slugs = new Set<string>();

    // 1. Existing static blog posts
    for (const post of BLOG_POSTS) {
        slugs.add(post.slug);
    }

    // 2. Example explicit clusters required by user
    slugs.add('best-pg-in-whitefield');
    slugs.add('cost-of-living-whitefield');
    slugs.add('luxury-pg-whitefield');
    slugs.add('single-sharing-pg-whitefield');
    slugs.add('pg-near-itpl-guide');
    slugs.add('pg-near-ecospace-guide');
    slugs.add('whitefield-vs-marathahalli');
    slugs.add('best-areas-for-it-employees');

    // 3. Automated cluster generation for top localities
    const topLocalities = ['whitefield', 'bellandur', 'hsr-layout', 'koramangala', 'marathahalli', 'electronic-city', 'manyata'];
    for (const loc of topLocalities) {
        slugs.add(`best-pg-in-${loc}`);
        slugs.add(`cost-of-living-${loc}`);
        slugs.add(`luxury-pg-${loc}`);
        slugs.add(`single-sharing-pg-${loc}`);
        slugs.add(`double-sharing-pg-${loc}`);
        slugs.add(`triple-sharing-pg-${loc}`);
        slugs.add(`budget-pg-${loc}`);
        slugs.add(`area-guide-${loc}`);
        slugs.add(`rental-guide-${loc}`);
    }

    // 4. Automated cluster generation for tech parks
    const topParks = ['itpl', 'ecospace', 'embassy-techvillage', 'rmz-ecoworld', 'manyata-tech-park'];
    for (const park of topParks) {
        slugs.add(`pg-near-${park}-guide`);
    }

    // 5. Comparisons
    slugs.add('bellandur-vs-hsr-layout');
    slugs.add('koramangala-vs-indiranagar');
    slugs.add('whitefield-vs-electronic-city');

    return Array.from(slugs);
}

/**
 * Generates a complete 3,000+ word ProgrammaticBlogPost for any valid slug.
 * If the slug matches an existing static post in BLOG_POSTS, it wraps and enriches it
 * into the complete ProgrammaticBlogPost structure.
 */
export function generateProgrammaticBlogPost(inputSlug: string): ProgrammaticBlogPost | null {
    if (!inputSlug) return null;
    const clean = inputSlug.toLowerCase().replace(/^\/+|\/+$/g, '');

    // 1. Check if it is a legacy static post in BLOG_POSTS
    const staticPost: BlogPost | undefined = getBlogPost(clean);
    if (staticPost) {
        return normalizeStaticPostToProgrammatic(staticPost);
    }

    // 2. Parse programmatic blog input
    const input = resolveBlogInputFromSlug(clean);
    if (!input) return null;

    const { hubName, hubSlug, localityData } = resolveHubNameAndData(input);
    const hero = generateBlogHero(input, hubName);
    const rentalInsights = generateBlogRentalInsights(input, hubName, localityData);
    const quickSummary = generateBlogQuickSummary(input, hubName, rentalInsights.averageRent);
    const introduction = generateBlogIntro(input, hubName, rentalInsights.averageRent);
    const mainContent = generateBlogMainContent(input, hubName, localityData);
    const nearbyTechParks = generateBlogNearbyParks(hubSlug);
    const nearbyMetro = generateBlogNearbyMetro(hubSlug);
    const nearbyCompanies = generateBlogNearbyCompanies(hubSlug);
    const faqs = generateBlogFaqs(input, hubName, rentalInsights.averageRent);
    const internalLinks = generateBlogInternalLinks(clean, hubSlug);
    const tableOfContents = generateBlogToc(mainContent);

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Blog Guides', path: '/blog' },
        { name: hero.heading, path: `/blog/${clean}` }
    ];

    const author = {
        name: 'MakeMyStay Editorial Team',
        type: 'Organization' as const,
        role: 'Bangalore Real Estate & Coliving Specialists'
    };

    const partialPost: ProgrammaticBlogPost = {
        title: hero.heading,
        slug: clean,
        blogType: input.blogType,
        hero,
        quickSummary,
        introduction,
        mainContent,
        rentalInsights,
        nearbyTechParks,
        nearbyMetro,
        nearbyCompanies,
        faqs,
        relatedBlogs: internalLinks.blogs,
        relatedLocalities: internalLinks.localities,
        internalLinks,
        metadata: {} as any,
        schema: {} as any,
        breadcrumb,
        tableOfContents,
        author,
        updatedDate: '2026-05-15',
        estimatedReadingTime: hero.readTimeMin
    };

    partialPost.metadata = generateBlogPostMetadata(partialPost);
    partialPost.schema = generateBlogSchemaBundle(partialPost, faqs);

    return partialPost;
}

/**
 * Converts a static BlogPost from src/data/blogPosts.ts into a ProgrammaticBlogPost
 * so all articles benefit from unified TOC, schema, and internal linking.
 */
function normalizeStaticPostToProgrammatic(post: BlogPost): ProgrammaticBlogPost {
    const hubSlug = 'whitefield';
    const locData = getHydratedLocality(hubSlug);
    const input: ProgrammaticBlogInput = { blogType: 'rental-guide', localitySlug: hubSlug };
    const { hubName } = resolveHubNameAndData(input);

    const rentalInsights = generateBlogRentalInsights(input, hubName, locData || undefined);
    const nearbyTechParks = generateBlogNearbyParks(hubSlug);
    const nearbyMetro = generateBlogNearbyMetro(hubSlug);
    const nearbyCompanies = generateBlogNearbyCompanies(hubSlug);

    const faqs = (post.faqs || []).map(f => ({
        question: f.question,
        answer: f.answer
    }));

    const mainContent: BlogSection[] = [
        {
            id: 'article-overview',
            title: '1. Article Overview & Market Context',
            content: post.body.slice(0, 3)
        },
        {
            id: 'in-depth-guide-analysis',
            title: '2. In-Depth Guide & Analysis',
            content: post.body.slice(3, 6)
        },
        {
            id: 'practical-recommendations-checklist',
            title: '3. Practical Recommendations & Booking Checklist',
            content: post.body.slice(6)
        }
    ];

    const internalLinks = generateBlogInternalLinks(post.slug, hubSlug);
    const tableOfContents = generateBlogToc(mainContent);

    const hero = {
        heading: post.title,
        subHeading: post.description,
        category: post.category || 'Rental Guides',
        date: post.publishedAt,
        readTimeMin: post.readTimeMin
    };

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Blog Guides', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` }
    ];

    const author = {
        name: post.authorName || 'MakeMyStay Editorial Team',
        type: (post.authorType || 'Organization') as 'Organization' | 'Person',
        role: 'Bangalore Coliving & PG Specialists'
    };

    const partialPost: ProgrammaticBlogPost = {
        title: post.title,
        slug: post.slug,
        blogType: 'rental-guide',
        hero,
        quickSummary: post.description,
        introduction: post.body.slice(0, 2),
        mainContent,
        rentalInsights,
        nearbyTechParks,
        nearbyMetro,
        nearbyCompanies,
        faqs,
        relatedBlogs: internalLinks.blogs,
        relatedLocalities: internalLinks.localities,
        internalLinks,
        metadata: {} as any,
        schema: {} as any,
        breadcrumb,
        tableOfContents,
        author,
        updatedDate: post.updatedAt || post.publishedAt,
        estimatedReadingTime: post.readTimeMin
    };

    partialPost.metadata = generateBlogPostMetadata(partialPost);
    partialPost.schema = generateBlogSchemaBundle(partialPost, faqs);

    return partialPost;
}
