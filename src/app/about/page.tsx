import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildAboutPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildAboutPageSEO());

export const dynamic = 'force-dynamic';

export { default } from '@/views/About';
