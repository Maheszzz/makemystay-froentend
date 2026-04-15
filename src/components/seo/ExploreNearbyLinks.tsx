import { Link } from 'react-router-dom';
import { PG_LOCATIONS } from '@/data/pgLocations';

interface ExploreNearbyLinksProps {
    currentSlug: string;
    /** Number of internal links (default 12). */
    limit?: number;
}

/**
 * Additional internal links for PageRank flow between PG locality pages.
 */
export function ExploreNearbyLinks({ currentSlug, limit = 12 }: ExploreNearbyLinksProps) {
    const others = PG_LOCATIONS.filter((l) => l.slug !== currentSlug).slice(0, limit);

    return (
        <nav className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5" aria-label="Nearby PG areas">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Explore nearby locations</h2>
            <p className="mt-1 text-xs text-slate-500 mb-3">
                Internal links help you compare PG options across Bangalore — same trust, more areas.
            </p>
            <div className="flex flex-wrap gap-2">
                {others.map((loc) => (
                    <Link
                        key={loc.slug}
                        to={`/pg/${loc.slug}`}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm transition hover:border-brand-red/50 hover:text-brand-red"
                    >
                        PG in {loc.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
