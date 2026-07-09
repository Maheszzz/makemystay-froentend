'use client';

import React, { useEffect, useState } from 'react';

const SECTIONS = [
    { id: 'intro-heading', label: 'Overview' },
    { id: 'market-heading', label: 'Market Trends' },
    { id: 'personas-heading', label: 'Who Should Live Here' },
    { id: 'connectivity-heading', label: 'Commute' },
    { id: 'calc-heading', label: 'Calculator' },
    { id: 'rent-heading', label: 'Rent Pricing' },
    { id: 'insights-heading', label: 'Local Insights' },
    { id: 'lifestyle-heading', label: 'Lifestyle' },
    { id: 'properties-heading', label: 'Properties' },
];

export function AuthorityStickyTOC() {
    const [activeId, setActiveId] = useState<string>('intro-heading');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            let currentActive = SECTIONS[0].id;
            
            for (const section of SECTIONS) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition) {
                    currentActive = section.id;
                }
            }
            setActiveId(currentActive);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="sticky top-24 hidden xl:block bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-[250px]">
            <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Table of Contents</h4>
            <ul className="space-y-3 border-l-2 border-slate-100">
                {SECTIONS.map(section => (
                    <li key={section.id}>
                        <button 
                            onClick={() => scrollTo(section.id)}
                            className={`text-sm text-left pl-4 -ml-[2px] border-l-2 py-0.5 transition-colors ${activeId === section.id ? 'border-brand-red text-brand-red font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            {section.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
