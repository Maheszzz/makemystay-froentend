import React from 'react';
import { Link } from '@/lib/navigation';
import { STATIC_410_GONE_PATHS } from '@/lib/seoPropertyRedirects';
import type { LocalityAuthorityProfile } from '@/data/authority/types';

export function AuthorityInternalLinkHub({ profile }: { profile: LocalityAuthorityProfile }) {
    const { name, nearbyLocalities, nearbyTechParks, slug } = profile;
    const safeNearby = nearbyLocalities.filter((loc) => !STATIC_410_GONE_PATHS.has(`/pg/${loc.slug}`));
    const boysPath = `/pg-for-boys-in-${slug}`;
    const girlsPath = `/pg-for-girls-in-${slug}`;
    const rentPath = `/rent/${slug}`;
    const bhkPath = `/1bhk/${slug}`;

    return (
        <section
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            aria-labelledby="locality-link-hub-heading"
        >
            <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Explore</p>
                <h2 id="locality-link-hub-heading" className="mt-1 text-lg font-bold text-slate-900">
                    Discover More Around {name}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nearbyTechParks.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Top Tech Parks</h3>
                        <nav className="flex flex-col gap-2" aria-label="Nearby Tech Parks">
                            {nearbyTechParks.map((park) => (
                                <Link
                                    key={park.path}
                                    to={`/${park.path}`}
                                    className="text-sm font-medium text-slate-700 hover:text-brand-red transition-colors"
                                >
                                    PG near {park.name} →
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {safeNearby.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Nearby Localities</h3>
                        <nav className="flex flex-col gap-2" aria-label="Nearby PG localities">
                            {safeNearby.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    to={`/pg/${loc.slug}`}
                                    className="text-sm font-medium text-slate-700 hover:text-brand-red transition-colors"
                                >
                                    PG in {loc.name} →
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Specific Searches</h3>
                    <nav className="flex flex-col gap-2">
                        {!STATIC_410_GONE_PATHS.has(boysPath) && (
                            <Link to={boysPath} className="text-sm font-medium text-slate-700 hover:text-brand-red transition-colors">
                                Boys PG in {name} →
                            </Link>
                        )}
                        {!STATIC_410_GONE_PATHS.has(girlsPath) && (
                            <Link to={girlsPath} className="text-sm font-medium text-slate-700 hover:text-brand-red transition-colors">
                                Girls PG in {name} →
                            </Link>
                        )}
                        {!STATIC_410_GONE_PATHS.has(rentPath) && (
                            <Link to={rentPath} className="text-sm font-medium text-slate-700 hover:text-brand-red transition-colors">
                                Flats for Rent in {name} →
                            </Link>
                        )}
                        <Link to={bhkPath} className="text-sm font-medium text-slate-700 hover:text-brand-red transition-colors">
                            1 BHK in {name} →
                        </Link>
                    </nav>
                </div>
            </div>
        </section>
    );
}
