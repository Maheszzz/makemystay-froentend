import React from 'react';
import type { AuthorityRentTableRow } from '@/data/authority/types';

export function AuthorityRentTable({ rows }: { rows: AuthorityRentTableRow[] }) {
    if (!rows.length) return null;
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                        <th className="py-3 px-4 w-1/4">Room Type</th>
                        <th className="py-3 px-4 w-1/4">Price Range</th>
                        <th className="py-3 px-4 w-1/2">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-slate-900">{row.roomType}</td>
                            <td className="py-3 px-4 font-bold text-brand-red">{row.priceRange}</td>
                            <td className="py-3 px-4 text-slate-600 leading-relaxed">{row.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
