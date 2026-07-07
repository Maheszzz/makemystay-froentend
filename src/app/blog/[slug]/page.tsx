import type { Metadata } from 'next';
import { resolveBlogSlugMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    return resolveBlogSlugMetadata(params.slug);
}

export const dynamic = 'force-dynamic';

export { default } from '@/views/BlogPost';
