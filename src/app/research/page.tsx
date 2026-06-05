import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildResearchPageSEO } from '@/lib/seo';
import ResearchHub from '@/views/ResearchHub';

export const metadata: Metadata = pageSeoToMetadata(buildResearchPageSEO());

export default function ResearchPage() {
    return <ResearchHub kind="research" />;
}
