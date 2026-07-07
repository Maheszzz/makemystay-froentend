import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildHowWeVerifyPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildHowWeVerifyPageSEO());

export const dynamic = 'force-dynamic';

export { default } from '@/views/HowWeVerify';
