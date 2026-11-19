'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSmartBack } from '@/hooks';
import { ArrowLeft, ArrowRight, BarChart3, Building2, CheckCircle, Phone, Users, Wallet } from 'lucide-react';
import { Link, useParams } from '@/lib/navigation';

export default function ServiceDetail() {
    const { serviceId } = useParams();
    const goBack = useSmartBack({ fallback: '/#services' });

    const servicesData: Record<string, any> = {
        'property-management': {
            title: 'Elevated Property Management',
            shortTitle: 'Property Management',
            icon: Building2,
            tagline: 'Premium Asset Oversight',
            description: 'Comprehensive asset management tailored for premium properties — from tenant onboarding to maintenance and performance tracking.',
            fullDescription: 'We handle every aspect of your property lifecycle with transparent reporting and dedicated support, so you enjoy returns without the hassle.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Tenant onboarding & documentation',
                'Preventive maintenance scheduling',
                'Issue resolution & escalation support',
                'Monthly performance reports',
                'Long-term value preservation',
                'Dedicated relationship manager',
            ],
            stats: [
                { value: '500+', label: 'Units Managed' },
                { value: '95%', label: 'Occupancy Rate' },
                { value: '24/7', label: 'Tenant Support' },
                { value: '4.8★', label: 'Owner Rating' },
            ],
        },
        'revenue-optimization': {
            title: 'Intelligent Revenue Optimization',
            shortTitle: 'Revenue Optimization',
            icon: Wallet,
            tagline: 'Maximize Your Returns',
            description: 'Dynamic pricing powered by real-time market data — designed to maximize occupancy and rental income simultaneously.',
            fullDescription: 'Our AI-driven pricing engine continuously analyses demand signals and competitor rates to ensure your property earns its full potential.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Real-time market demand analysis',
                'Dynamic pricing automation',
                'Occupancy gap identification',
                'Competitive positioning reports',
                'Revenue performance tracking',
                'Monthly optimization reviews',
            ],
            stats: [
                { value: '30%', label: 'Avg. Revenue Lift' },
                { value: '95%', label: 'Occupancy Rate' },
                { value: '2x', label: 'Faster Leasing' },
                { value: '4.8★', label: 'Owner Rating' },
            ],
        },
        'tenant-acquisition': {
            title: 'Premium Tenant Acquisition',
            shortTitle: 'Tenant Acquisition',
            icon: Users,
            tagline: 'Quality Tenant Matching',
            description: 'Verified tenant sourcing & seamless onboarding — reducing vacancy time without compromising on quality.',
            fullDescription: 'Our structured screening process connects your property with professionals and families who meet your standards, fast.',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Multi-channel prospect sourcing',
                'Background & employment verification',
                'Streamlined digital onboarding',
                'Reduced vacancy periods',
                'Tenant quality scoring',
                'End-to-end leasing support',
            ],
            stats: [
                { value: '2,000+', label: 'Tenants Placed' },
                { value: '7 Days', label: 'Avg. Fill Time' },
                { value: '98%', label: 'Retention Rate' },
                { value: '4.9★', label: 'Tenant Rating' },
            ],
        },
        'market-intelligence': {
            title: 'Advanced Market Intelligence',
            shortTitle: 'Market Intelligence',
            icon: BarChart3,
            tagline: 'Data-Driven Decisions',
            description: 'Advanced rental insights & performance analytics — so you always invest with confidence.',
            fullDescription: 'We combine live rental market data with historical trends to give property owners a clear picture of where to invest and when.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Hyperlocal rental trend analysis',
                'Pricing benchmark comparisons',
                'Demand pattern forecasting',
                'Location-based opportunity maps',
                'Property type performance data',
                'Strategic investment advisory',
            ],
            stats: [
                { value: '50+', label: 'Micro-markets Tracked' },
                { value: 'Live', label: 'Data Refresh' },
                { value: '10+', label: 'Data Sources' },
                { value: '4.8★', label: 'Advisor Rating' },
            ],
        },
    };

    const service = servicesData[serviceId || ''];

    if (!service) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Service Not Found</h1>
                    <button
                        type="button"
                        onClick={goBack}
                        className="text-brand-red hover:underline"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const ServiceIcon = service.icon;

    return (
        <div className="min-h-screen bg-page text-ink">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="relative min-h-[70vh] overflow-hidden flex items-center bg-red-900">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-30" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-2 text-red-subtitle hover:text-white mb-10 lg:mb-14 transition-colors group -ml-2 p-2"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs tracking-widest uppercase">Back</span>
                    </button>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Tagline Badge */}
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8 bg-red-800 border border-champagne/35">
                                <ServiceIcon className="w-4 h-4 text-champagne" />
                                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red-subtitle">
                                    {service.tagline}
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal text-white mb-6 leading-[1.08] tracking-tight">
                                {service.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg lg:text-xl text-white leading-relaxed mb-5 max-w-xl">
                                {service.description}
                            </p>
                            <p className="text-base text-red-subtitle leading-relaxed mb-10 max-w-xl">
                                {service.fullDescription}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/contact-us"
                                    className="group px-8 py-4 text-white font-semibold rounded-[10px] bg-red hover:bg-red-hover flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
                                >
                                    Schedule a Consultation
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="https://wa.me/918150099911?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group px-8 py-4 font-semibold rounded-[10px] border border-white text-white hover:bg-white/10 flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    Talk to an Expert
                                </a>
                            </div>
                        </div>

                        {/* Right — Icon Display */}
                        <div className="flex items-center justify-center mt-8 lg:mt-0">
                            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-[var(--radius-pdp)] bg-red-800 border border-champagne/30 flex items-center justify-center">
                                <ServiceIcon className="w-24 h-24 lg:w-32 lg:h-32 text-champagne" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Row ── */}
            <section className="py-10 bg-white border-y border-line">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {service.stats.map((stat: { value: string; label: string }, i: number) => (
                            <div key={i}>
                                <p className="font-serif-display text-3xl font-normal mb-1 text-red tabular-nums">{stat.value}</p>
                                <p className="text-sm text-slate tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="relative py-16 md:py-24 bg-page">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="font-serif-display text-3xl md:text-5xl font-normal text-ink mb-4">
                            What you gain with us
                        </h2>
                        <div className="w-12 h-[1px] bg-champagne mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.features.map((feature: string, idx: number) => (
                            <div
                                key={idx}
                                className="group p-7 rounded-[var(--radius-pdp)] bg-white border border-line hover:border-ink/35 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-blush-100 border border-line">
                                        <CheckCircle className="w-4 h-4 text-red" />
                                    </div>
                                    <p className="text-ink font-medium leading-relaxed pt-1">{feature}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA Section ── */}
            <section className="py-16 md:py-24 bg-red-800 border-t border-champagne/25">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif-display text-3xl md:text-5xl font-normal text-white mb-5 leading-tight">
                        Maximize your property&apos;s{' '}
                        <em className="italic">potential today</em>
                    </h2>
                    <div className="w-12 h-[1px] bg-champagne mx-auto mb-5" />
                    <p className="text-lg text-red-subtitle mb-10 max-w-2xl mx-auto leading-relaxed">
                        Partner with a dedicated management team focused on performance, protection, and profitability.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact-us"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red hover:bg-red-hover text-white font-semibold rounded-[10px] transition-colors"
                        >
                            Book a Strategy Call
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="tel:+918150099911"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-[10px] border border-white text-white hover:bg-white/10 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
