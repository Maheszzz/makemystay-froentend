import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { plotBangaloreHubSeo } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(plotBangaloreHubSeo());

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="plots" initialCategory="plot" initialCity="Bangalore" pageTitle="Plots in Bangalore" pageSubtitle="Residential land and plot listings across Bangalore, with area and budget filters." />;
}
