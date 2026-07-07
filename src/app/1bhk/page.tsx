import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { build1BhkSEO } from '@/lib/seo';
import Properties from '@/views/Properties';

export const metadata: Metadata = pageSeoToMetadata(build1BhkSEO());

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Properties key="1bhk" initialTypeFilter="1BHK" initialCity="Bangalore" pageTitle="1 BHK Properties in Bangalore" pageSubtitle="Perfect homes for singles and couples" />;
}
