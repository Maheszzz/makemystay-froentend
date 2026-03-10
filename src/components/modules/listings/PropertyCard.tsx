import { Link } from 'react-router-dom';
import {
    MapPin, Heart, Bed, Bath, Users, Utensils, Star
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
    const isPlot = property.type === 'Plot' || property.type?.toLowerCase() === 'plot';

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
    if (isPlot && property.features) amenities.push(...property.features);

    const routeCategory = property.type === 'PG' ? 'pg' : property.category.toLowerCase();

    // Deterministic social proof & scarcity (vary by id)
    const idx = (Number(property.id) || 0) % 3;
    const scarcityLabels = ['Limited Availability', 'High Demand', 'Most Viewed'];
    const scarcityLabel = scarcityLabels[idx];
    const roomsLeft = [2, 3, 1];
    const rooms = roomsLeft[idx];

    const waLink = `https://wa.me/919844594800?text=${encodeURIComponent(`Hi! I'm interested in ${property.title} at ${property.location}. Please share more details.`)}`;

    return (
        <Link to={`/properties/${routeCategory}/${property.slug}`} className="block group">
            <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 border border-slate-100" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>

                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                        src={images[0] ?? ''}
                        alt={property.title}
                        loading="lazy"
                        width="400"
                        height="300"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleHeartClick}
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 touch-manipulation"
                        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-brand-red text-brand-red' : 'text-slate-500'}`} />
                    </button>

                    {/* Stacked Badges top-left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
                        {/* Category pill — soft grey */}
                        <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/95 text-slate-700 shadow-sm backdrop-blur-md">
                            {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                        </span>
                        {/* Scarcity pill — gold gradient */}
                        <span
                            className="text-[9px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full text-white shadow-sm"
                            style={{ background: 'linear-gradient(90deg,#C5A021,#A8761A)' }}
                        >
                            🔥 {scarcityLabel}
                        </span>
                    </div>


                </div>

                {/* Content Section */}
                <div className="p-4">
                    {/* Social proof row */}
                    <div className="flex items-center gap-1.5 mb-2">
                        {(property.rating ?? 0) > 0 ? (
                            <>
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-[11px] font-bold text-slate-700">{(property.rating ?? 0).toFixed(1)}</span>
                                <span className="text-[11px] text-slate-400">({property.reviews || 0} Reviews)</span>
                            </>
                        ) : (
                            <>
                                <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                                <span className="text-[11px] font-semibold text-slate-400">New Listing</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[#B11226] transition-colors leading-snug truncate mb-1">
                        {property.title}
                    </h3>

                    {/* Location — bold area name */}
                    <div className="flex items-center text-slate-500 text-xs gap-1 mb-3">
                        <MapPin className="w-3 h-3 shrink-0 text-[#B11226]/60" />
                        <span className="truncate">
                            <span className="font-semibold text-slate-700">{property.location?.split(',')[0]}</span>
                            {property.location?.includes(',') ? `, ${property.location.split(',').slice(1).join(',').trim()}` : ''}
                        </span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 text-slate-400 text-xs mb-3 pb-3 border-b border-slate-100">
                        {isPlot ? (
                            <>
                                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#B11226]/60" /><span>Plot Land</span></div>
                                {property.sqft && property.sqft !== 'On Request' && (<><span className="text-slate-200">|</span><span>{property.sqft} sqft</span></>)}
                            </>
                        ) : isServiceOriented ? (
                            <>
                                <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#B11226]/60" /><span>{(property.sharing ?? []).filter(s => s === 'Single' || s === 'Double').join('/') || 'Shared'} Sharing</span></div>
                                <span className="text-slate-200">|</span>
                                <div className="flex items-center gap-1"><Utensils className="w-3.5 h-3.5 text-[#B11226]/60" /><span>{property.food ? 'Food Included' : 'No Food'}</span></div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-[#B11226]/60" /><span>{property.beds} Beds</span></div>
                                <span className="text-slate-200">|</span>
                                <div className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-[#B11226]/60" /><span>{property.baths} Bath</span></div>
                                {property.sqft && property.sqft !== 'On Request' && (<><span className="text-slate-200">|</span><span>{property.sqft} sqft</span></>)}
                            </>
                        )}
                    </div>

                    {/* Price + scarcity row */}
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-[10px] text-slate-400 leading-none mb-0.5">Starting at</p>
                            <p className="text-lg font-bold leading-none" style={{ color: '#B11226' }}>{property.price}</p>
                            {property.category === 'rent' && <p className="text-[10px] text-slate-400 mt-0.5">per month</p>}
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Only {rooms} rooms left</p>
                    </div>

                    {/* Amenity Pills */}
                    {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {amenities.slice(0, 4).map((amenity) => {
                                const icon = amenityIconMap[amenity.toLowerCase()];
                                return (
                                    <span key={amenity} className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
                                        {icon && <span className="[&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
                                        {amenity}
                                    </span>
                                );
                            })}
                            {amenities.length > 4 && (
                                <span className="inline-flex items-center text-[10px] font-medium text-[#B11226] bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                                    +{amenities.length - 4} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* CTA row */}
                    <div className="flex items-center gap-2 pt-1">
                        <span
                            className="flex-1 text-center py-2.5 rounded-xl text-white text-xs font-bold tracking-wide transition-transform hover:scale-[1.02] active:scale-95"
                            style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)' }}
                        >
                            Book a Visit
                        </span>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 border"
                            style={{ color: '#B11226', borderColor: 'rgba(177,18,38,0.25)', background: 'rgba(177,18,38,0.04)' }}
                        >
                            💬 Chat
                        </a>
                    </div>
                </div>
            </div>
        </Link>
    );
}
