import { ArrowRight, Award, CheckCircle, Heart, Lightbulb, Phone, Target, Users } from 'lucide-react';
import { Link } from '@/lib/navigation';

const whatWeDo = [
    { icon: CheckCircle, title: 'Verified & quality-checked listings', desc: 'Every property is reviewed for accuracy before it goes live.' },
    { icon: Lightbulb, title: 'Smart property recommendations', desc: 'AI-powered matching surfaces the right homes for your needs.' },
    { icon: Award, title: 'Transparent pricing & insights', desc: 'No hidden costs. Clear data to help you decide with confidence.' },
    { icon: Users, title: 'Assistance from search to move-in', desc: 'A dedicated team guides you through every step.' },
    { icon: Target, title: 'Digital tools that eliminate follow-ups', desc: 'Seamless workflows that save you time and energy.' },
    { icon: Heart, title: 'Technology powered by real estate expertise', desc: 'Built by people who understand both sides of the transaction.' },
];

const trustPillars = [
    { value: 'Zero', label: 'Brokerage Fee' },
    { value: 'Real', label: 'Property Photos' },
    { value: 'Direct', label: 'Scheduled Visits' },
    { value: 'Clear', label: 'Upfront Pricing' },
];

export function About() {
    return (
        <section id="about-us" className="py-12 md:py-20 lg:py-24 bg-white border-t border-line">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <div className="text-center mb-14 md:mb-20">
                    <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4 text-champagne-text">
                        Who We Are
                    </p>
                    <h2 className="font-serif-display text-3xl sm:text-5xl font-normal text-ink mb-5 leading-tight tracking-[-0.015em]">
                        Redefining how India<br className="hidden sm:block" /> finds homes
                    </h2>
                    <div className="w-12 h-[1px] bg-champagne mx-auto mb-6" aria-hidden="true" />
                    <p className="text-lg text-slate max-w-3xl mx-auto leading-relaxed">
                        MakeMyStay.ai is a technology-driven real estate platform built to make property discovery simple, transparent, and intelligent.
                    </p>
                </div>

                {/* ── Manifesto Quote ── */}
                <div className="max-w-4xl mx-auto mb-16 md:mb-20 text-center">
                    <p className="text-slate text-base md:text-lg leading-relaxed mb-8">
                        Finding the right place to stay shouldn't be complicated. Whether you're searching for a rental home, a PG, or an investment opportunity, MakeMyStay helps you explore verified properties, compare options, and make confident decisions — all in one place.
                    </p>
                    <div className="relative inline-block">
                        <p className="font-serif-display text-xl md:text-2xl font-normal text-ink leading-snug pb-3">
                            Our goal is simple: make finding a place to live<br className="hidden sm:block" /> as easy as booking a trip.
                        </p>
                        <div className="mx-auto h-[1px] w-24 bg-champagne" aria-hidden="true" />
                    </div>
                </div>

                {/* ── Trust Pillars ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 md:mb-20">
                    {trustPillars.map((m, i) => (
                        <div key={i} className="text-center py-6 px-4 rounded-[var(--radius-pdp)] bg-page border border-line">
                            <p className="font-serif-display text-3xl font-normal mb-1 text-red">{m.value}</p>
                            <p className="text-xs text-slate tracking-wide font-medium">{m.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Our Story ── */}
                <div className="mb-16 md:mb-20">
                    <div className="rounded-[var(--radius-pdp)] p-7 md:p-12 bg-blush-100 border border-line border-l-4 border-l-champagne">
                        <h3 className="font-serif-display text-2xl md:text-3xl font-medium text-ink mb-8">
                            Our story
                        </h3>
                        <div className="space-y-5 text-slate leading-[1.8] text-base md:text-[17px]">
                            <p>
                                MakeMyStay was founded in <strong className="text-ink">2026</strong> in <strong className="text-ink">Bengaluru</strong> with a single vision: modernize the way people search for homes.
                            </p>
                            <p>
                                The traditional property search process is riddled with scattered information, opaque pricing, and exhausting follow-ups. We built MakeMyStay to eliminate that friction — bringing everything into one{' '}
                                <strong className="text-ink">seamless digital platform</strong> where users can discover, evaluate, and choose properties efficiently.
                            </p>
                            <p>
                                Today, we're building a smarter, more transparent real estate ecosystem — one trusted listing at a time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── What We Do ── */}
                <div className="mb-16 md:mb-20">
                    <div className="text-center mb-10">
                        <h3 className="font-serif-display text-2xl md:text-3xl font-medium text-ink mb-3">
                            What we do
                        </h3>
                        <p className="text-slate max-w-2xl mx-auto">MakeMyStay simplifies the property journey from search to decision:</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {whatWeDo.map((item, idx) => (
                            <div
                                key={idx}
                                className="group flex items-start gap-4 p-6 rounded-[var(--radius-pdp)] bg-white border border-line hover:border-ink/30 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-blush-100 border border-champagne/30">
                                    <item.icon className="w-5 h-5 text-red" />
                                </div>
                                <div>
                                    <p className="font-semibold text-ink mb-1 group-hover:text-red transition-colors">{item.title}</p>
                                    <p className="text-sm text-slate leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Vision & Mission ── */}
                <div className="grid md:grid-cols-2 gap-6 mb-16 md:mb-20">
                    {/* Vision */}
                    <div className="rounded-[var(--radius-pdp)] p-10 text-white flex flex-col bg-red-800 border border-champagne/30">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6 bg-red-900 border border-champagne/30">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-red-subtitle mb-2">Our vision</p>
                        <h3 className="font-serif-display text-xl font-normal mb-5 leading-snug text-white">
                            India's most trusted home discovery platform.
                        </h3>
                        <p className="text-red-subtitle leading-[1.8] text-[15px] flex-1">
                            To become the platform where every Indian discovers, compares, and secures a home with complete transparency — no confusion, no friction, just confidence.
                        </p>
                    </div>
                    {/* Mission */}
                    <div className="rounded-[var(--radius-pdp)] p-10 text-white flex flex-col bg-red-900 border border-champagne/30">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6 bg-red-800 border border-champagne/30">
                            <Lightbulb className="w-5 h-5 text-champagne" />
                        </div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-red-subtitle mb-2">Our mission</p>
                        <h3 className="font-serif-display text-xl font-normal mb-5 leading-snug text-white">
                            Simplify. Empower. Deliver.
                        </h3>
                        <ul className="space-y-4 text-red-subtitle flex-1">
                            {['Simplify property discovery for everyone', 'Bring transparency & trust to every transaction', 'Use technology to delight, not complicate', 'Help people find homes that match their lives'].map((m, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-champagne" />
                                    <span className="text-[14px] leading-relaxed">{m}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Founder ── */}
                <div className="mb-16 md:mb-20 rounded-[var(--radius-pdp)] p-8 md:p-12 bg-page border border-line">
                    <h3 className="font-serif-display text-2xl md:text-3xl font-medium text-ink mb-10 text-center">Our founder</h3>
                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        {/* Avatar */}
                        <div className="shrink-0">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold bg-red">
                                M
                            </div>
                        </div>
                        {/* Content */}
                        <div className="text-center sm:text-left">
                            <h4 className="text-xl font-bold text-ink mb-0.5">Madhava R</h4>
                            <p className="text-sm font-medium mb-4 text-red">Founder, MakeMyStay</p>
                            <p className="text-slate leading-[1.8] mb-5">
                                Madhava founded MakeMyStay with a mission to bring transparency, efficiency, and technology-driven solutions to the real estate ecosystem — making property discovery faster, simpler, and more reliable for modern customers.
                            </p>
                            <blockquote className="relative pl-4 text-slate italic text-[15px] leading-relaxed border-l-2 border-champagne">
                                "Real estate should empower people, not confuse them."
                            </blockquote>
                        </div>
                    </div>
                </div>

                {/* ── Trust Strip ── */}
                <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: CheckCircle, label: 'Direct Visit Scheduling' },
                        { icon: Phone, label: 'WhatsApp & Call Support' },
                        { icon: Award, label: 'Transparent Pricing' },
                        { icon: Heart, label: 'Zero Tenant Brokerage' },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center gap-2 p-4 rounded-[var(--radius-pdp)] bg-blush-100 border border-line">
                            <t.icon className="w-4 h-4 shrink-0 text-red" />
                            <span className="text-xs font-semibold text-ink leading-snug">{t.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Final CTA (Brand Gradient + SVG Line Pattern Band) ── */}
                <div className="rounded-3xl p-10 md:p-16 lg:p-20 text-center text-white bg-brand-band border border-champagne/30">
                    <Heart className="w-10 h-10 mx-auto mb-6 text-white" aria-hidden />
                    <h3 className="font-serif-display text-3xl sm:text-5xl font-normal mb-4 leading-tight text-white">
                        Ready to find<br className="hidden sm:block" />{' '}
                        <em className="italic">your next home?</em>
                    </h3>
                    <div className="w-12 h-[1px] bg-champagne mx-auto mb-5" aria-hidden="true" />
                    <p className="text-red-subtitle mb-10 max-w-lg mx-auto leading-relaxed">
                        Browse verified listings across Bangalore — from PGs and rental flats to homes and plots.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/properties"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[10px] font-semibold bg-white text-red hover:bg-blush-100 transition-colors"
                        >
                            Explore Properties
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="https://wa.me/918150099911?text=Hi%2C%20I%20want%20to%20find%20a%20home%20through%20MakeMyStay."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[10px] font-semibold border border-white text-white hover:bg-white/10 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Talk to an Advisor
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
