import { Phone, MessageCircle, Mail } from 'lucide-react';

export function MobileBottomCTA() {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div
                className="flex items-center justify-around px-4 py-2"
                style={{
                    background: 'rgba(18,15,9,0.96)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(197,160,33,0.15)',
                }}
            >
                {/* Call */}
                <a
                    href="tel:+918150099911"
                    aria-label="Call us"
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full active:scale-95 transition-transform"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Phone className="w-3.5 h-3.5" style={{ color: 'rgba(197,160,33,0.8)' }} strokeWidth={2} />
                    <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Montserrat', sans-serif" }}
                    >
                        Call
                    </span>
                </a>

                {/* WhatsApp — slightly elevated gold accent */}
                <a
                    href="https://wa.me/919844594800?text=Hi,%20I'm%20interested%20in%20MakeMyStay"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp us"
                    className="flex items-center gap-1.5 py-2 px-5 rounded-full active:scale-95 transition-transform"
                    style={{
                        background: 'linear-gradient(135deg, #D4A827, #B8921C)',
                        boxShadow: '0 2px 12px rgba(197,160,33,0.3)',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    <MessageCircle className="w-4 h-4 text-[#1A1400]" strokeWidth={2} />
                    <span
                        className="text-[10px] font-bold uppercase tracking-wider text-[#1A1400]"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                        WhatsApp
                    </span>
                </a>

                {/* Enquire */}
                <a
                    href="/contact-us"
                    aria-label="Enquire now"
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full active:scale-95 transition-transform"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Mail className="w-3.5 h-3.5" style={{ color: 'rgba(197,160,33,0.8)' }} strokeWidth={2} />
                    <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Montserrat', sans-serif" }}
                    >
                        Enquire
                    </span>
                </a>
            </div>
        </div>
    );
}
