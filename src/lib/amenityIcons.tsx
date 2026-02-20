import {
    Wifi, Utensils, Sparkles, Zap, ShieldCheck, WashingMachine,
    Refrigerator, Droplets, Lock, ParkingSquare, Flame, Archive,
    Wind, Tv, Dumbbell, Trees, Cctv, Thermometer, Users, Bath,
    Coffee, Waves, Check, Bed, ArrowUpDown, Armchair, Fingerprint,
    Bike, Shirt, Building2, Star, BedDouble, AirVent,
    Maximize2, Droplet, MapPin, VolumeX, Layers, Home, ChefHat, Mountain,
    BookOpen, Globe, ShowerHead, BrickWall
} from 'lucide-react';

/**
 * Maps a lower-cased amenity string → a React icon element (size w-4 h-4).
 * Falls back to a generic Check icon if the key is not found.
 * Add new entries here — they will automatically appear on ALL cards & detail pages.
 */
export const amenityIconMap: Record<string, React.ReactNode> = {
    // ── WiFi ─────────────────────────────────────────────
    'wifi': <Wifi className="w-4 h-4" />,
    'high-speed wifi': <Wifi className="w-4 h-4" />,
    'wi-fi': <Wifi className="w-4 h-4" />,

    // ── Food ─────────────────────────────────────────────
    'food': <Utensils className="w-4 h-4" />,
    'nutritious food': <Utensils className="w-4 h-4" />,
    'food included': <Utensils className="w-4 h-4" />,
    'meals included': <Utensils className="w-4 h-4" />,

    // ── Housekeeping ──────────────────────────────────────
    'housekeeping': <Sparkles className="w-4 h-4" />,
    'daily housekeeping': <Sparkles className="w-4 h-4" />,
    'service': <Sparkles className="w-4 h-4" />,
    'laundry service': <Shirt className="w-4 h-4" />,
    'laundry': <Shirt className="w-4 h-4" />,

    // ── Power ─────────────────────────────────────────────
    'power backup': <Zap className="w-4 h-4" />,
    'backup': <Zap className="w-4 h-4" />,

    // ── Security ──────────────────────────────────────────
    'security': <ShieldCheck className="w-4 h-4" />,
    '24/7 security': <ShieldCheck className="w-4 h-4" />,
    'fingerprint access': <Fingerprint className="w-4 h-4" />,
    'fingerprint': <Fingerprint className="w-4 h-4" />,
    'biometric access': <Fingerprint className="w-4 h-4" />,

    // ── CCTV ──────────────────────────────────────────────
    'cctv': <Cctv className="w-4 h-4" />,
    'cctv security': <Cctv className="w-4 h-4" />,

    // ── Washing / Laundry ─────────────────────────────────
    'washing machine': <WashingMachine className="w-4 h-4" />,

    // ── Refrigerator ──────────────────────────────────────
    'refrigerator': <Refrigerator className="w-4 h-4" />,
    'fridge': <Refrigerator className="w-4 h-4" />,

    // ── Water (RO / Purifier) — deduplicated ──────────────
    'ro water purifier': <Droplets className="w-4 h-4" />,
    'ro water': <Droplets className="w-4 h-4" />,
    'water purifier': <Droplets className="w-4 h-4" />,

    // ── Hot Water / Geyser ────────────────────────────────
    'hot water': <Flame className="w-4 h-4" />,
    'geyser': <Thermometer className="w-4 h-4" />,
    'hot water geyser': <Thermometer className="w-4 h-4" />,

    // ── Parking ───────────────────────────────────────────
    'parking': <ParkingSquare className="w-4 h-4" />,
    'bike parking': <Bike className="w-4 h-4" />,
    'car parking': <ParkingSquare className="w-4 h-4" />,

    // ── Cupboards / Storage ───────────────────────────────
    'cupboards': <Archive className="w-4 h-4" />,
    'locker': <Lock className="w-4 h-4" />,

    // ── AC / Air Conditioning ─────────────────────────────
    'ac': <AirVent className="w-4 h-4" />,
    'air conditioning': <AirVent className="w-4 h-4" />,
    'air conditioner': <AirVent className="w-4 h-4" />,
    'balcony': <Wind className="w-4 h-4" />,

    // ── TV ────────────────────────────────────────────────
    'tv': <Tv className="w-4 h-4" />,
    'smart tv': <Tv className="w-4 h-4" />,
    'television': <Tv className="w-4 h-4" />,

    // ── Gym ───────────────────────────────────────────────
    'gym': <Dumbbell className="w-4 h-4" />,

    // ── Pool ──────────────────────────────────────────────
    'pool': <Waves className="w-4 h-4" />,
    'swimming pool': <Waves className="w-4 h-4" />,

    // ── Garden / Green Space ──────────────────────────────
    'garden': <Trees className="w-4 h-4" />,

    // ── Lounge / Common Area ──────────────────────────────
    'lounge': <Coffee className="w-4 h-4" />,
    'community lounge': <Users className="w-4 h-4" />,

    // ── Kitchen / Bath ────────────────────────────────────
    'kitchen': <Utensils className="w-4 h-4" />,
    'modern kitchen': <Utensils className="w-4 h-4" />,
    'att. bath': <Bath className="w-4 h-4" />,
    'attached bathroom': <Bath className="w-4 h-4" />,

    // ── Beds / Rooms ──────────────────────────────────────
    'beds': <Bed className="w-4 h-4" />,
    'double bed': <BedDouble className="w-4 h-4" />,

    // ── Lift / Elevator ───────────────────────────────────
    'lift': <ArrowUpDown className="w-4 h-4" />,
    'elevator': <ArrowUpDown className="w-4 h-4" />,

    // ── Furniture ─────────────────────────────────────────
    'furniture': <Armchair className="w-4 h-4" />,
    'premium furniture': <Armchair className="w-4 h-4" />,
    'furnished': <Armchair className="w-4 h-4" />,
    'fully furnished': <Armchair className="w-4 h-4" />,

    // ── Building ──────────────────────────────────────────
    'society': <Building2 className="w-4 h-4" />,
    'gated society': <Building2 className="w-4 h-4" />,

    // ── Premium / Rating ──────────────────────────────────
    'premium': <Star className="w-4 h-4" />,

    // ── Spacious / Rooms ──────────────────────────────────
    'spacious rooms': <Maximize2 className="w-4 h-4" />,
    'spacious room': <Maximize2 className="w-4 h-4" />,
    'rooms': <Home className="w-4 h-4" />,

    // ── Water Supply ──────────────────────────────────────
    '24/7 water supply': <Droplet className="w-4 h-4" />,
    'water supply': <Droplet className="w-4 h-4" />,
    '24x7 water supply': <Droplet className="w-4 h-4" />,

    // ── Location / Neighbourhood ──────────────────────────
    'near parks': <Trees className="w-4 h-4" />,
    'near metro': <MapPin className="w-4 h-4" />,
    'near market': <MapPin className="w-4 h-4" />,
    'near school': <MapPin className="w-4 h-4" />,
    'quiet neighborhood': <VolumeX className="w-4 h-4" />,
    'quiet neighbourhood': <VolumeX className="w-4 h-4" />,
    'peaceful environment': <VolumeX className="w-4 h-4" />,

    // ── Common Spaces ─────────────────────────────────────
    'common kitchen': <ChefHat className="w-4 h-4" />,
    'shared kitchen': <ChefHat className="w-4 h-4" />,
    'terrace': <Mountain className="w-4 h-4" />,
    'terrace access': <Mountain className="w-4 h-4" />,
    'rooftop': <Layers className="w-4 h-4" />,

    // ── Furniture variants ────────────────────────────────
    'ergonomic furniture': <Armchair className="w-4 h-4" />,
    'semi furnished': <Armchair className="w-4 h-4" />,
    'unfurnished': <Home className="w-4 h-4" />,

    // ── Professional Housekeeping ─────────────────────────
    'professional housekeeping': <Sparkles className="w-4 h-4" />,

    // ── Washroom / Bathroom ───────────────────────────────
    'attached washroom': <ShowerHead className="w-4 h-4" />,
    'washroom': <ShowerHead className="w-4 h-4" />,

    // ── Study / Work ──────────────────────────────────────
    'study table': <BookOpen className="w-4 h-4" />,
    'study room': <BookOpen className="w-4 h-4" />,
    'study area': <BookOpen className="w-4 h-4" />,
    'work desk': <BookOpen className="w-4 h-4" />,

    // ── Internet ──────────────────────────────────────────
    'high-speed internet': <Wifi className="w-4 h-4" />,
    'internet': <Wifi className="w-4 h-4" />,
    'broadband': <Wifi className="w-4 h-4" />,

    // ── Kitchen (fully equipped) ──────────────────────────
    'fully equipped kitchen': <ChefHat className="w-4 h-4" />,
    'equipped kitchen': <ChefHat className="w-4 h-4" />,

    // ── Walls / Structure ─────────────────────────────────
    'boundary wall': <BrickWall className="w-4 h-4" />,
    'compound wall': <BrickWall className="w-4 h-4" />,

    // ── Global / Misc ─────────────────────────────────────
    'online support': <Globe className="w-4 h-4" />,
    '24/7 support': <Globe className="w-4 h-4" />,
};

/** Returns the icon for a given amenity label, or a default Check icon. */
export function getAmenityIcon(label: string): React.ReactNode {
    const icon = amenityIconMap[label.toLowerCase()];
    return icon ?? <Check className="w-4 h-4" />;
}
