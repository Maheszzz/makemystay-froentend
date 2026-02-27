import { Phone, MessageCircle, Mail } from 'lucide-react';

export function MobileBottomCTA() {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            {/* ── Luxury bar ── */}
            <div
                style={{
                    background: 'linear-gradient(180deg, rgba(26,22,14,0.97) 0%, rgba(18,15,9,1) 100%)',
                    backdropFilter: 'blur(28px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                    borderTop: '1px solid rgba(197,160,33,0.22)',
                    boxShadow: '0 -1px 0 rgba(197,160,33,0.08), 0 -12px 48px rgba(0,0,0,0.7)',
                }}
            >
                {/* Gold hairline accent at very top */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(197,160,33,0.55) 30%, rgba(197,160,33,0.75) 50%, rgba(197,160,33,0.55) 70%, transparent)',
                }} />

                <div className="grid grid-cols-3 gap-0 px-2 pt-2.5 pb-2.5">

                    {/* ── CALL ── */}
                    <a
                        href="tel:+918150099911"
                        aria-label="Call us"
                        className="group flex flex-col items-center justify-center gap-1.5 rounded-xl py-2.5 px-1 transition-all duration-200 active:scale-95"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <span className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden"
                            style={{
                                background: 'rgba(197,160,33,0.08)',
                                border: '1px solid rgba(197,160,33,0.18)',
                                boxShadow: '0 2px 12px rgba(197,160,33,0.10)',
                            }}>
                            <Phone
                                className="w-4 h-4 transition-colors duration-200 group-active:text-brand-gold"
                                style={{ color: 'rgba(197,160,33,0.85)' }}
                                strokeWidth={1.75}
                            />
                        </span>
                        <span
                            className="text-[9px] tracking-[0.14em] uppercase font-medium transition-colors duration-200 group-active:text-brand-gold"
                            style={{
                                color: 'rgba(255,255,255,0.42)',
                                fontFamily: "'Montserrat', sans-serif",
                                letterSpacing: '0.16em',
                            }}
                        >
                            Call
                        </span>
                    </a>

                    {/* ── WHATSAPP — Hero gold pill ── */}
                    <a
                        href="https://wa.me/919844594800?text=Hi,%20I'm%20interested%20in%20MakeMyStay"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp us"
                        className="group flex flex-col items-center justify-center gap-1.5 -translate-y-2.5 active:scale-95 transition-all duration-200"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <span
                            className="relative flex flex-col items-center justify-center gap-1 w-full rounded-2xl py-3 px-3 shadow-2xl"
                            style={{
                                background: 'linear-gradient(145deg, #D4A827 0%, #C5A021 45%, #A8861A 100%)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                boxShadow: '0 0 0 1px rgba(197,160,33,0.35), 0 6px 30px rgba(197,160,33,0.45), 0 2px 8px rgba(0,0,0,0.6)',
                            }}
                        >
                            <MessageCircle className="w-5 h-5 text-[#1A1400] drop-shadow-sm" strokeWidth={2} />
                            <span
                                className="text-[9px] font-bold uppercase tracking-widest text-[#1A1400]/80"
                                style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.12em' }}
                            >
                                WhatsApp
                            </span>

                            {/* Inner shine */}
                            <span
                                className="absolute top-0 left-0 right-0 rounded-t-2xl pointer-events-none"
                                style={{
                                    height: '40%',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)',
                                }}
                            />
                        </span>
                    </a>

                    {/* ── ENQUIRY ── */}
                    <a
                        href="/contact-us"
                        aria-label="Enquire now"
                        className="group flex flex-col items-center justify-center gap-1.5 rounded-xl py-2.5 px-1 transition-all duration-200 active:scale-95"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <span className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden"
                            style={{
                                background: 'rgba(197,160,33,0.08)',
                                border: '1px solid rgba(197,160,33,0.18)',
                                boxShadow: '0 2px 12px rgba(197,160,33,0.10)',
                            }}>
                            <Mail
                                className="w-4 h-4 transition-colors duration-200 group-active:text-brand-gold"
                                style={{ color: 'rgba(197,160,33,0.85)' }}
                                strokeWidth={1.75}
                            />
                        </span>
                        <span
                            className="text-[9px] tracking-[0.14em] uppercase font-medium transition-colors duration-200 group-active:text-brand-gold"
                            style={{
                                color: 'rgba(255,255,255,0.42)',
                                fontFamily: "'Montserrat', sans-serif",
                                letterSpacing: '0.16em',
                            }}
                        >
                            Enquire
                        </span>
                    </a>

                </div>
            </div>
        </div>
    );
}
