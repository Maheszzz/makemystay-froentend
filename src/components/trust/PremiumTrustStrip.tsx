import { ShieldCheck, Zap, HeadphonesIcon, Lock } from 'lucide-react';

export function PremiumTrustStrip() {
    return (
        <div className="w-full bg-white border-y border-gray-200 mt-16 mb-8 py-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h4 className="text-[14px] font-bold text-[#111827] mb-1">100% Verified Properties</h4>
                        <p className="text-[12px] text-gray-500">Every listing is physically checked</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-[14px] font-bold text-[#111827] mb-1">Zero Brokerage</h4>
                        <p className="text-[12px] text-gray-500">Connect directly with owners</p>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                            <HeadphonesIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="text-[14px] font-bold text-[#111827] mb-1">24×7 Support</h4>
                        <p className="text-[12px] text-gray-500">Always here to help you</p>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#fff1f2] flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-[#E53935]" />
                        </div>
                        <h4 className="text-[14px] font-bold text-[#111827] mb-1">Safe & Secure Booking</h4>
                        <p className="text-[12px] text-gray-500">Your payments are protected</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
