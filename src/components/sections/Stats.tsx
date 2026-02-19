import { useEffect, useRef } from 'react';

const statsData = [
    { target: 500, suffix: '+', label: 'Properties Listed' },
    { target: 10000, suffix: '+', label: 'Happy Tenants' },
    { target: 50, suffix: '+', label: 'Cities Covered' },
    { target: 4.8, suffix: '★', label: 'Average Rating', isDecimal: true },
];

function CountUp({ target, suffix, isDecimal }: { target: number; suffix: string; isDecimal?: boolean }) {
    const elRef = useRef<HTMLSpanElement>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasRun.current) {
                    hasRun.current = true;
                    // Ease-out cubic calculation
                    const duration = 1800;
                    const start = performance.now();
                    const frame = (now: number) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

                        const current = ease * target;
                        el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;

                        if (progress < 1) requestAnimationFrame(frame);
                        else el.setAttribute('data-target', target.toString()); // Mark done
                    };
                    requestAnimationFrame(frame);
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, suffix, isDecimal]);

    return (
        <span ref={elRef} data-target={target}>
            {(isDecimal ? '0.0' : '0') + suffix}
        </span>
    );
}

export function Stats() {
    return (
        <section className="bg-brand-red py-12 md:py-16 relative overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-diagonal-grid pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
                    {statsData.map((stat, idx) => (
                        <div key={idx} className="animate-on-scroll" style={{ transitionDelay: `${idx * 100}ms` }}>
                            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-none">
                                <CountUp target={stat.target} suffix={stat.suffix} isDecimal={stat.isDecimal} />
                            </div>
                            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
