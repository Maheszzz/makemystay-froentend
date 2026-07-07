import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { build2BhkSEO } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(build2BhkSEO());

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="2bhk" initialTypeFilter="2BHK" initialCity="Bangalore" pageTitle="2 BHK Properties in Bangalore" pageSubtitle="Ideal spaces for small families" />;
}
