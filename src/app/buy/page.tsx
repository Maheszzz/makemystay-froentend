import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(listingsPageSeo({
    pathname: '/buy',
    pageTitle: 'Homes to buy in Bangalore',
    pageSubtitle: 'Residential flats and houses listed for sale in Bangalore',
    category: 'buy',
    cityLabel: 'Bangalore',
}));

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="buy" initialCategory="buy" initialCity="Bangalore" pageTitle="Homes to buy in Bangalore" pageSubtitle="Residential flats and homes for sale in Bangalore, with transparent pricing." />;
}
