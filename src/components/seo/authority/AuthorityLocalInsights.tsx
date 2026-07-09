import React from 'react';
import type { AuthorityLocalInsights } from '@/data/authority/types';
import { Wallet, ShieldAlert, ListChecks, FileText } from 'lucide-react';

export function AuthorityLocalInsightsSection({ insights }: { insights: AuthorityLocalInsights }) {
    if (!insights) return null;

    return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm" aria-labelledby="insights-heading">
            <h2 id="insights-heading" className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-red" />
                Local Insights & Survival Guide
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cost of Living */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <Wallet className="w-5 h-5 text-brand-red" /> Cost of Living
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-100">
                        {insights.costOfLiving.map((item, idx) => (
                            <div key={idx} className="p-3 flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700">{item.category}</span>
                                <span className="text-sm font-bold text-slate-900">{item.estimatedCost}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Move In Checklist */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <ListChecks className="w-5 h-5 text-brand-red" /> Move-In Checklist
                    </h3>
                    <ul className="space-y-3">
                        {insights.moveInChecklist.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700 leading-relaxed">{task}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Crime Awareness */}
                <div className="md:col-span-2 bg-red-50 border border-red-100 rounded-xl p-5">
                    <h3 className="text-base font-bold text-red-900 flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-5 h-5 text-red-600" /> Security & Scam Awareness
                    </h3>
                    <p className="text-sm text-red-800 leading-relaxed">
                        {insights.crimeAwareness}
                    </p>
                </div>
                
                {/* Agreement Guide */}
                <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <h3 className="text-base font-bold text-blue-900 flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" /> Rental Agreement Guide
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        {insights.rentalAgreementGuide}
                    </p>
                </div>
            </div>
        </section>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
