import { comparisonData } from '@/data/content';
import { Check, X } from 'lucide-react';

export function Comparison() {
    const getValueIcon = (value: string) => {
        if (value === 'No' || value === 'None' || value === 'N/A') {
            return <X className="w-4 h-4 text-slate" />;
        }
        if (value === 'Full' || value === 'Yes') {
            return <Check className="w-4 h-4 text-red" />;
        }
        return null;
    };

    return (
        <section id="market" className="py-12 md:py-20 lg:py-24 bg-page relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-1.5 bg-blush-100 border border-line text-red font-semibold tracking-wide uppercase text-xs rounded-full mb-4">Competitive Analysis</span>
                    <h2 className="font-serif-display text-3xl md:text-5xl font-normal text-ink mt-2 mb-5">
                        Why we win — <span className="text-red">competitive moat</span>
                    </h2>
                    <p className="text-slate max-w-2xl mx-auto text-lg">
                        Compare us properly. We aren't just a tool, we are an outcome partner.
                    </p>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-6">
                    {comparisonData.map((row, idx) => (
                        <div key={idx} className="bg-white rounded-[var(--radius-pdp)] p-5 border border-line">
                            <h3 className="text-lg font-bold text-ink mb-4 px-1">{row.label}</h3>

                            {/* MakeMyStay - Highlighted Row */}
                            <div className="flex items-center justify-between mb-4 bg-blush-100 p-4 rounded-xl border border-line">
                                <span className="font-bold text-red text-sm">MakeMyStay</span>
                                <div className="text-lg font-bold text-red flex items-center gap-2">
                                    {getValueIcon(row.m)} {row.m}
                                </div>
                            </div>

                            {/* Others - Vertical List for readability */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-page rounded-lg border border-line">
                                    <span className="text-slate text-xs font-medium">Brokers</span>
                                    <span className="font-semibold text-ink text-sm">{row.b}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-page rounded-lg border border-line">
                                    <span className="text-slate text-xs font-medium">Portals</span>
                                    <span className="font-semibold text-ink text-sm">{row.l}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-page rounded-lg border border-line">
                                    <span className="text-slate text-xs font-medium">CRM</span>
                                    <span className="font-semibold text-ink text-sm">{row.c}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto pb-4 relative">
                    <div className="min-w-[800px] w-full bg-white rounded-[var(--radius-pdp)] overflow-hidden border border-line">
                        {/* Dark Header Section */}
                        <div className="bg-red-800 py-6 border-b border-champagne/30">
                            <div className="grid grid-cols-5 gap-4 items-center">
                                <div className="text-lg font-bold text-white pl-8">Feature</div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-red-subtitle">Brokers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-red-subtitle">Listing Portals</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-red-subtitle">Generic CRM</div>
                                </div>
                                {/* Winner column header */}
                                <div className="text-center pr-8 relative">
                                    <div className="px-5 py-2 rounded-full inline-block relative bg-red border border-champagne/40">
                                        <span className="text-white font-bold text-sm">MakeMyStay.ai</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* White Table Body */}
                        <div className="py-4">
                            {comparisonData.map((row, idx) => (
                                <div
                                    key={idx}
                                    className={`grid grid-cols-5 gap-4 py-5 items-center hover:bg-page transition-colors ${idx !== comparisonData.length - 1 ? 'border-b border-line' : ''}`}
                                >
                                    <div className="font-semibold text-ink pl-8">{row.label}</div>
                                    <div className="text-center">
                                        <span className="text-slate text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.b)}
                                            {row.b}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-slate text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.l)}
                                            {row.l}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-slate text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.c)}
                                            {row.c}
                                        </span>
                                    </div>
                                    <div className="text-center pr-8 relative">
                                        <span className="inline-flex items-center gap-2 font-bold py-2 px-4 rounded-full text-sm text-red bg-blush-100 border border-line">
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
