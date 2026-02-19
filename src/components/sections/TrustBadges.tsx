import { ShieldCheck, Phone, Star } from 'lucide-react';

const badges = [
    { icon: ShieldCheck, label: 'Verified Listings', desc: '100% checked & confirmed' },
    { icon: ShieldCheck, label: 'Secure Booking', desc: 'End-to-end encrypted' },
    { icon: Phone, label: '24/7 Support', desc: 'Always here for you' },
    { icon: Star, label: 'Top Rated', desc: '4.8★ across 10K+ reviews' },
];

export function TrustBadges() {
    return (
        <section className="relative overflow-hidden" style={{ background: 'rgba(198,40,40,0.06)', borderTop: '1px solid rgba(198,40,40,0.12)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.map((badge, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 animate-on-scroll"
                            style={{ transitionDelay: `${idx * 80}ms` }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center flex-shrink-0">
                                <badge.icon className="w-5 h-5 text-brand-red" />
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="font-bold text-slate-900 text-sm">{badge.label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{badge.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
