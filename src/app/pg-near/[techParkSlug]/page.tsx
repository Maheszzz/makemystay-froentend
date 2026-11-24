import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateTechParkLandingProfile, getTechParkLandingSlugs } from '@/lib/landing';
import { getTechParkByPath } from '@/data/techParks';
import TechParkPillarPage from '@/views/TechParkPillarPage';

type PageProps = { params: Promise<{ techParkSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { techParkSlug } = await params;
    const profile = generateTechParkLandingProfile(techParkSlug);
    if (!profile) {
        if (!getTechParkByPath(techParkSlug)) {
            notFound();
        }
        return {
            title: 'PG near Tech Park',
            description: 'Find verified paying guest accommodations near top tech parks in Bangalore.'
        };
    }
    return profile.metadata;
}

export async function generateStaticParams() {
    const slugs = getTechParkLandingSlugs();
    return slugs.map((techParkSlug) => ({
        techParkSlug
    }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function Page({ params }: PageProps) {
    const { techParkSlug } = await params;
    if (!techParkSlug || (!generateTechParkLandingProfile(techParkSlug) && !getTechParkByPath(techParkSlug))) {
        notFound();
    }

    return <TechParkPillarPage parkPath={techParkSlug} />;
}
