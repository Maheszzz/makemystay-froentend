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
        <section id="case-study" className="py-12 md:py-20 lg:py-24 bg-red-800 relative overflow-hidden isolate border-t border-champagne/25">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                    <div className={caseStudy.stats?.length ? 'md:w-1/2' : 'w-full max-w-3xl'}>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-red-900 text-red-subtitle border border-champagne/30 text-xs font-semibold uppercase tracking-wider mb-6">
                            Client Case Study
                        </div>
                        <h2 className="font-serif-display text-2xl md:text-4xl font-normal text-white mb-6">
                            {caseStudy.companyName}
                        </h2>
                        <div className="bg-red-900/70 p-6 rounded-[var(--radius-pdp)] border border-champagne/25 mb-8">
                            <div className="flex flex-wrap gap-4 text-sm text-red-subtitle">
                                <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-champagne" /> {caseStudy.city}
                                </span>
                                {caseStudy.propertiesLabel && (
                                    <span className="flex items-center">
                                        <Building2 className="w-4 h-4 mr-1 text-champagne" /> {caseStudy.propertiesLabel}
                                    </span>
                                )}
                                {caseStudy.bedsLabel && (
                                    <span className="flex items-center">
                                        <UserCheck className="w-4 h-4 mr-1 text-champagne" /> {caseStudy.bedsLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-white mb-6 leading-relaxed">
                            {caseStudy.headline}
                        </p>
                        <blockquote className="text-lg text-red-subtitle mb-8 leading-[1.8] italic border-l-4 border-champagne pl-5">
                            &ldquo;{caseStudy.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center space-x-4">
                            {caseStudy.avatarUrl && (
                                <div className="w-12 h-12 bg-red-900 rounded-full overflow-hidden border border-champagne/30">
                                    <img
                                        src={caseStudy.avatarUrl}
                                        alt={caseStudy.clientName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-white">{caseStudy.clientName}</div>
                                <div className="text-sm text-red-subtitle">
                                    {caseStudy.role}, {caseStudy.companyName}
                                </div>
                            </div>
                        </div>
                    </div>

                    {caseStudy.stats && caseStudy.stats.length > 0 && (
                        <div className="md:w-1/2 w-full">
                            <div className="bg-red-900 rounded-[var(--radius-pdp)] p-6 md:p-8 text-white border border-champagne/30">
                                <h3 className="font-serif-display text-2xl font-normal mb-8">Reported Metrics</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {caseStudy.stats.map((stat, i) => (
                                        <div
                                            key={i}
                                            className="bg-red-800/80 p-4 rounded-xl border border-champagne/25"
                                        >
                                            <div className="text-3xl font-bold mb-1 tabular-nums">{stat.value}</div>
                                            <div className="text-red-subtitle text-sm">{stat.label}</div>
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
