import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ServiceFeeOption {
    id: string;
    label: string;
    amount: number;
    description?: string;
}

interface ServiceFeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: (selectedOption: ServiceFeeOption) => void;
    propertyType: string;
}

export function ServiceFeeModal({ isOpen, onClose, onProceed, propertyType }: ServiceFeeModalProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [options, setOptions] = useState<ServiceFeeOption[]>([]);

    useEffect(() => {
        // Determine options based on property type
        const type = propertyType?.toUpperCase() || '';
        let fees: ServiceFeeOption[] = [];

        if (type === 'PG' || type === 'COLIVE PG') {
            fees = [
                { id: 'sharing', label: 'Sharing', amount: 1500, description: 'Standard service fee for sharing occupancy.' },
                { id: 'private', label: 'Private', amount: 2500, description: 'Premium service fee for private occupancy.' }
            ];
        } else if (type === '1BHK') {
            fees = [
                { id: 'fixed_1bhk', label: 'Service Fee', amount: 4000, description: 'Standard service fee for 1BHK.' }
            ];
        } else if (type === '2BHK') {
            fees = [
                { id: 'fixed_2bhk', label: 'Service Fee', amount: 6000, description: 'Standard service fee for 2BHK.' }
            ];
        } else {
            // Default fallback or for other types like 3BHK if needed
            fees = [
                { id: 'standard', label: 'Service Fee', amount: 5000, description: 'Standard booking service fee.' }
            ];
        }

        setOptions(fees);
        // Auto-select if only one option
        if (fees.length === 1) {
            setSelectedOptionId(fees[0].id);
        } else {
            setSelectedOptionId(null); // Reset selection when opening for PG
        }
    }, [propertyType, isOpen]);

    if (!isOpen) return null;

    const handleProceed = () => {
        if (!selectedOptionId) return;
        const option = options.find(o => o.id === selectedOptionId);
        if (option) {
            onProceed(option);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-up">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Service Fees</h3>
                        <p className="text-sm text-slate-500 mt-1">Please select an option to continue</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => setSelectedOptionId(option.id)}
                            className={`
                                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
                                ${selectedOptionId === option.id
                                    ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                                    : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        {option.label}
                                        {selectedOptionId === option.id && (
                                            <Check size={16} className="text-emerald-500" strokeWidth={3} />
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1">{option.description}</div>
                                </div>
                                <div className="text-lg font-bold text-emerald-600">
                                    ₹{option.amount.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <Button
                        onClick={handleProceed}
                        disabled={!selectedOptionId}
                        className="w-full sm:w-auto"
                    >
                        Proceed to Pay
                    </Button>
                </div>
            </div>
        </div>
    );
}
