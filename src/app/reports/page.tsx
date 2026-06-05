import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildReportsPageSEO } from '@/lib/seo';
import ResearchHub from '@/views/ResearchHub';

export const metadata: Metadata = pageSeoToMetadata(buildReportsPageSEO());

export default function ReportsPage() {
    return <ResearchHub kind="reports" />;
}
