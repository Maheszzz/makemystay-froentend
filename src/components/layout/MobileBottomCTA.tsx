import { Mail, Phone } from 'lucide-react';

/** Official-style WhatsApp mark (matches WhatsAppWidget). */
function WhatsAppMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 32 32"
            className={className}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.46.65 4.87 1.88 6.99L2 30l7.19-1.87A13.93 13.93 0 0016.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.43c-2.3 0-4.56-.62-6.52-1.79l-.47-.28-4.27 1.11 1.13-4.15-.3-.48a11.43 11.43 0 01-1.73-6.1c0-6.3 5.13-11.43 11.43-11.43 6.3 0 11.43 5.13 11.43 11.43S22.3 27.43 16 27.43zm6.28-8.56c-.34-.17-2.03-1-2.34-1.12-.32-.11-.55-.17-.78.17-.23.34-.89 1.12-1.09 1.35-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.69-2.02-1.89-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.56.11-.23.06-.43-.03-.6-.09-.17-.78-1.87-1.07-2.57-.28-.67-.56-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.19 1.17-1.19 2.84 0 1.68 1.22 3.3 1.39 3.53.17.23 2.4 3.66 5.82 5.14.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.65-.1 2.03-.83 2.31-1.63.29-.8.29-1.48.2-1.63-.08-.15-.31-.23-.65-.4z" />
        </svg>
    );
}

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

                {/* WhatsApp — brand green (#25D366 / #128C7E) */}
                <a
                    href="https://wa.me/918150099911?text=Hi,%20I'm%20interested%20in%20MakeMyStay"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp us"
                    className="flex flex-col items-center justify-center gap-0.5 px-2 min-[400px]:px-4 sm:px-7 h-11 rounded-2xl active:scale-95 transition-all shrink-0"
                    style={{
                        background: 'linear-gradient(145deg, #25D366 0%, #128C7E 100%)',
                        boxShadow: '0 4px 18px rgba(37, 211, 102, 0.45)',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <WhatsAppMark className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-900" />
                        <span
                            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-900"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            Instant Assistance
                        </span>
                    </div>
                    <span className="text-[7.5px] sm:text-[8px] font-medium text-slate-900/90 tracking-wide leading-none">
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
