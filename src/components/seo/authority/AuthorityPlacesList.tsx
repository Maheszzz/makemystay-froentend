import React from 'react';
import type { AuthorityPlaceItem } from '@/data/authority/types';

interface AuthorityPlacesListProps {
    title: string;
    icon: React.ReactNode;
    items: AuthorityPlaceItem[];
}

export function AuthorityPlacesList({ title, icon, items }: AuthorityPlacesListProps) {
    if (!items.length) return null;
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-brand-red">{icon}</span>
                {title}
            </h3>
            <ul className="space-y-3">
                {items.map((item, idx) => (
                    <li key={idx} className="text-sm">
                        <div className="flex items-baseline justify-between">
                            <span className="font-medium text-slate-900">{item.name}</span>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2 shrink-0">{item.distance}</span>
                        </div>
                        {item.note && <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.note}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
