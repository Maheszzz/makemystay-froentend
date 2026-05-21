import { motion } from 'framer-motion';
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

const stats = [
    { value: '500+', label: 'Properties Managed' },
    { value: '95%', label: 'Occupancy Rate' },
    { value: '2,000+', label: 'Tenants Served' },
    { value: '4.8★', label: 'Avg. Rating' },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    }),
};

export function ServicesGrid() {
    return (
        <div className="w-full">
            {/* 2x2 grid on desktop, 1 col on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={cardVariants}
                        whileHover={{ scale: 1.02, y: -3 }}
                        className="relative group rounded-[20px] p-6 overflow-hidden transition-all duration-300 hover:shadow-xl"
                        style={{
                            background: '#F7F8FA',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Subtle inner gradient */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]"
                            style={{ background: 'linear-gradient(135deg, rgba(197,160,33,0.04) 0%, rgba(255,255,255,0) 60%)' }}
                        />

                        {/* Gold accent bottom bar */}
                        <div
                            className="absolute bottom-0 left-0 h-[3px] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-b-[20px]"
                            style={{ background: 'linear-gradient(90deg,#C5A021,#A8761A)' }}
                        />

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Icon */}
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-md"
                                style={{ background: 'rgba(197,160,33,0.10)' }}
                            >
                                <service.icon className="w-6 h-6" style={{ color: '#B11226' }} />
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#B11226] transition-colors">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-500 text-sm leading-relaxed flex-1">
                                {service.desc}
                            </p>

                            {/* CTA arrow */}
                            <div className="mt-5 flex items-center justify-between">
                                <Link
                                    to={`/services/${service.id}`}
                                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                                    style={{ color: '#B11226' }}
                                >
                                    Explore Service
                                    <span
                                        className="inline-flex items-center justify-center w-6 h-6 rounded-full transition-all group-hover:translate-x-0.5"
                                        style={{ background: 'rgba(177,18,38,0.08)' }}
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" style={{ color: '#B11226' }} />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="text-center py-4 px-3 rounded-2xl"
                        style={{ background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.05)' }}
                    >
                        <p className="text-xl font-bold" style={{ color: '#B11226' }}>{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Trust line */}
            <p className="text-center text-sm text-slate-400 mt-6">
                Trusted by property owners across Bangalore.
            </p>
        </div>
    );
}
