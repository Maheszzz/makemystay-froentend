import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(listingsPageSeo({
    pathname: '/pg',
    pageTitle: 'PG in Bangalore',
    pageSubtitle: 'Verified paying guest stays',
    category: 'pg',
    cityLabel: 'Bangalore',
}));

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="pg" initialCategory="pg" initialCity="Bangalore" pageTitle="PG Accommodations" pageSubtitle="Comfortable & verified PG options in Bangalore" />;
}
