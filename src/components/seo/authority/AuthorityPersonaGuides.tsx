import React from 'react';
import type { AuthorityPersonaGuide } from '@/data/authority/types';
import { Users, GraduationCap, BriefcaseBusiness, Baby } from 'lucide-react';

export function AuthorityPersonaGuides({ guides, name }: { guides: AuthorityPersonaGuide[], name: string }) {
    if (!guides.length) return null;
    
    return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm" aria-labelledby="personas-heading">
            <h2 id="personas-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-red" />
                Who Should Live in {name}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.map((guide, idx) => {
                    const Icon = guide.persona === 'Student' ? GraduationCap : guide.persona === 'Family' ? Baby : BriefcaseBusiness;
                    return (
                        <div key={idx} className="border border-slate-100 rounded-xl p-5 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                                <Icon className="w-5 h-5 text-brand-red" />
                                {guide.persona}
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">{guide.description}</p>
                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-slate-900">Best Areas:</div>
                                <ul className="text-xs text-slate-600 space-y-1">
                                    {guide.idealAreas.map((area, i) => <li key={i}>• {area}</li>)}
                                </ul>
                                <div className="text-xs font-semibold text-slate-900 mt-3">Pro Tips:</div>
                                <ul className="text-xs text-slate-600 space-y-1">
                                    {guide.tips.map((tip, i) => <li key={i}>• {tip}</li>)}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
