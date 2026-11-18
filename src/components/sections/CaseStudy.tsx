import { MapPin, Building2, UserCheck } from 'lucide-react';

export interface ApprovedCaseStudy {
    clientName: string;
    role: string;
    companyName: string;
    city: string;
    propertiesLabel?: string;
    bedsLabel?: string;
    headline: string;
    quote: string;
    avatarUrl?: string;
    stats?: { value: string; label: string }[];
}

interface CaseStudyProps {
    caseStudy?: ApprovedCaseStudy | null;
}

/**
 * Renders only when real, named, approved case study content is supplied.
 */
export function CaseStudy({ caseStudy = null }: CaseStudyProps) {
    if (!caseStudy || !caseStudy.clientName || !caseStudy.quote) {
        return null;
    }

    return (
        <section id="case-study" className="py-14 md:py-24 bg-brand-charcoal relative overflow-hidden isolate">
            <div className="absolute inset-0 bg-diagonal-grid opacity-10 pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                    <div className={caseStudy.stats?.length ? 'md:w-1/2' : 'w-full max-w-3xl'}>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 text-xs font-bold uppercase tracking-wider mb-6">
                            Client Case Study
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                            {caseStudy.companyName}
                        </h2>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
                            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-brand-red" /> {caseStudy.city}
                                </span>
                                {caseStudy.propertiesLabel && (
                                    <span className="flex items-center">
                                        <Building2 className="w-4 h-4 mr-1 text-brand-red" /> {caseStudy.propertiesLabel}
                                    </span>
                                )}
                                {caseStudy.bedsLabel && (
                                    <span className="flex items-center">
                                        <UserCheck className="w-4 h-4 mr-1 text-brand-red" /> {caseStudy.bedsLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-slate-300 mb-6 leading-relaxed">
                            {caseStudy.headline}
                        </p>
                        <blockquote
                            className="text-lg text-slate-300 mb-8 leading-[1.8] italic border-l-4 pl-5"
                            style={{ borderColor: '#C5A021' }}
                        >
                            &ldquo;{caseStudy.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center space-x-4">
                            {caseStudy.avatarUrl && (
                                <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden border border-white/10">
                                    <img
                                        src={caseStudy.avatarUrl}
                                        alt={caseStudy.clientName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-white">{caseStudy.clientName}</div>
                                <div className="text-sm text-slate-400">
                                    {caseStudy.role}, {caseStudy.companyName}
                                </div>
                            </div>
                        </div>
                    </div>

                    {caseStudy.stats && caseStudy.stats.length > 0 && (
                        <div className="md:w-1/2 w-full">
                            <div className="bg-gradient-to-br from-brand-red to-[#B91C1C] rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-glow relative overflow-hidden border border-white/10">
                                <h3 className="text-2xl font-bold mb-8 relative z-10">Reported Metrics</h3>
                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    {caseStudy.stats.map((stat, i) => (
                                        <div
                                            key={i}
                                            className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10"
                                        >
                                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                            <div className="text-white/80 text-sm">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
