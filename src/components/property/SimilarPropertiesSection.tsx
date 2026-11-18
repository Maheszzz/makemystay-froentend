import { Link } from '@/lib/navigation';
import { useSimilarProperties } from '@/hooks';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import type { Property } from '@/types/api';
import { findPgLocationForArea } from '@/data/pgLocations';

interface SimilarPropertiesSectionProps {
    current: Property;
    initialSimilar?: Property[];
}

export function SimilarPropertiesSection({ current, initialSimilar }: SimilarPropertiesSectionProps) {
    const city = current.location?.trim() || undefined;
    const pgLoc = findPgLocationForArea(current.location);
    const isPg = current.type?.toLowerCase() === 'pg';

    const { properties: similar, loading, error } = useSimilarProperties(current.id, {
        limit: 6,
        initialProperties: initialSimilar,
    });

    if (loading || error || similar.length === 0) {
        return null;
    }

    const heading = isPg
        ? pgLoc
            ? `Similar PGs in ${pgLoc.name}`
            : `More PG stays${city ? ` near ${city}` : ''}`
        : pgLoc
          ? `Similar ${current.type} in ${pgLoc.name}`
          : `More ${current.type} listings${city ? ` near ${city}` : ''}`;

    return (
        <section className="py-8 border-t border-pdp-border" aria-labelledby="similar-pg-heading">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 id="similar-pg-heading" className="text-xl font-semibold text-pdp-ink">
                        {heading}
                    </h2>
                    <p className="text-sm text-pdp-muted mt-1">Compare nearby listings</p>
                </div>
                {pgLoc && (
                    <Link
                        to={`/pg/${pgLoc.slug}`}
                        className="min-h-[44px] inline-flex items-center text-sm font-medium text-pdp-ink underline underline-offset-4 hover:text-pdp-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded"
                    >
                        View all in {pgLoc.name}
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {similar.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                ))}
            </div>
        </section>
    );
}
