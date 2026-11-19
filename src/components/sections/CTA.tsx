import { Link } from '@/lib/navigation';
import { Calendar, MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { LeadCaptureModal } from '../modals/LeadCaptureModal';

export function CTA() {
    const [showContactCard, setShowContactCard] = useState(false);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const whatsappMessage = "Hi MakeMyStay! 👋 I visited the MakeMyStay website and am interested in finding a property. Can you help me with suitable listings?";
    const whatsappUrl = `https://wa.me/918150099911?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <section className="py-12 md:py-20 lg:py-24 bg-brand-band text-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="font-serif-display text-2xl sm:text-3xl md:text-5xl font-normal mb-4 md:mb-6 leading-tight text-white">
                    Stop losing profits to brokers.<br className="hidden md:block" />{' '}
                    <span className="italic">Start owning your growth.</span>
                </h2>
                <div className="w-12 h-[1px] bg-champagne mx-auto mb-5" aria-hidden="true" />
                <p className="text-base md:text-xl text-red-subtitle mb-8 md:mb-10 max-w-2xl mx-auto">
                    Connect with tenants directly, showcase verified photos, and automate visit scheduling without broker commissions.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center">
                    <Link
                        to="/schedule-demo"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red hover:bg-blush-100 font-semibold rounded-[10px] transition-colors text-base"
                    >
                        <Calendar className="w-5 h-5" />
                        Schedule Demo
                    </Link>
                    <button
                        onClick={() => setShowContactCard(true)}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-[10px] hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <Phone className="w-4 h-4" />
                        Contact Sales
                    </button>
                </div>
            </div>

            {/* Contact Card Modal */}
            {showContactCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[var(--radius-pdp)] border border-line shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Header */}
                        <div className="p-8 text-center relative bg-brand-band">
                            <button
                                onClick={() => setShowContactCard(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                                <span className="text-xl font-bold text-red">MS</span>
                            </div>
                            <h3 className="font-serif-display text-2xl font-normal text-white">Talk to a Growth Advisor</h3>
                            <p className="text-red-subtitle mt-1.5 text-sm">See how operators increase occupancy in 5–10 days.</p>
                        </div>

                        {/* Primary CTA */}
                        <div className="px-6 pt-5 pb-2">
                            <Link
                                to="/contact-us?type=demo"
                                onClick={() => setShowContactCard(false)}
                                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-[10px] font-semibold bg-red hover:bg-red-hover text-white transition-colors"
                            >
                                <Calendar className="w-5 h-5" />
                                Schedule Free Strategy Call
                            </Link>
                        </div>

                        {/* Secondary Contacts */}
                        <div className="p-6 pt-3 space-y-3">
                            <p className="text-xs font-semibold text-slate uppercase tracking-wider text-center mb-3">Or reach us directly</p>
                            <a
                                href="tel:+918150099911"
                                className="flex items-center gap-4 p-3.5 rounded-xl bg-page hover:bg-blush-100 border border-line transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-red" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate">Call us</div>
                                    <div className="font-bold text-ink text-sm tabular-nums">+91 81500 99911</div>
                                </div>
                            </a>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowContactCard(false);
                                    setShowLeadModal(true);
                                }}
                                className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 hover:bg-green-50 border border-slate-100 transition-colors group w-full text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-grow">
                                    <div className="text-xs text-slate-400">WhatsApp</div>
                                    <div className="font-bold text-slate-900 text-sm">Chat now → Response in 5 mins</div>
                                </div>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => setShowContactCard(false)}
                                className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LeadCaptureModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                title="Talk to a Growth Advisor"
                subtitle="We typically respond in 5 minutes via WhatsApp."
                source="Website - Contact CTA"
                whatsappUrl={whatsappUrl}
            />
        </section>
    );
}
