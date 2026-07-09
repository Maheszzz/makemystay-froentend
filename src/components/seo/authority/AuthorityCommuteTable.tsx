import React from 'react';
import type { AuthorityCommuteTableRow } from '@/data/authority/types';


export function AuthorityCommuteTable({ rows }: { rows: AuthorityCommuteTableRow[] }) {
    if (!rows.length) return null;
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                        <th className="py-3 px-4">Destination</th>
                        <th className="py-3 px-4">Distance</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4 text-orange-700">Peak Time</th>
                        <th className="py-3 px-4 text-green-700">Off-Peak Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-slate-900">{row.destination}</td>
                            <td className="py-3 px-4 text-slate-500">{row.distance}</td>
                            <td className="py-3 px-4 text-slate-500">{row.mode}</td>
                            <td className="py-3 px-4 font-semibold text-orange-600">{row.peakTime}</td>
                            <td className="py-3 px-4 font-semibold text-green-600">{row.offPeakTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
