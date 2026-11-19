'use client';

import { useId, useState } from 'react';
import { Calculator, ShieldCheck, SlidersHorizontal, TrendingUp } from 'lucide-react';

const CALCULATOR_NOTES = [
    {
        icon: TrendingUp,
        title: 'Indicative estimate',
        desc: 'For planning monthly EMI and down payment budgets.',
    },
    {
        icon: ShieldCheck,
        title: 'Local calculation',
        desc: 'Runs directly in your browser without submitting personal data.',
    },
    {
        icon: SlidersHorizontal,
        title: 'Compare scenarios',
        desc: 'Adjust interest rate and loan tenure to compare totals.',
    },
] as const;

export function InvestmentCalculator() {
    const [price, setPrice] = useState<string | number>(500000);
    const [downPayment, setDownPayment] = useState<string | number>(20);
    const [rate, setRate] = useState<string | number>(6.5);
    const [term, setTerm] = useState<string | number>(30);

    const priceId = useId();
    const downPaymentId = useId();
    const rateId = useId();
    const termId = useId();

    const calculatePayment = () => {
        const numPrice = Number(price);
        const numDownPayment = Number(downPayment);
        const numRate = Number(rate);
        const numTerm = Number(term);

        const principal = numPrice * (1 - numDownPayment / 100);
        const monthlyRate = numRate / 100 / 12;
        const months = numTerm * 12;

        if (months <= 0 || principal <= 0) return 0;
        if (numRate === 0) return principal / months;

        return (
            (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1)
        );
    };

    const monthlyPayment = calculatePayment();
    const numPrice = Number(price);
    const numDownPayment = Number(downPayment);
    const numTerm = Number(term);

    const totalPayment = monthlyPayment * numTerm * 12;
    const totalInterest = Math.max(0, totalPayment - numPrice * (1 - numDownPayment / 100));

    const inputCls =
        'w-full min-h-[44px] px-4 py-3 bg-page border border-line rounded-[10px] text-ink text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus:border-red';

    return (
        <section
            aria-labelledby="investment-calc-heading"
            className="py-12 md:py-20 bg-blush-100 border-t border-line"
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-[14px] p-6 sm:p-8 lg:p-10 border border-line">
                    {/* Left: Inputs */}
                    <div>
                        <div className="flex items-center gap-3.5 mb-8">
                            <div className="w-11 h-11 rounded-[10px] bg-blush-100 text-red flex items-center justify-center shrink-0">
                                <Calculator className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <div>
                                <h2
                                    id="investment-calc-heading"
                                    className="font-heading text-2xl sm:text-3xl font-bold text-ink"
                                >
                                    Investment calculator
                                </h2>
                                <p className="text-sm text-slate mt-0.5">
                                    Calculate your monthly mortgage payments
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor={priceId}
                                    className="block text-sm font-medium text-ink mb-2"
                                >
                                    Property price
                                </label>
                                <div className="relative">
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate text-sm"
                                    >
                                        ₹
                                    </span>
                                    <input
                                        id={priceId}
                                        type="number"
                                        min={0}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className={`${inputCls} pl-8`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor={downPaymentId}
                                    className="block text-sm font-medium text-ink mb-2"
                                >
                                    Down payment (%)
                                </label>
                                <input
                                    id={downPaymentId}
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value)}
                                    className={`${inputCls} mb-3`}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    aria-label="Down payment percentage"
                                    value={downPayment === '' ? 0 : downPayment}
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                    className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor={rateId}
                                        className="block text-sm font-medium text-ink mb-2"
                                    >
                                        Interest rate (%)
                                    </label>
                                    <input
                                        id={rateId}
                                        type="number"
                                        step="0.1"
                                        min={0}
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor={termId}
                                        className="block text-sm font-medium text-ink mb-2"
                                    >
                                        Loan term (years)
                                    </label>
                                    <input
                                        id={termId}
                                        type="number"
                                        min={1}
                                        value={term}
                                        onChange={(e) => setTerm(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="flex flex-col justify-between">
                        <div className="bg-red-800 text-white rounded-[14px] border border-champagne/30 p-6 sm:p-8 mb-6">
                            <div className="text-red-subtitle text-sm mb-1">
                                Estimated monthly payment
                            </div>
                            <div className="font-heading text-4xl sm:text-5xl font-bold mb-8 tabular-nums">
                                ₹
                                {monthlyPayment.toLocaleString('en-IN', {
                                    maximumFractionDigits: 0,
                                })}
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-5 border-t border-champagne/25">
                                <div>
                                    <div className="text-red-subtitle text-xs sm:text-sm mb-1">
                                        Total payment
                                    </div>
                                    <div className="text-lg sm:text-xl font-bold tabular-nums">
                                        ₹
                                        {totalPayment.toLocaleString('en-IN', {
                                            maximumFractionDigits: 0,
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-red-subtitle text-xs sm:text-sm mb-1">
                                        Total interest
                                    </div>
                                    <div className="text-lg sm:text-xl font-bold tabular-nums">
                                        ₹
                                        {totalInterest.toLocaleString('en-IN', {
                                            maximumFractionDigits: 0,
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {CALCULATOR_NOTES.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.title} className="flex items-start gap-3.5">
                                        <span className="w-8 h-8 rounded-full bg-blush-100 text-red flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon className="w-4 h-4" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <p className="font-semibold text-ink text-sm">
                                                {item.title}
                                            </p>
                                            <p className="text-slate text-xs sm:text-sm mt-0.5">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
