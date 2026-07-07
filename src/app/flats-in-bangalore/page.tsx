import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildFlatsInBangaloreSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildFlatsInBangaloreSEO());

export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="flats-bangalore" initialCategory="rent" pageTitle="Flats for Rent in Bangalore" />;
}
