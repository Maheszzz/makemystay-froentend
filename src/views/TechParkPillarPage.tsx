'use server';

import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateTechParkLandingProfile } from '@/lib/landing';
import { TechParkSeoProfileSections } from '@/components/seo/TechParkSeoProfileSections';
import { propertyApi } from '@/lib/api/properties';

interface TechParkPillarPageProps {
    /** The URL path segment e.g. "pg-near-embassy-techvillage" or "itpl" */
    parkPath: string;
}

/**
 * SSR pillar page for tech park PG landing pages.
 * Consumes generateTechParkLandingProfile(slug) from the Tech Park Landing Page Generator.
 */
export default async function TechParkPillarPage({ parkPath }: TechParkPillarPageProps) {
    const profile = generateTechParkLandingProfile(parkPath);
    if (!profile) notFound();

    // SSR property fetch — use primary hub locality
    let initialProperties: any[] = [];
    try {
        const result = await propertyApi.getAll({ city: profile.park.hubSlug, limit: 8 });
        initialProperties = result.items ?? [];
    } catch {
        // Graceful degradation — page renders without properties
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <JsonLd data={profile.schema} id="tech-park-pillar-jsonld" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TechParkSeoProfileSections
                        profile={profile}
                        initialProperties={initialProperties}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
