import React, { useState, useEffect } from 'react';
import { X, Send, Phone, Calendar, ClipboardCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { contactApi } from '@/lib/api/contacts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    source: string;
    actionLabel?: string;
    propertyTitle?: string;
    propertyLocation?: string;
    whatsappUrl?: string;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    source,
    actionLabel = "Submit Request",
    propertyTitle,
    propertyLocation,
    whatsappUrl
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset status when opening
            setStatus('idle');
            setErrorMsg('');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.phone.length < 10) {
            setErrorMsg('Please enter a valid 10-digit phone number');
            setStatus('error');
            return;
        }

        setStatus('loading');
        try {
            const contextMsg = propertyTitle 
                ? `Inquiry for ${propertyTitle} in ${propertyLocation || 'N/A'}. ${formData.message}`
                : formData.message;

            await contactApi.submitContactForm({
                name: formData.name,
                phone: formData.phone,
                email: formData.email || 'web@makemystay.ai',
                message: contextMsg || `Automated request from ${source}`,
                source: source,
                location: propertyLocation,
                property_type: 'Inquiry'
            });

            setStatus('success');
            
            if (whatsappUrl) {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }

            setTimeout(() => {
                onClose();
                // Reset form after closing
                setFormData({ name: '', phone: '', email: '', message: '' });
            }, 3000);
        } catch (err: any) {
            console.error('Lead submission failed:', err);
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-500 scale-100 opacity-100">
                {/* Top Design Element */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-red via-red-500 to-orange-500" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 sm:p-10">
                    {status === 'success' ? (
                        <div className="py-10 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                                <ClipboardCheck className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                            <p className="text-slate-500">Our team will contact you within 4 business hours to finalize the details.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/5 text-brand-red text-xs font-bold uppercase tracking-wider mb-4 border border-brand-red/10">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Instant Confirmation</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                                    {title}
                                </h2>
                                <p className="text-slate-500 text-sm sm:text-base">
                                    {subtitle}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="modal-name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        id="modal-name" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="modal-phone" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-200 pr-3 mr-3">
                                            +91
                                        </div>
                                        <input 
                                            type="tel" 
                                            id="modal-phone" 
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                                            className="w-full pl-16 pr-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none text-slate-900 font-medium tracking-wider"
                                            placeholder="Enter Your Mobile Number "
                                        />
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">{errorMsg}</p>
                                )}

                                <div className="pt-4">
                                    <Button 
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className={`w-full py-4 text-base font-extrabold rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] border-0 text-white flex items-center justify-center gap-2 ${
                                            whatsappUrl 
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-500 shadow-xl shadow-green-500/20 hover:shadow-green-500/30' 
                                                : 'bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-brand-red shadow-xl shadow-brand-red/20 hover:shadow-brand-red/30'
                                        }`}
                                    >
                                        {status === 'loading' ? (
                                            <LoadingSpinner size={20} className="text-white" />
                                        ) : (
                                            <>
                                                <span>{whatsappUrl ? (actionLabel || "Chat on WhatsApp") : actionLabel}</span>
                                                {whatsappUrl ? (
                                                    <svg viewBox="0 0 32 32" width="18" height="18" fill="white" xmlns="http://www.w3.org/2000/svg" className="ml-1 shrink-0">
                                                        <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.46.65 4.87 1.88 6.99L2 30l7.19-1.87A13.93 13.93 0 0016.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.43c-2.3 0-4.56-.62-6.52-1.79l-.47-.28-4.27 1.11 1.13-4.15-.3-.48a11.43 11.43 0 01-1.73-6.1c0-6.3 5.13-11.43 11.43-11.43 6.3 0 11.43 5.13 11.43 11.43S22.3 27.43 16 27.43zm6.28-8.56c-.34-.17-2.03-1-2.34-1.12-.32-.11-.55-.17-.78.17-.23.34-.89 1.12-1.09 1.35-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.69-2.02-1.89-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.56.11-.23.06-.43-.03-.6-.09-.17-.78-1.87-1.07-2.57-.28-.67-.56-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.19 1.17-1.19 2.84 0 1.68 1.22 3.3 1.39 3.53.17.23 2.4 3.66 5.82 5.14.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.65-.1 2.03-.83 2.31-1.63.29-.8.29-1.48.2-1.63-.08-.15-.31-.23-.65-.4z" />
                                                    </svg>
                                                ) : (
                                                    <Send className="w-4 h-4 ml-1" />
                                                )}
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
                                        🔒 Your data is secure · No spam ever
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Bottom Trust Row */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-around">
                    <div className="flex flex-col items-center gap-1">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Fast Call</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex flex-col items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Daily Slots</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex flex-col items-center gap-1">
                        <ClipboardCheck className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
