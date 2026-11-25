/**
 * Programmatic Blog Engine: Schema Generator
 * Builds a comprehensive @graph JSON-LD schema document for programmatic
 * blog articles, combining BlogPosting, BreadcrumbList, FAQPage, and Speakable.
 */

import { buildBreadcrumbSchema, buildFaqPageSchema, type FaqItem } from '@/lib/schema';
import { SITE_URL } from '@/lib/siteConfig';
import type { ProgrammaticBlogPost } from './blogTypes';

export function generateBlogSchemaBundle(post: ProgrammaticBlogPost, faqs: FaqItem[]): Record<string, unknown> {
    const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
    const wordCount = post.mainContent.reduce((acc, sec) => {
        const textWords = sec.content.join(' ').split(/\s+/).length;
        return acc + textWords;
    }, 450);

    const blogPostingSchema = {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        headline: post.title,
        description: post.quickSummary,
        datePublished: post.hero.date,
        dateModified: post.updatedDate,
        inLanguage: 'en-IN',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl
        },
        image: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/og-image.jpg`,
            width: 1200,
            height: 630
        },
        author: {
            '@type': post.author.type,
            name: post.author.name,
            url: SITE_URL
        },
        publisher: {
            '@type': 'Organization',
            name: 'MakeMyStay.ai',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/icon-512.png`
            }
        },
        wordCount,
        articleSection: post.hero.category,
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: [
                '[data-seo="blog-h1"]',
                '[data-seo="blog-quick-summary"]',
                '#faq-heading'
            ]
        }
    };

    const breadcrumbSchema = buildBreadcrumbSchema(post.breadcrumb.map(b => ({
        name: b.name,
        path: b.path
    })));

    const faqSchema = faqs.length > 0 ? buildFaqPageSchema(faqs) : null;

    const graph: unknown[] = [blogPostingSchema, breadcrumbSchema];
    if (faqSchema) {
        graph.push(faqSchema);
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
}
