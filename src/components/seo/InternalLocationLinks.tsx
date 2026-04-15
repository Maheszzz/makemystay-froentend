import { Link } from 'react-router-dom';
import { PG_LOCATIONS } from '@/data/pgLocations';

interface InternalLocationLinksProps {
    /** Slug of current page — excluded from list */
    currentSlug?: string;
}

const MAX_LINKS = 20;

export function InternalLocationLinks({ currentSlug }: InternalLocationLinksProps) {
    const others = PG_LOCATIONS.filter((l) => l.slug !== currentSlug).slice(0, MAX_LINKS);

    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm" aria-labelledby="explore-pg-areas">
            <h2 id="explore-pg-areas" className="text-base font-bold text-slate-900">
                Explore PG in other Bangalore areas
            </h2>
            <Link
                to="/pg/bangalore"
                className="mt-3 inline-flex text-sm font-semibold text-brand-red hover:underline"
            >
                PG in Bangalore — city hub →
            </Link>
            <nav className="mt-4 flex flex-wrap gap-2" aria-label="PG locations">
                {others.map((loc) => (
                    <Link
                        key={loc.slug}
                        to={`/pg/${loc.slug}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-red/40 hover:bg-red-50 hover:text-brand-red"
                    >
                        PG in {loc.name}
                    </Link>
                ))}
            </nav>
            <Link
                to="/pg"
                className="mt-4 inline-block text-xs font-semibold text-brand-red hover:underline"
            >
                Browse all PG listings →
            </Link>
        </section>
    );
}
