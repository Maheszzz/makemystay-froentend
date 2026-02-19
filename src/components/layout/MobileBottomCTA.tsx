import { Phone, MessageCircle, Mail } from 'lucide-react';

export function MobileBottomCTA() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
            {/* Glassmorphism background */}
            <div className="bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-3 divide-x divide-slate-100">
                    {/* Call Button */}
                    <a
                        href="tel:+918150099911"
                        className="flex flex-col items-center justify-center py-3 gap-1 text-slate-600 hover:text-brand-red active:bg-slate-50 transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        <span className="text-[10px] font-semibold tracking-wide uppercase">Call</span>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                        href="https://wa.me/919844594800?text=Hi,%20I'm%20interested%20in%20MakeMyStay"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center py-3 gap-1 text-green-600 hover:text-green-700 active:bg-green-50 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-[10px] font-semibold tracking-wide uppercase">WhatsApp</span>
                    </a>

                    {/* Enquiry Button */}
                    <a
                        href="/contact-us"
                        className="flex flex-col items-center justify-center py-3 gap-1 text-brand-red hover:text-red-700 active:bg-red-50 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        <span className="text-[10px] font-semibold tracking-wide uppercase">Enquiry</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
