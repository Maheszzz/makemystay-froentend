import { Search, Calendar, Home } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: Search,
        title: 'Search',
        desc: 'Browse verified listings by location, budget, and type. Smart filters narrow your perfect match in seconds.',
    },
    {
        number: '02',
        icon: Calendar,
        title: 'Book',
        desc: 'Schedule a visit or lock in your stay instantly. No broker, no middleman — just you and your new home.',
    },
    {
        number: '03',
        icon: Home,
        title: 'Move In',
        desc: 'All paperwork handled digitally. Move into your verified, ready-to-occupy property with zero hassle.',
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16 animate-on-scroll">
                    <span className="inline-block px-4 py-1.5 bg-red-50 text-brand-red font-semibold tracking-wide uppercase text-xs rounded-full mb-3">
                        Simple & Fast
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        How It <span className="text-brand-red">Works</span>
                    </h2>
                    <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                        From first click to front door in three easy steps.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative">
                    <svg
                        className="absolute top-10 left-0 w-full h-4 hidden md:block pointer-events-none"
                        viewBox="0 0 1000 20"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <line
                            x1="0" y1="10"
                            x2="1000" y2="10"
                            stroke="#C62828"
                            strokeWidth="2"
                            strokeDasharray="1000"
                            strokeDashoffset="1000"
                            className="connector-line"
                        />
                    </svg>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center animate-on-scroll"
                                style={{ transitionDelay: `${idx * 120}ms` }}
                            >
                                {/* Number Circle */}
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 rounded-full bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/30 group hover:scale-110 transition-transform duration-300">
                                        <step.icon className="w-9 h-9 text-white" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-brand-red text-brand-red text-xs font-black flex items-center justify-center">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
