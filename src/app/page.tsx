import type { Metadata } from 'next';
import { buildHomeSEO } from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import Home from '@/views/Home';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageSeoToMetadata(buildHomeSEO());

export default function HomePage() {
    return <Home />;
}
