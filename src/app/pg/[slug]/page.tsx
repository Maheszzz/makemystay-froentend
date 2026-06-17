import PropertyDetailsPage from '@/components/property/PropertyDetailsPage';
import { getPgLocationBySlug, PG_LOCATIONS } from '@/data/pgLocations';
import { resolvePgSlugMetadata } from '@/lib/routeMetadata';
import PGLocationPage from '@/views/PGLocationPage';
import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgSlugMetadata(slug);
}

export async function generateStaticParams() {
    return PG_LOCATIONS.map((loc) => ({ slug: loc.slug }));
}

export default async function PgSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // Try to resolve as a locality (city/area) page first.
  const loc = getPgLocationBySlug(slug);
  if (loc) {
    const { rentRange, landmarks } = loc;
    return (
      <>
        <PGLocationPage slug={slug} />
        {/* Rent Range */}
        {rentRange && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Rent Range</h2>
            <p className="text-slate-700">{rentRange}</p>
          </section>
        )}
        {/* Landmarks */}
        {landmarks && landmarks.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Nearby Landmarks</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {landmarks.map((lm) => (
                <li key={lm}>{lm}</li>
              ))}
            </ul>
          </section>
        )}
      </>
    );
  }

  // Fallback to property page.
  return <PropertyDetailsPage slug={slug} currentPath={`/pg/${slug}`} />;
}
