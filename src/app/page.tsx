import type { Metadata } from 'next';
import Script from 'next/script';
import { HeroImagePreload } from '@/components/sections/HeroImagePreload';
import { buildHomeSEO } from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import Home from '@/views/Home';

export const metadata: Metadata = pageSeoToMetadata(buildHomeSEO());

/** Homepage shell is static; client islands hydrate listings/search. */
export const revalidate = 3600;

export default function HomePage() {
    const webpageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "MakeMyStay.ai - Verified PGs and Flats in Bangalore",
        "description": "Find verified PGs, co-living spaces, rental homes, 1 BHK, 2 BHK and furnished apartments in Bangalore with makemystay.ai.",
        "url": "https://makemystay.ai"
    };

    return (
        <>
            <Script
                id="homepage-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
            />
            <HeroImagePreload />
            <Home />
        </>
    );
}
