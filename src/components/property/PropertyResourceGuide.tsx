import { buildPropertyContentGuide } from '@/lib/propertyContentEngine';
import type { Property } from '@/types/api';

export function PropertyResourceGuide({ property }: { property: Property }) {
    const guide = buildPropertyContentGuide(property);
    const primarySections = [
        guide.overview,
        guide.pricing,
        guide.roomTypes,
        guide.amenities,
        guide.availabilityContact,
    ].filter((s): s is NonNullable<typeof s> => Boolean(s));

    return (
        <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">
                    Listing Summary
                </p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Details for {guide.name}
                </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {primarySections.map((section) => (
                    <article key={section.title} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
                        <h3 className="text-base font-black text-slate-900">{section.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
                        {section.items && section.items.length > 0 && (
                            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                                {section.items.slice(0, 8).map((item) => (
                                    <li key={item}>• {item}</li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </div>

            {guide.nearbyPlaces.length > 0 && (
                <div className="mt-8 rounded-3xl border border-slate-100 p-5">
                    <h3 className="text-lg font-black text-slate-900">Nearby places</h3>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        {guide.nearbyPlaces.map((place, idx) => (
                            <li
                                key={place.id || `${place.name}-${idx}`}
                                className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0"
                            >
                                <span className="font-semibold text-slate-800">{place.name}</span>
                                <span className="text-right">
                                    {place.distance}
                                    {place.travel_time ? ` · ${place.travel_time}` : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <nav className="mt-8 rounded-3xl bg-slate-900 p-5" aria-label="Contextual property links">
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white/70">Explore related searches</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                    {guide.internalLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>
        </section>
    );
}
