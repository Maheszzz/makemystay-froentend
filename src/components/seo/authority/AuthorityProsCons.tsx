import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export function AuthorityProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6">
                <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                    Pros of Living Here
                </h3>
                <ul className="space-y-3">
                    {pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-2" />
                            <span className="text-green-800 text-sm leading-relaxed">{pro}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                    Cons to Consider
                </h3>
                <ul className="space-y-3">
                    {cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-2" />
                            <span className="text-red-800 text-sm leading-relaxed">{con}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
