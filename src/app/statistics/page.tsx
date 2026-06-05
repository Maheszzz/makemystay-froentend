import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildStatisticsPageSEO } from '@/lib/seo';
import ResearchHub from '@/views/ResearchHub';

export const metadata: Metadata = pageSeoToMetadata(buildStatisticsPageSEO());

export default function StatisticsPage() {
    return <ResearchHub kind="statistics" />;
}
