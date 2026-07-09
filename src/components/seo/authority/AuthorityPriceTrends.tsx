import React from 'react';
import type { AuthorityPriceTrendRow } from '@/data/authority/types';
import { TrendingUp } from 'lucide-react';

export function AuthorityPriceTrends({ rows }: { rows: AuthorityPriceTrendRow[] }) {
    if (!rows.length) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-red" />
                <h4 className="text-sm font-bold text-slate-700">Historical Price Trends</h4>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {rows.map((row, idx) => (
                    <div key={idx} className="flex flex-col">
                        <span className="text-xs text-slate-500 font-semibold mb-1">{row.year}</span>
                        <span className="text-lg font-extrabold text-slate-900">{row.averagePrice}</span>
                        <span className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {row.percentageChange} YoY
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
