import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { rentBangaloreHubSeo } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(rentBangaloreHubSeo());

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="rent" initialCategory="rent" initialCity="Bangalore" pageTitle="Properties for Rent" pageSubtitle="Find your perfect rental home in Bangalore" />;
}
