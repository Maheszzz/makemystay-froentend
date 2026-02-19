import { motion } from 'framer-motion';
import { ArrowRight, Building2, Wallet, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
    {
        id: 'property-management',
        title: "Property Management",
        desc: "End-to-end management for assets",
        icon: Building2,
        color: "text-brand-red"
    },
    {
        id: 'revenue-optimization',
        title: "Revenue Optimization",
        desc: "AI-driven pricing tools",
        icon: Wallet,
        color: "text-brand-red"
    },
    {
        id: 'tenant-acquisition',
        title: "Tenant Acquisition",
        desc: "Automated leasing & checks",
        icon: Users,
        color: "text-accent-purple"
    },
    {
        id: 'market-intelligence',
        title: "Market Intelligence",
        desc: "Real-time rental data",
        icon: BarChart3,
        color: "text-accent-coral"
    }
];

export function ServicesGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-full items-stretch">
            {services.map((service, index) => (
                <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Gradient Border Effect */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-brand-red to-accent-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className={`w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all`}>
                                <service.icon className={`w-7 h-7 ${service.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-navy transition-colors">{service.title}</h3>
                            <p className="text-slate-500 group-hover:text-slate-600 leading-relaxed text-sm">
                                {service.desc}
                            </p>
                        </div>

                        <div className="pt-6 mt-4 border-t border-slate-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                            <Link to={`/services/${service.id}`} className="flex items-center text-sm font-bold text-brand-red cursor-pointer">
                                Learn More <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
