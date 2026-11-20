import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildPgNearbySEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildPgNearbySEO());

export const dynamic = 'force-dynamic';

export { default } from '@/views/PgNearMe';
