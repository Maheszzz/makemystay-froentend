'use client';

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export function AuthorityCalculators() {
    const [rent, setRent] = useState<number>(12000);
    const [depositMonths, setDepositMonths] = useState<number>(2);

    const totalDeposit = rent * depositMonths;
    const estimatedBrokerage = rent * 0.5; // Half month assumed if applicable
    const upfrontCost = rent + totalDeposit;

    return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm" aria-labelledby="calc-heading">
            <h2 id="calc-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-brand-red" />
                Interactive Rent & Deposit Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Rent (₹)</label>
                        <input 
                            type="range" 
                            min="5000" 
                            max="30000" 
                            step="500"
                            value={rent} 
                            onChange={(e) => setRent(Number(e.target.value))}
                            className="w-full accent-brand-red"
                        />
                        <div className="text-right text-lg font-bold text-slate-900 mt-1">₹{rent.toLocaleString()}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Security Deposit (Months)</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 5, 10].map(months => (
                                <button 
                                    key={months}
                                    onClick={() => setDepositMonths(months)}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors ${depositMonths === months ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                                >
                                    {months}M
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Estimated Upfront Cost</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">1st Month Rent</span>
                            <span className="font-semibold text-slate-900">₹{rent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Security Deposit ({depositMonths} Months)</span>
                            <span className="font-semibold text-slate-900">₹{totalDeposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 border-b border-slate-200 pb-3">
                            <span>Brokerage (Optional)</span>
                            <span>+ ₹{estimatedBrokerage.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-slate-900">Total Upfront (Excl. Brokerage)</span>
                            <span className="text-2xl font-extrabold text-brand-red">₹{upfrontCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
