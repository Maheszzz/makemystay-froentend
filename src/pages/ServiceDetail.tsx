import { useParams, Link } from 'react-router-dom';
import { Building2, Wallet, Users, BarChart3, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ServiceDetail() {
    const { serviceId } = useParams();

    const servicesData: Record<string, any> = {
        'property-management': {
            title: "Property Management",
            icon: Building2,
            tagline: "Premium Asset Oversight",
            description: "Managing a property involves more than just collecting rent—it requires consistent oversight, tenant coordination, and regular maintenance to preserve value and ensure a smooth living experience.",
            fullDescription: "Our property management service handles everything from tenant onboarding and documentation to maintenance scheduling and issue resolution. With structured processes and transparent reporting, property owners can stay informed while enjoying a hassle-free ownership experience.",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
            features: [
                "Tenant onboarding and documentation",
                "Maintenance scheduling and coordination",
                "Issue resolution and support",
                "Transparent reporting and updates",
                "Property value preservation",
                "Professional oversight"
            ]
        },
        'revenue-optimization': {
            title: "Revenue Optimization",
            icon: Wallet,
            tagline: "Maximize Your Returns",
            description: "Maximizing rental income requires understanding market demand, pricing trends, and occupancy patterns. Our revenue optimization approach uses data insights and market analysis to recommend competitive pricing strategies.",
            fullDescription: "By aligning pricing with real-time market conditions and property performance, we help property owners achieve sustainable and optimized revenue growth that improves occupancy rates and long-term returns.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
            features: [
                "Market demand analysis",
                "Dynamic pricing strategies",
                "Occupancy pattern insights",
                "Competitive market positioning",
                "Revenue performance tracking",
                "Long-term return optimization"
            ]
        },
        'tenant-acquisition': {
            title: "Tenant Acquisition",
            icon: Users,
            tagline: "Quality Tenant Matching",
            description: "Finding reliable tenants can be time-consuming and uncertain without the right process in place. Our tenant acquisition service simplifies this by connecting properties with qualified prospects.",
            fullDescription: "Through conducting verification checks and streamlining onboarding procedures, this structured approach reduces vacancy time, improves tenant quality, and ensures a smoother leasing experience for both owners and residents.",
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200",
            features: [
                "Qualified prospect matching",
                "Background verification checks",
                "Streamlined onboarding process",
                "Reduced vacancy periods",
                "Quality tenant screening",
                "Professional leasing support"
            ]
        },
        'market-intelligence': {
            title: "Market Intelligence",
            icon: BarChart3,
            tagline: "Data-Driven Decisions",
            description: "Real estate decisions are strongest when supported by accurate and timely data. Our market intelligence tools provide insights into rental trends, pricing benchmarks, and demand patterns.",
            fullDescription: "These insights help property owners and investors make informed decisions across different locations and property types, plan effectively, and adapt strategies based on evolving market conditions.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
            features: [
                "Rental trend analysis",
                "Pricing benchmarks",
                "Demand pattern insights",
                "Location-based data",
                "Property type comparisons",
                "Strategic planning support"
            ]
        }
    };

    const service = servicesData[serviceId || ''];

    if (!service) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Service Not Found</h1>
                    <Link to="/" className="text-brand-red hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const ServiceIcon = service.icon;

    return (
        <div className="min-h-screen bg-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen overflow-hidden flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    {/* Back Button */}
                    <Link
                        to="/#services"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-12 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm tracking-wider uppercase">Back to Services</span>
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 mb-8">
                                <ServiceIcon className="w-5 h-5 text-amber-400" />
                                <span className="text-amber-400 text-xs font-normal tracking-[0.2em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {service.tagline}
                                </span>
                            </div>

                            <h1
                                className="text-6xl md:text-7xl font-medium text-white mb-6 leading-tight tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {service.title}
                            </h1>

                            <p className="text-xl text-white/80 leading-relaxed mb-8">
                                {service.description}
                            </p>

                            <p className="text-lg text-white/70 leading-relaxed mb-12">
                                {service.fullDescription}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/contact-us"
                                    className="group px-8 py-4 bg-brand-red text-white font-semibold rounded-lg hover:bg-brand-red/90 transition-all duration-300 flex items-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                                >
                                    Explore More
                                </Link>
                            </div>
                        </div>

                        {/* Right - Icon Display */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative">
                                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-brand-red/20 to-amber-400/20 blur-3xl absolute inset-0"></div>
                                <div className="relative w-64 h-64 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                                    <ServiceIcon className="w-32 h-32 text-brand-red" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 bg-gradient-to-b from-black to-brand-charcoal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2
                            className="text-5xl md:text-6xl font-medium text-white mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            What We Offer
                        </h2>
                        <div className="w-24 h-1 bg-brand-red mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {service.features.map((feature: string, idx: number) => (
                            <div
                                key={idx}
                                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-red/50 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 text-brand-red flex-shrink-0 mt-1" />
                                    <p className="text-white/90 font-medium leading-relaxed">{feature}</p>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-brand-red to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 bg-gradient-to-br from-brand-charcoal to-black overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 bg-diagonal-grid"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2
                        className="text-5xl md:text-6xl font-medium text-white mb-8"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Ready to Transform Your Property?
                    </h2>
                    <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                        Let our experts help you with {service.title.toLowerCase()} and maximize your investment returns.
                    </p>
                    <Link
                        to="/contact-us"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-brand-red text-white font-bold rounded-lg hover:bg-brand-red/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-brand-red/50"
                    >
                        Contact Us Today
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
