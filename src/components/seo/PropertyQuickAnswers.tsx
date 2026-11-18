import type { Property } from '@/types/api';
import { propertyLikelyHasAc } from '@/lib/propertySeoUtils';
import {
    Clock,
    MapPin,
    Home,
    Wifi,
    Utensils,
    Wind,
    CheckCircle2,
    IndianRupee,
    Users,
} from 'lucide-react';

interface PropertyQuickAnswersProps {
    property: Property;
}

function formatVerifiedDate(raw?: string | null): string | null {
    if (!raw) return null;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function PropertyQuickAnswers({ property }: PropertyQuickAnswersProps) {
    const isMonthly =
        property.category === 'pg' ||
        property.category === 'rent' ||
        property.type === 'PG' ||
        property.type === 'Hostel';
    const hasPrice = Boolean(property.price && !/request|negotiable/i.test(property.price));
    const priceLabel = hasPrice
        ? `${property.price}${isMonthly ? '/mo' : ''}`
        : 'On request';

    const avail =
        property.is_available === false
            ? 'Fully Booked'
            : typeof property.units_remaining === 'number' && property.units_remaining > 0
              ? `${property.units_remaining} ${property.units_remaining === 1 ? 'Unit' : 'Units'} Left`
              : 'Available';

    const lastVerified = formatVerifiedDate(property.last_verified_at);

    const items: { label: string; value: string; icon: typeof IndianRupee; color: string }[] = [
        {
            label: isMonthly ? 'Rent per month' : 'Listed Price',
            value: priceLabel,
            icon: IndianRupee,
            color: 'text-emerald-500',
        },
        { label: 'Location', value: property.location, icon: MapPin, color: 'text-blue-500' },
        { label: 'Property Type', value: property.type, icon: Home, color: 'text-purple-500' },
        { label: 'Availability', value: avail, icon: CheckCircle2, color: 'text-rose-500' },
    ];

    if (property.gender) {
        items.push({ label: 'Suitable For', value: property.gender, icon: Users, color: 'text-amber-500' });
    }
    if (property.wifi) {
        items.push({ label: 'WiFi', value: 'Available', icon: Wifi, color: 'text-indigo-500' });
    }
    if (property.food) {
        items.push({ label: 'Food', value: 'Available', icon: Utensils, color: 'text-orange-500' });
    }
    if (propertyLikelyHasAc(property)) {
        items.push({ label: 'AC', value: 'Available', icon: Wind, color: 'text-cyan-500' });
    }
    if (lastVerified) {
        items.push({ label: 'Last Verified', value: lastVerified, icon: Clock, color: 'text-slate-500' });
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                    <div
                        className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.color}`}
                    >
                        <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                        {item.label}
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate" title={item.value}>
                        {item.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
