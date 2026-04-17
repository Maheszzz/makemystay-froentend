import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { paymentApi } from '@/lib/api';
import { Shield, Lock, CheckCircle2, CreditCard, Smartphone } from 'lucide-react';
import { PaymentSuccessModal } from '@/components/modals/PaymentSuccessModal';
import logoImage from '@/assets/MakeMysStaylogo.svg';
import { SafetyPopup } from '@/components/modals/SafetyPopup';
export default function QuickPay() {
    const [amount, setAmount] = useState<string>('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [successData, setSuccessData] = useState<{
        isOpen: boolean; paymentId: string; amount: number; receiptUrl: string;
    }>({
        isOpen: false, paymentId: '', amount: 0, receiptUrl: ''
    });
    const [isSafetyPopupOpen, setIsSafetyPopupOpen] = useState(false);

    useEffect(() => {
        // Show safety popup on quick pay load if not shown in this session
        const hasShownQuickPaySafety = sessionStorage.getItem('hasShownQuickPaySafety');
        if (!hasShownQuickPaySafety) {
            setIsSafetyPopupOpen(true);
            sessionStorage.setItem('hasShownQuickPaySafety', 'true');
        }
    }, []);

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (!name || !phone) {
            alert("Please enter both name and phone number.");
            return;
        }

        try {
            setIsProcessing(true);

            // Check env
            const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!key) {
                alert("Error: VITE_RAZORPAY_KEY_ID is missing. Please restart the server.");
                setIsProcessing(false);
                return;
            }

            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                setIsProcessing(false);
                return;
            }

            // 2. Create Order
            const order = await paymentApi.createOrder({
                amount: amountNum * 100, // Convert to paise
                currency: "INR",
                payment_type: "manual",
                payer_name: name,
                payer_email: "quickpay@makemystay.ai",
                payer_phone: phone
            });

            // 3. Open Razorpay Checkout
            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "MakeMyStay",
                description: description || `Quick Pay - ${name}`,
                image: logoImage,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        const verification = await paymentApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Success!
                        const pId = verification.payment_id || response.razorpay_payment_id;
                        setSuccessData({
                            isOpen: true,
                            paymentId: pId,
                            amount: amountNum,
                            receiptUrl: paymentApi.getReceiptUrl(pId)
                        });

                        // Reset form
                        setAmount('');
                        setName('');
                        setPhone('');
                        setDescription('');
                    } catch (error: any) {
                        console.error("Payment Verification Failed", error);
                        const msg = error?.message || "Verification failed";
                        alert(`Payment verification failed: ${msg}`);
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: name,
                    contact: phone
                },
                theme: {
                    color: "#C5A021"
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(`Payment Failed: ${response.error.description}`);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error("Payment Error:", error);
            const msg = error?.message || "Unknown error";
            alert(`Payment Initialization Failed: ${msg}`);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4 md:p-8 pt-20 md:pt-28">
                <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-5">

                    {/* Left Panel - Visual Side */}
                    <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-brand-charcoal via-slate-900 to-black relative p-8 md:p-12 flex-col justify-between overflow-hidden">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                <span className="text-white">MakeMyStay</span>
                                <span className="text-brand-gold">.ai</span>
                            </h2>
                            <p className="text-white/60 text-sm mb-1">Premium Property Payments</p>
                            <p className="text-white/40 text-xs">Fast, secure payments for bookings, deposits &amp; services.</p>
                        </div>

                        {/* 3D Layered Cards Visual */}
                        <div className="relative z-10 my-12 transform md:scale-100 scale-90 origin-center">
                            {/* Card 3 - Background */}
                            <div className="absolute top-0 left-4 right-4 h-44 bg-gradient-to-br from-brand-charcoal/40 to-slate-800/40 backdrop-blur-md rounded-2xl border border-white/10 transform -rotate-6 translate-y-6 shadow-2xl"></div>

                            {/* Card 2 - Middle */}
                            <div className="absolute top-0 left-2 right-2 h-44 bg-gradient-to-br from-brand-gold/20 to-amber-700/20 backdrop-blur-md rounded-2xl border border-brand-gold/20 transform -rotate-3 translate-y-3 shadow-2xl"></div>

                            {/* Main Card */}
                            <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-white/60" />
                                    </div>
                                    <Shield className="w-6 h-6 text-brand-gold" />
                                </div>
                                <div className="space-y-3 mb-8">
                                    <div className="h-2 w-3/4 bg-white/30 rounded-full"></div>
                                    <div className="h-2 w-1/2 bg-white/30 rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm font-mono tracking-widest text-white/80">•••• •••• •••• 4242</div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-amber-600"></div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-3 text-xs text-white/60">
                                <div className="p-1.5 rounded-full bg-brand-gold/10">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                                </div>
                                <span>SSL Encrypted Transaction</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                                <div className="p-1.5 rounded-full bg-brand-gold/10">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                                </div>
                                <span>Instant Payment Confirmation</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                                <div className="p-1.5 rounded-full bg-brand-gold/10">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                                </div>
                                <span>256-bit Encryption · Razorpay Secured</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                                <div className="p-1.5 rounded-full bg-brand-gold/10">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                                </div>
                                <span>&#9889; Instant receipt via SMS</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="md:col-span-3 p-6 md:p-12 bg-white flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    Payment Details
                                </h1>
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
                                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-xs text-emerald-700 font-medium">SSL Secured</span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm">Complete your secure transaction</p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-5">

                            {/* 1. Payment Amount */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Payment Amount
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl group-focus-within:text-brand-gold transition-colors">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all text-2xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal"
                                        placeholder="Enter amount"
                                        required
                                        min="1"
                                        step="1"
                                        inputMode="numeric"
                                    />
                                </div>
                                <p className="text-xs text-slate-400">Booking fee, deposit or rent — enter the exact amount</p>
                            </div>

                            {/* 2. Purpose / Reference */}
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-slate-600">
                                    Purpose / Reference <span className="text-slate-400">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="e.g., Booking Fee for Villa 402"
                                />
                            </div>

                            {/* 3. Name and Phone - Side by Side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-medium text-slate-600">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 md:px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm md:text-base"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-medium text-slate-600">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-3 md:px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm md:text-base"
                                        placeholder="10-digit mobile number"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <p className="text-center text-xs text-slate-400 mb-3">
                                    🔒 You'll receive instant confirmation after payment.
                                </p>
                                <Button
                                    type="submit"
                                    variant="gold"
                                    className="w-full py-4 text-base font-bold shadow-lg shadow-brand-gold/20 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <LoadingSpinner size={18} className="text-white" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            {amount && parseFloat(amount) > 0
                                                ? `Pay ₹${Number(amount).toLocaleString('en-IN')} Securely`
                                                : 'Pay Securely'}
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Secure Payment</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>UPI Supported</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>All Cards</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Payment Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md text-white animate-in fade-in duration-300">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full animate-pulse"></div>
                        <LoadingSpinner size={64} className="text-white relative z-10 mb-6" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Processing Payment
                    </h3>
                    <p className="text-white/70 text-sm md:text-base">Please complete the transaction on your device</p>
                    <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                        <Lock className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs text-white/90">Secure SSL Connection</span>
                    </div>
                </div>
            )}

            <PaymentSuccessModal
                isOpen={successData.isOpen}
                onClose={() => setSuccessData(prev => ({ ...prev, isOpen: false }))}
                paymentId={successData.paymentId}
                amount={successData.amount}
                receiptUrl={successData.receiptUrl}
            />

            <SafetyPopup 
                isOpen={isSafetyPopupOpen} 
                onClose={() => setIsSafetyPopupOpen(false)} 
            />
        </div>
    );
}
