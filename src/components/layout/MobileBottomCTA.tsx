import { Phone, MessageCircle, Mail } from 'lucide-react';

export function MobileBottomCTA() {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)', paddingTop: '8px' }}
        >
            <div
                className="flex items-center justify-between gap-1 sm:gap-2"
                style={{
                    background: 'rgba(0,0,0,0.78)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    height: '64px',
                    padding: '0 8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {/* Call */}
                <a
                    href="tel:+918150099911"
                    aria-label="Call us"
                    className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 h-10 rounded-xl transition-all active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Phone className="w-3.5 h-3.5" style={{ color: 'rgba(197,160,33,0.85)' }} strokeWidth={2} />
                    <span
                        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Montserrat', sans-serif" }}
                    >
                        Call
                    </span>
                </a>

                {/* Divider */}
                <div className="w-px h-7 bg-white/10 shrink-0" />

                {/* WhatsApp — Primary Gold CTA */}
                <a
                    href="https://wa.me/919844594800?text=Hi,%20I'm%20interested%20in%20MakeMyStay"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp us"
                    className="flex flex-col items-center justify-center gap-0.5 px-2 min-[400px]:px-4 sm:px-7 h-11 rounded-2xl active:scale-95 transition-all shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, #D4A827 0%, #A8761A 100%)',
                        boxShadow: '0 4px 16px rgba(197,160,33,0.35)',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" strokeWidth={2.5} />
                        <span
                            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            Instant Assistance
                        </span>
                    </div>
                    <span className="text-[7.5px] sm:text-[8px] font-medium text-black/60 tracking-wide leading-none">
                        Response in 5 mins
                    </span>
                </a>

                {/* Divider */}
                <div className="w-px h-7 bg-white/10 shrink-0" />

                {/* Enquire */}
                <a
                    href="/contact-us"
                    aria-label="Enquire now"
                    className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 h-10 rounded-xl transition-all active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Mail className="w-3.5 h-3.5" style={{ color: 'rgba(197,160,33,0.85)' }} strokeWidth={2} />
                    <span
                        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Montserrat', sans-serif" }}
                    >
                        Enquire
                    </span>
                </a>
            </div>
        </div>
    );
}
