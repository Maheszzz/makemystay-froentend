import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buyBangaloreHubSeo } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(buyBangaloreHubSeo());

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="buy-bangalore" initialCategory="buy" initialCity="Bangalore" pageTitle="Buy Property in Bangalore" pageSubtitle="Find verified apartments and homes for sale in Bangalore" />;
}
