import { Link } from 'react-router-dom';
import {
    MapPin, Heart, Bed, Bath, Users, Utensils
} from 'lucide-react';
import { amenityIconMap } from '@/lib/amenityIcons';
import type { Property } from '@/types/api';
import { useWishlist } from '@/context/WishlistContext';

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(String(property.id));

    const handleHeartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleWishlist(property);
    };

    const images = property.images && property.images.length > 0 ? property.images : [property.image];

    const isServiceOriented = property.type === 'PG' || property.type === 'Hostel';

    // Build amenity pills
    const amenities: string[] = [];
    if (property.wifi) amenities.push('WiFi');
    if (property.power_backup) amenities.push('Backup');
    if (isServiceOriented) {
        if (property.housekeeping) amenities.push('Service');
        if (property.lounge) amenities.push('Lounge');
    } else {
        if (property.modern_kitchen) amenities.push('Kitchen');
        if (property.balcony) amenities.push('Balcony');
        if (property.attached_bathroom) amenities.push('Att. Bath');
    }
    if (property.gym) amenities.push('Gym');
    if (property.pool) amenities.push('Pool');
    if (property.lounge && !isServiceOriented) amenities.push('Lounge');
    if (property.cctv) amenities.push('Security');
    if (property.geyser) amenities.push('Geyser');


    return (
        <Link to={`/property/${property.id}`} className="block group">
            <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100">

                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                        src={images[0] ?? ''}
                        alt={property.title}
                        loading="lazy"
                        width="400"
                        height="300"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleHeartClick}
                        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 touch-manipulation"
                        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-brand-red text-brand-red' : 'text-slate-500'}`} />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${property.category === 'buy' ? 'bg-brand-red text-white' : 'bg-white/90 text-brand-charcoal backdrop-blur-sm'}`}>
                            {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                        </span>
                    </div>



                    {/* Price on image (bottom left) */}
                    <div className="absolute bottom-3 left-3 z-10">
                        <div className="flex items-baseline gap-1">
                            <span className="text-white text-lg md:text-xl font-bold drop-shadow-sm">{property.price}</span>
                            {property.category === 'rent' && <span className="text-white/90 text-[10px] md:text-xs font-medium">/mo</span>}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                    {/* Title + Location */}
                    <div className="mb-3">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug truncate">
                            {property.title}
                        </h3>
                        <div className="flex items-center text-slate-400 text-xs mt-1 gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{property.location}</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 text-slate-500 text-xs mb-3 pb-3 border-b border-slate-100">
                        {isServiceOriented ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-brand-red/60" />
                                    <span>{(property.sharing ?? []).filter(s => s === 'Single' || s === 'Double').join('/') || 'Shared'} Sharing</span>
                                </div>
                                <span className="text-slate-200">|</span>
                                <div className="flex items-center gap-1">
                                    <Utensils className="w-3.5 h-3.5 text-brand-red/60" />
                                    <span>{property.food ? 'Food Included' : 'No Food'}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1">
                                    <Bed className="w-3.5 h-3.5 text-brand-red/60" />
                                    <span>{property.beds} Beds</span>
                                </div>
                                <span className="text-slate-200">|</span>
                                <div className="flex items-center gap-1">
                                    <Bath className="w-3.5 h-3.5 text-brand-red/60" />
                                    <span>{property.baths} Bath</span>
                                </div>
                                {property.sqft && property.sqft !== 'On Request' && (
                                    <>
                                        <span className="text-slate-200">|</span>
                                        <span>{property.sqft} sqft</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Amenity Pills */}
                    {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {amenities.slice(0, 5).map((amenity) => {
                                const icon = amenityIconMap[amenity.toLowerCase()];
                                return (
                                    <span key={amenity} className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">
                                        {icon && <span className="[&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
                                        {amenity}
                                    </span>
                                );
                            })}
                            {amenities.length > 5 && (
                                <span className="inline-flex items-center text-[10px] font-medium text-brand-red bg-brand-red/5 border border-brand-red/10 rounded-full px-2.5 py-1">
                                    +{amenities.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
