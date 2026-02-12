import { MapPin, Building2, UserCheck } from 'lucide-react';
import { caseStudyStats } from '@/data/content';

export function CaseStudy() {
    return (
        <section id="case-study" className="py-14 md:py-24 bg-brand-charcoal relative overflow-hidden isolate">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-diagonal-grid opacity-10 pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    <div className="md:w-1/2">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 text-xs font-bold uppercase tracking-wider mb-6">Real Results</div>
                        <h2 className="text-4xl font-bold text-white mb-6">Case Study: <span className="text-brand-red">Astro Living</span></h2>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
                            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-brand-red" /> Bangalore</span>
                                <span className="flex items-center"><Building2 className="w-4 h-4 mr-1 text-brand-red" /> 4 Properties</span>
                                <span className="flex items-center"><UserCheck className="w-4 h-4 mr-1 text-brand-red" /> 80 Beds</span>
                            </div>
                        </div>
                        <p className="text-lg text-slate-300 mb-6 font-medium">From 78% occupancy to 94% in just 18 days.</p>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            "Before MakeMyStay, we were dependent on brokers who took one month's rent as commission. We had no data on our leads. Within a week of switching, our lead volume tripled and we stopped paying broker commissions entirely."
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden border border-white/10">
                                <img
                                    src="https://api.dicebear.com/7.x/notionists/svg?seed=TejaReddy&backgroundColor=1e293b"
                                    alt="Teja Reddy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-white">Teja Reddy</div>
                                <div className="text-sm text-slate-500">Owner, Astro Living</div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 w-full">
                        <div className="bg-gradient-to-br from-brand-red to-[#B91C1C] rounded-3xl p-8 text-white shadow-glow relative overflow-hidden border border-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="text-2xl font-bold mb-8 relative z-10">Impact Summary</h3>
                            <div className="grid grid-cols-2 gap-6 relative z-10">
                                {caseStudyStats.map((stat, i) => (
                                    <div key={i} className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-black/30 transition-colors">
                                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                        <div className="text-white/80 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/20 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white/80 text-sm mb-1">Additional Revenue</div>
                                        <div className="text-3xl font-bold">₹4.2 Lakhs</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white/80 text-sm mb-1">ROI Timeline</div>
                                        <div className="text-xl font-bold">18 Days</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
