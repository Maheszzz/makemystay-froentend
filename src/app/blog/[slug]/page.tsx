import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateProgrammaticBlogPost, getProgrammaticBlogSlugs } from '@/lib/blog';
import { getBlogPost } from '@/data/blogPosts';
import { resolveBlogSlugMetadata } from '@/lib/routeMetadata';
import BlogPostView from '@/views/BlogPost';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolveBlogSlugMetadata(slug);
}

export async function generateStaticParams() {
    const slugs = getProgrammaticBlogSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    if (!slug || (!generateProgrammaticBlogPost(slug) && !getBlogPost(slug))) {
        notFound();
    }

    return <BlogPostView slug={slug} />;
}
