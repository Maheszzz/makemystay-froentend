import React from 'react';

interface AuthorityIntroProps {
    introduction: string;
    whyLiveHere: string[];
    name: string;
}

export function AuthorityIntro({ introduction, whyLiveHere, name }: AuthorityIntroProps) {
    return (
        <section className="space-y-6" aria-labelledby="intro-heading">
            <h2 id="intro-heading" className="text-2xl font-bold text-slate-900">Living in {name}</h2>
            <p className="text-slate-700 leading-relaxed text-base">
                {introduction}
            </p>
            <div className="bg-brand-red/5 border border-brand-red/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Why tech professionals choose {name}</h3>
                <ul className="space-y-3">
                    {whyLiveHere.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0 mt-2" />
                            <span className="text-slate-700 leading-relaxed">{reason}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
