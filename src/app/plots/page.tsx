import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { plotBangaloreHubSeo } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(plotBangaloreHubSeo());

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="plots" initialCategory="plot" initialCity="Bangalore" pageTitle="Plots & Land for Sale" pageSubtitle="Find plots and land to build your dream home in Bangalore" />;
}
