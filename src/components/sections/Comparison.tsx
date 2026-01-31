import { comparisonData } from '@/data/content';
import { Check, X } from 'lucide-react';

export function Comparison() {
    const getValueIcon = (value: string) => {
        if (value === 'No' || value === 'None' || value === 'N/A') {
            return <X className="w-4 h-4 text-red-500" />;
        }
        if (value === 'Full' || value === 'Yes') {
            return <Check className="w-4 h-4 text-brand-red" />;
        }
        return null;
    };

    return (
        <section id="market" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-brand-red/10 text-brand-red font-semibold tracking-wide uppercase text-sm rounded-full mb-4">Competitive Analysis</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mt-2 mb-6 font-heading">
                        Why We Win – <span className="text-brand-red">Competitive Moat</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Compare us properly. We aren't just a tool, we are an outcome partner.
                    </p>
                </div>

                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[800px] w-full bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
                        {/* Dark Header Section */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
                            <div className="grid grid-cols-5 gap-4 items-center">
                                <div className="text-lg font-bold text-white">Feature</div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-slate-300">Brokers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-slate-300">Listing Portals</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-slate-300">Generic CRM</div>
                                </div>
                                <div className="text-center">
                                    <div className="px-5 py-2 bg-brand-red rounded-full inline-block">
                                        <span className="text-white font-bold text-sm">MakeMyStay.ai</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* White Table Body */}
                        <div className="p-8">
                            {comparisonData.map((row, idx) => (
                                <div
                                    key={idx}
                                    className={`grid grid-cols-5 gap-4 py-5 items-center ${idx !== comparisonData.length - 1 ? 'border-b border-slate-200' : ''}`}
                                >
                                    <div className="font-semibold text-slate-900">{row.label}</div>
                                    <div className="text-center">
                                        <span className="text-red-500 text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.b)}
                                            {row.b}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-orange-500 text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.l)}
                                            {row.l}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-blue-500 text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.c)}
                                            {row.c}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="inline-flex items-center gap-2 text-brand-red font-bold bg-red-50 py-2 px-4 rounded-full text-sm">
                                            {getValueIcon(row.m)}
                                            {row.m}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
