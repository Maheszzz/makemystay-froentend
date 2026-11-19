import { ArrowRight, Building2, Wallet, Users, BarChart3 } from 'lucide-react';
import { Link } from '@/lib/navigation';

const services = [
    {
        id: 'property-management',
        title: 'Property Management',
        desc: 'Full-service operations & maintenance oversight',
        icon: Building2,
    },
    {
        id: 'revenue-optimization',
        title: 'Revenue Optimization',
        desc: 'Dynamic pricing powered by real-time market data',
        icon: Wallet,
    },
    {
        id: 'tenant-acquisition',
        title: 'Tenant Acquisition',
        desc: 'Verified tenant sourcing & seamless onboarding',
        icon: Users,
    },
    {
        id: 'market-intelligence',
        title: 'Market Intelligence',
        desc: 'Advanced rental insights & performance analytics',
        icon: BarChart3,
    },
];

export function ServicesGrid() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="relative group rounded-[var(--radius-pdp)] p-6 bg-white border border-line hover:border-ink/35 transition-colors"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-blush-100 border border-line">
                                <service.icon className="w-6 h-6 text-red" />
                            </div>

                            <h3 className="text-base font-bold text-ink mb-2 group-hover:text-red transition-colors">
                                {service.title}
                            </h3>

                            <p className="text-slate text-sm leading-relaxed flex-1">{service.desc}</p>

                            <div className="mt-5 flex items-center justify-between">
                                <Link
                                    to={`/services/${service.id}`}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors"
                                >
                                    Explore Service
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blush-100">
                                        <ArrowRight className="w-3.5 h-3.5 text-red" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-sm text-slate mt-8">
                Built for PG &amp; rental property owners across Bangalore.
            </p>
        </div>
    );
}
