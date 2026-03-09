import { CheckCircle2, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentId: string;
    amount: number;
    receiptUrl: string;
}

export function PaymentSuccessModal({ isOpen, onClose, paymentId, amount, receiptUrl }: PaymentSuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all animate-in zoom-in-95 duration-300">
                {/* Header Pattern */}
                <div className="h-32 bg-gradient-to-br from-emerald-500 to-emerald-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center p-1.5 shadow-xl">
                        <div className="w-full h-full bg-emerald-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pt-14 pb-8 text-center space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Payment Successful!</h2>
                        <p className="text-sm text-slate-500">Your transaction has been processed securely.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex justify-between items-center text-left">
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Amount Paid</p>
                            <p className="text-2xl font-bold text-slate-900">₹{amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                            <p className="text-xs font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">{paymentId}</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Button
                            onClick={() => window.open(receiptUrl, '_blank')}
                            variant="gold"
                            className="w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-brand-gold/20"
                        >
                            <Download className="w-4 h-4" />
                            Download Receipt
                        </Button>

                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
