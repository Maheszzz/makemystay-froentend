import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { pgFeatureLandingSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(pgFeatureLandingSeo('ac'));

export const dynamic = 'force-dynamic';

export { default } from '@/views/PgFeatureLandingPage';
