import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildRefundPolicyPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildRefundPolicyPageSEO());

export const dynamic = 'force-dynamic';

export { default } from '@/views/RefundPolicy';
