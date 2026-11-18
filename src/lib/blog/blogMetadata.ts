/**
 * Programmatic Blog Engine: Metadata Generator
 * Reuses the central metadata engine to produce production-ready
 * Next.js App Router Metadata for any programmatic blog post.
 */

import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { SITE_URL } from '@/lib/siteConfig';
import type { ProgrammaticBlogPost } from './blogTypes';

export function generateBlogPostMetadata(post: ProgrammaticBlogPost): Metadata {
    const ogImage = `${SITE_URL}/images/og-blog.jpg`;

    const keywordsList = [
        `PG in ${post.hero.category}`,
        `${post.title}`,
        `coliving near ${post.hero.category}`,
        `paying guest accommodation Bangalore`,
        `rent in ${post.hero.category}`,
        `${post.hero.category} PG guide 2026`,
        `zero brokerage PG ${post.hero.category}`
    ].join(', ');

    return pageSeoToMetadata(
        {
            title: post.title,
            description: post.quickSummary,
            path: `/blog/${post.slug}`,
            ogImage,
            keywords: keywordsList
        },
        { openGraphType: 'article' }
    );
}
