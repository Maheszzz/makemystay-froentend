import {
    Wifi, Utensils, Sparkles, Zap, ShieldCheck, WashingMachine,
    Refrigerator, Droplets, Lock, ParkingSquare, Flame, Archive,
    Wind, Tv, Dumbbell, Trees, Cctv, Thermometer, Users, Bath,
    Coffee, Waves, Check, Bed
} from 'lucide-react';

/**
 * Maps a lower-cased amenity string → a React icon element (size w-4 h-4).
 * Falls back to a generic Check icon if the key is not found.
 */
export const amenityIconMap: Record<string, React.ReactNode> = {
    // WiFi
    'wifi': <Wifi className="w-4 h-4" />,
    'high-speed wifi': <Wifi className="w-4 h-4" />,
    // Food
    'food': <Utensils className="w-4 h-4" />,
    'nutritious food': <Utensils className="w-4 h-4" />,
    'food included': <Utensils className="w-4 h-4" />,
    // Housekeeping
    'housekeeping': <Sparkles className="w-4 h-4" />,
    'daily housekeeping': <Sparkles className="w-4 h-4" />,
    'service': <Sparkles className="w-4 h-4" />,
    // Power
    'power backup': <Zap className="w-4 h-4" />,
    'backup': <Zap className="w-4 h-4" />,
    // Security
    'security': <ShieldCheck className="w-4 h-4" />,
    '24/7 security': <ShieldCheck className="w-4 h-4" />,
    // CCTV
    'cctv': <Cctv className="w-4 h-4" />,
    'cctv security': <Cctv className="w-4 h-4" />,
    // Washing Machine
    'washing machine': <WashingMachine className="w-4 h-4" />,
    // Refrigerator
    'refrigerator': <Refrigerator className="w-4 h-4" />,
    'fridge': <Refrigerator className="w-4 h-4" />,
    // Water
    'ro water purifier': <Droplets className="w-4 h-4" />,
    'water purifier': <Droplets className="w-4 h-4" />,
    // Hot Water / Geyser
    'hot water': <Flame className="w-4 h-4" />,
    'geyser': <Thermometer className="w-4 h-4" />,
    'hot water geyser': <Thermometer className="w-4 h-4" />,
    // Parking
    'parking': <ParkingSquare className="w-4 h-4" />,
    // Cupboards / Storage
    'cupboards': <Archive className="w-4 h-4" />,
    'locker': <Lock className="w-4 h-4" />,
    // AC / Air Conditioning
    'ac': <Wind className="w-4 h-4" />,
    'air conditioning': <Wind className="w-4 h-4" />,
    'balcony': <Wind className="w-4 h-4" />,
    // TV
    'tv': <Tv className="w-4 h-4" />,
    'television': <Tv className="w-4 h-4" />,
    // Gym
    'gym': <Dumbbell className="w-4 h-4" />,
    // Pool
    'pool': <Waves className="w-4 h-4" />,
    'swimming pool': <Waves className="w-4 h-4" />,
    // Garden
    'garden': <Trees className="w-4 h-4" />,
    // Lounge
    'lounge': <Coffee className="w-4 h-4" />,
    'community lounge': <Users className="w-4 h-4" />,
    // Kitchen / Bath
    'kitchen': <Utensils className="w-4 h-4" />,
    'modern kitchen': <Utensils className="w-4 h-4" />,
    'att. bath': <Bath className="w-4 h-4" />,
    'attached bathroom': <Bath className="w-4 h-4" />,
    // Beds
    'beds': <Bed className="w-4 h-4" />,
};

/** Returns the icon for a given amenity label, or a default Check icon. */
export function getAmenityIcon(label: string, size: 'sm' | 'md' = 'md'): React.ReactNode {
    const cls = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const icon = amenityIconMap[label.toLowerCase()];
    if (!icon) return <Check className={cls} />;
    // Clone with correct size class
    return icon;
}
