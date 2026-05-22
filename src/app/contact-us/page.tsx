import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildContactPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildContactPageSEO());

export { default } from '@/views/Contact';
