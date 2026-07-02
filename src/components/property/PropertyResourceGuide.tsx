import { buildPropertyContentGuide } from '@/lib/propertyContentEngine';
import type { Property } from '@/types/api';

export function PropertyResourceGuide({ property }: { property: Property }) {
    const guide = buildPropertyContentGuide(property);
    const primarySections = [
        guide.overview,
        guide.suitability,
        guide.pricing,
        guide.roomTypes,
        guide.foodWifiLaundry,
        guide.safetyAndRules,
        guide.moveInTerms,
        guide.availabilityContact,
    ];

    return (
        <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">
                    Complete Property Guide
                </p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Renting guide for {guide.name}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-2">
                    Pricing, room fit, house rules, commute and locality context in one place.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {primarySections.map((section) => (
                    <article key={section.title} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
                        <h3 className="text-base font-black text-slate-900">{section.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
                        {section.items && section.items.length > 0 && (
                            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                                {section.items.slice(0, 6).map((item) => (
                                    <li key={item}>• {item}</li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </div>

            <div className="mt-8 grid lg:grid-cols-2 gap-6">
                <article className="rounded-3xl border border-slate-100 p-5">
                    <h3 className="text-lg font-black text-slate-900">Local area guide for {guide.locality}</h3>
                    <div className="mt-4 space-y-4">
                        {guide.localityGuide.map((section) => (
                            <div key={section.title}>
                                <h4 className="text-sm font-bold text-slate-900">{section.title}</h4>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">{section.body}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-3xl border border-slate-100 p-5">
                    <h3 className="text-lg font-black text-slate-900">Commute estimates</h3>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        {guide.commute.slice(0, 12).map((item) => (
                            <li key={item.destination} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0">
                                <span className="font-semibold text-slate-800">{item.destination}</span>
                                <span className="text-right">{item.minutes}-{item.minutes + 15} min</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-xs leading-relaxed text-slate-400">
                        Estimates are directional and depend on peak-hour traffic, route, and transport mode.
                    </p>
                </article>
            </div>

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
