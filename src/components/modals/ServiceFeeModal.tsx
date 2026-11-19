import { useState, useEffect } from 'react';
import { X, Check, Lock, Users, Home, Building2, Star } from 'lucide-react';

export interface ServiceFeeOption {
    id: string;
    label: string;
    amount: number;
    description?: string;
    badge?: string;
    refundNote?: string;
    icon?: React.ReactNode;
    scarcity?: string;
}

interface ServiceFeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: (selectedOption: ServiceFeeOption) => void;
    propertyType: string;
}

export function ServiceFeeModal({ isOpen, onClose, propertyType }: ServiceFeeModalProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [options, setOptions] = useState<ServiceFeeOption[]>([]);

    useEffect(() => {
        const type = propertyType?.toUpperCase() || '';
        let fees: ServiceFeeOption[] = [];

        if (type === 'PG' || type === 'COLIVE PG' || type === 'HOSTEL') {
            fees = [
                {
                    id: 'sharing',
                    label: 'Sharing Room',
                    amount: 1500,
                    description: 'Standard booking for sharing occupancy.',
                    badge: '⭐ Most Popular',
                    refundNote: '100% adjustable against first month rent',
                    icon: <Users className="w-5 h-5" />,
                    scarcity: '3 sharing beds left',
                },
                {
                    id: 'private',
                    label: 'Private Room',
                    amount: 2500,
                    description: 'More privacy, comfort & personal space.',
                    refundNote: '100% adjustable against first month rent',
                    icon: <Home className="w-5 h-5" />,
                    scarcity: 'Only 2 private rooms left',
                },
            ];
        } else if (type === '1BHK') {
            fees = [
                {
                    id: 'fixed_1bhk',
                    label: 'Booking Token',
                    amount: 4000,
                    description: 'Secures your 1BHK from other bookings.',
                    refundNote: 'Fully adjustable against first month rent',
                    icon: <Building2 className="w-5 h-5" />,
                }
            ];
        } else if (type === '2BHK') {
            fees = [
                {
                    id: 'fixed_2bhk',
                    label: 'Booking Token',
                    amount: 6000,
                    description: 'Secures your 2BHK from other bookings.',
                    refundNote: 'Fully adjustable against first month rent',
                    icon: <Building2 className="w-5 h-5" />,
                }
            ];
        } else {
            fees = [
                {
                    id: 'standard',
                    label: 'Booking Token',
                    amount: 5000,
                    description: 'Secures your room from other bookings.',
                    refundNote: 'Fully adjustable against first month rent',
                    icon: <Home className="w-5 h-5" />,
                }
            ];
        }

        setOptions(fees);
        if (fees.length === 1) {
            setSelectedOptionId(fees[0].id);
        } else {
            setSelectedOptionId(null);
        }
    }, [propertyType, isOpen]);

    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">

                {/* Header */}
                <div className="relative p-6 border-b border-line bg-page">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-blush-100 text-slate hover:text-ink transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blush-100">
                            <Lock className="w-4 h-4 text-red" />
                        </div>
                        <h3 className="text-xl font-bold text-ink">Select Booking Token</h3>
                    </div>
                    <p className="text-sm text-slate leading-relaxed">
                        This token <span className="font-semibold text-ink">secures your room</span> and blocks it from other bookings instantly.
                    </p>
                </div>

                {/* Options */}
                <div className="p-5 space-y-3">
                    {options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        return (
                            <div
                                key={option.id}
                                onClick={() => setSelectedOptionId(option.id)}
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-colors ${isSelected
                                    ? 'border-red bg-blush-100/60 ring-1 ring-red/20'
                                    : 'border-line hover:border-ink/30 hover:bg-page'
                                    }`}
                            >
                                {/* Badge */}
                                {option.badge && (
                                    <div className="absolute -top-2.5 left-4">
                                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white bg-red">
                                            {option.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? 'bg-red text-white' : 'text-slate bg-page'
                                            }`}>
                                            {option.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-ink flex items-center gap-2 text-sm">
                                                {option.label}
                                                {isSelected && <Check size={14} className="text-red" strokeWidth={3} />}
                                            </div>
                                            <div className="text-xs text-slate mt-0.5">{option.description}</div>
                                            {option.refundNote && (
                                                <div className="flex items-center gap-1 mt-1.5">
                                                    <Star className="w-3 h-3 text-champagne fill-champagne" />
                                                    <span className="text-[11px] text-verified font-semibold">{option.refundNote}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <div className="text-lg font-extrabold text-ink tabular-nums">₹{option.amount.toLocaleString('en-IN')}</div>
                                        <div className="text-[10px] text-slate">one-time</div>
                                    </div>
                                </div>

                                {/* Scarcity */}
                                {option.scarcity && (
                                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                        <span className="text-[11px] font-semibold text-amber-600">{option.scarcity}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                    <button
                        disabled={true}
                        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-slate-100 text-slate-400 cursor-not-allowed"
                    >
                        <Lock className="w-4 h-4" />
                        Payments Temporarily Paused
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2.5">
                        🔒 Razorpay secured · No hidden charges · Instant room lock
                    </p>
                </div>
            </div>
        </div>
    );
}
