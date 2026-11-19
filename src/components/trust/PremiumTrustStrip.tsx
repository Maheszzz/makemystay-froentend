import { ShieldCheck, Zap, HeadphonesIcon, Lock } from 'lucide-react';

export function PremiumTrustStrip() {
    return (
        <div className="w-full bg-white border-y border-line mt-16 mb-8 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-line">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-blush-100 flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-verified" />
                        </div>
                        <h4 className="text-[14px] font-bold text-ink mb-1">100% Verified Properties</h4>
                        <p className="text-[12px] text-slate">Every listing is physically checked</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-blush-100 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-red" />
                        </div>
                        <h4 className="text-[14px] font-bold text-ink mb-1">Zero Brokerage</h4>
                        <p className="text-[12px] text-slate">Connect directly with owners</p>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-blush-100 flex items-center justify-center mb-4">
                            <HeadphonesIcon className="w-6 h-6 text-red" />
                        </div>
                        <h4 className="text-[14px] font-bold text-ink mb-1">24×7 Support</h4>
                        <p className="text-[12px] text-slate">Always here to help you</p>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-blush-100 flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-red" />
                        </div>
                        <h4 className="text-[14px] font-bold text-ink mb-1">Safe &amp; Secure Booking</h4>
                        <p className="text-[12px] text-slate">Your payments are protected</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
