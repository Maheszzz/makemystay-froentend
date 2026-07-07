import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildContactPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildContactPageSEO());

export const dynamic = 'force-dynamic';

export { default } from '@/views/Contact';
