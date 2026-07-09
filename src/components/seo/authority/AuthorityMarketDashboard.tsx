import React from 'react';
import type { AuthorityMarketDashboardData } from '@/data/authority/types';
import { LineChart, Home, Activity, CheckCircle } from 'lucide-react';

export function AuthorityMarketDashboard({ data, name }: { data: AuthorityMarketDashboardData, name: string }) {
    return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm" aria-labelledby="market-heading">
            <div className="flex items-center justify-between mb-6">
                <h2 id="market-heading" className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <LineChart className="w-6 h-6 text-brand-red" />
                    Live Rental Market in {name}
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" /> Live Data
                </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Home className="w-3 h-3"/> Active Listings</div>
                    <div className="text-2xl font-bold text-slate-900">{data.activeListingsCount}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Avg. Male Rent</div>
                    <div className="text-2xl font-bold text-slate-900">₹{data.averageRentMale.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Avg. Female Rent</div>
                    <div className="text-2xl font-bold text-slate-900">₹{data.averageRentFemale.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Occupancy Rate</div>
                    <div className="text-2xl font-bold text-slate-900">{data.occupancyRate}</div>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">Current Demand Trend: <strong className="text-brand-red">{data.demandTrend}</strong></span>
                <span className="text-slate-400 text-xs">Last updated: {data.dataDate}</span>
            </div>
        </section>
    );
}
