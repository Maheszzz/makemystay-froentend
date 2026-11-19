"use client";

import { useState, useEffect } from 'react';
import { solutionFeatures } from '@/data/content';
import { CheckCircle2 } from 'lucide-react';

export function Solution() {
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="solution" className="py-12 md:py-20 lg:py-24 bg-white border-b border-line">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="text-champagne-text font-semibold tracking-wider uppercase text-xs">Our solution</span>
                    <h2 className="font-serif-display text-3xl md:text-5xl font-normal text-ink mt-2">
                        Full-stack AI growth engine
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    {/* Features Menu */}
                    <div className="lg:w-1/3 flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide">
                        {solutionFeatures.map((feature, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveFeature(idx)}
                                className={`text-left p-4 lg:p-6 rounded-[var(--radius-pdp)] transition-colors border flex-shrink-0 w-[240px] lg:w-auto snap-start ${activeFeature === idx
                                    ? 'bg-blush-100 border-red'
                                    : 'bg-white border-line hover:bg-page'
                                    }`}
                            >
                                <h3 className={`text-lg font-bold mb-1 ${activeFeature === idx ? 'text-red' : 'text-ink'}`}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate">{feature.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Feature Display (Dark Red-800 Contrast Panel) */}
                    <div className="lg:w-2/3">
                        <div className="relative h-full min-h-[320px] md:min-h-[400px] bg-red-800 rounded-[var(--radius-pdp)] border border-champagne/30 overflow-hidden">
                            <div className="relative p-6 md:p-12 h-full flex flex-col justify-center">
                                <div className="transition-all duration-500">
                                    {solutionFeatures.map((item, idx) => (
                                        activeFeature === idx && (
                                            <div key={idx}>
                                                <div className="w-16 h-16 rounded-2xl bg-red-900 flex items-center justify-center mb-8 border border-champagne/30">
                                                    <item.icon className="w-8 h-8 text-champagne" />
                                                </div>
                                                <h3 className="font-serif-display text-2xl md:text-3xl font-normal text-white mb-4 md:mb-6">{item.title}</h3>
                                                <p className="text-base md:text-lg text-red-subtitle mb-6 md:mb-8 leading-relaxed max-w-xl">{item.text}</p>
                                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-900 text-white border border-champagne/35 text-sm font-semibold">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-champagne" />
                                                    {item.stats}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
