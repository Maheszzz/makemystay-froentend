import { Mail, Phone } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { usePdpStickyActive } from '@/lib/pdpStickyState';

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
    const pdpStickyActive = usePdpStickyActive();
    const whatsappMessage = "Hi MakeMyStay! 👋 I visited the MakeMyStay website and am interested in finding a property. Can you help me with suitable listings?";
    const whatsappUrl = `https://wa.me/918150099911?text=${encodeURIComponent(whatsappMessage)}`;

    if (pdpStickyActive) {
        return null;
    }

    return (
        <>
            <div
                className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-3"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 10px)', paddingTop: '8px' }}
            >
                <div
                    className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-oxblood-900 border border-oxblood-700 rounded-[18px] p-1.5 min-h-[60px] shadow-md"
                >
                    {/* Call */}
                    <a
                        href="tel:+918150099911"
                        aria-label="Call us"
                        onClick={() => console.log('[TRACK] Mobile Bottom Call clicked')}
                        className="flex items-center justify-center gap-1.5 h-11 rounded-xl transition-all active:scale-95 bg-oxblood-700/70 border border-champagne/30 text-white"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <Phone className="w-3.5 h-3.5 shrink-0 text-champagne" strokeWidth={2.2} />
                        <span className="text-[11px] font-semibold tracking-wide truncate text-white">
                            Call
                        </span>
                    </a>

                    {/* WhatsApp — WhatsApp green with white ring + ink label (9.16:1 contrast) */}
                    <button
                        aria-label="WhatsApp us"
                        onClick={(e) => {
                            e.preventDefault();
                            console.log('[TRACK] Mobile Bottom WhatsApp clicked');
                            const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                                window.location.href = whatsappUrl;
                            }
                        }}
                        className="flex flex-col items-center justify-center gap-0.5 px-1.5 h-11 rounded-xl bg-whatsapp ring-1 ring-white text-ink active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <div className="flex items-center gap-1">
                            <WhatsAppMark className="w-3.5 h-3.5 shrink-0 text-ink" />
                            <span className="text-[11px] font-semibold tracking-wide text-ink truncate">
                                WhatsApp
                            </span>
                        </div>
                        <span className="text-[8px] font-medium text-ink/90 tracking-wide leading-none truncate max-w-full">
                            5 min response
                        </span>
                    </button>

                    {/* Enquire */}
                    <Link
                        to="/contact-us"
                        aria-label="Enquire now"
                        onClick={() => console.log('[TRACK] Mobile Bottom Enquire clicked')}
                        className="flex items-center justify-center gap-1.5 h-11 rounded-xl transition-all active:scale-95 bg-oxblood-700/70 border border-champagne/30 text-white"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <Mail className="w-3.5 h-3.5 shrink-0 text-champagne" strokeWidth={2.2} />
                        <span className="text-[11px] font-semibold tracking-wide truncate text-white">
                            Enquire
                        </span>
                    </Link>
                </div>
            </div>
        </>
    );
}
