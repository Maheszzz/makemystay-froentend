import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin, ArrowRight, Heart, Bed, Bath, Users, Utensils,
    ChevronLeft, ChevronRight, Wifi, Sparkles, Zap, Dumbbell,
    Coffee, ShieldCheck, Waves, Thermometer, Wind
} from 'lucide-react';
import type { Property } from '@/types/api';

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        if (!property.images) return;
        setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
    };

    const prevImage = () => {
        if (!property.images) return;
        setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
    };

    // Format price if possible
    const formattedPrice = property.price;

    // Helper to check if property is likely a PG/Hostel type (service-oriented)
    const isServiceOriented = property.type === 'PG' || property.type === 'Hostel';

    return (
        <Link to={`/property/${property.id}`} className="block group">
            <div className="relative bg-white transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] hover:border-brand-red/50 border border-slate-200 overflow-hidden h-full flex flex-col">

                {/* Image Section */}
                <div className="relative h-52 md:h-80 overflow-hidden bg-slate-100">
                    <img
                        src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Image Slider Controls (Only if more than one image) */}
                    {property.images && property.images.length > 1 && (
                        <div className="absolute inset-x-0 bottom-4 flex justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.preventDefault(); prevImage(); }}
                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 hover:bg-brand-red hover:text-white transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); nextImage(); }}
                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 hover:bg-brand-red hover:text-white transition-all shadow-sm"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                    {/* Status Badge (Top Left) */}
                    <div className="absolute top-5 left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-y border-brand-red/10 px-4 py-1.5 shadow-sm">
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-charcoal">
                            {property.is_available === false ? 'Sold' : 'Available'}
                        </span>
                    </div>

                    {/* Type Badge (Top Right) */}
                    <div className={`absolute top-5 right-5 z-10 px-4 py-1.5 shadow-sm ${property.category === 'buy' ? 'bg-brand-red' : 'bg-brand-charcoal'}`}>
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white">
                            {property.category === 'buy' ? 'Sale' : 'Rent'}
                        </span>
                    </div>

                    {/* Favorite Button (Top Right, slightly lower) */}
                    <button className="absolute top-16 right-5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-brand-red hover:bg-white transition-all opacity-100 md:opacity-0 group-hover:opacity-100 transform md:translate-y-2 group-hover:translate-y-0 duration-300">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-4 pt-4 md:p-7 md:pt-6 flex-1 flex flex-col">
                    {/* Main Info */}
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-tight">
                                    {property.title}
                                </h3>
                                <div className="flex items-center text-slate-500 text-xs mt-1">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    <span className="truncate max-w-[200px]">{property.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bed/Bath/Sqft Stats */}
                        {!isServiceOriented && (
                            <div className="flex items-center gap-4 mt-3 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Bed className="w-4 h-4 text-brand-red/70" />
                                    <span className="text-xs font-semibold">{property.beds} <span className="text-slate-400 font-normal">Beds</span></span>
                                </div>
                                <div className="w-px h-3 bg-slate-200" />
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Bath className="w-4 h-4 text-brand-red/70" />
                                    <span className="text-xs font-semibold">{property.baths} <span className="text-slate-400 font-normal">Bath</span></span>
                                </div>
                                {property.sqft && property.sqft !== 'On Request' && (
                                    <>
                                        <div className="w-px h-3 bg-slate-200" />
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <span className="text-xs font-semibold">{property.sqft} <span className="text-slate-400 font-normal">sqft</span></span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* For PG/Hostels, show occupancy type */}
                        {isServiceOriented && (
                            <div className="flex items-center gap-4 mt-3 pb-3 border-b border-slate-100">
                                {/* Sharing Info */}
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Users className="w-4 h-4 text-brand-red/70" />
                                    <span className="text-xs font-semibold">
                                        {property.sharing && property.sharing.length > 0
                                            ? `${property.sharing[0]} Sharing`
                                            : 'Shared Occupancy'}
                                    </span>
                                </div>

                                <div className="w-px h-3 bg-slate-200" />

                                {/* Food Info */}
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Utensils className="w-4 h-4 text-brand-red/70" />
                                    <span className="text-xs font-semibold">
                                        {property.food ? 'Food Included' : 'No Food'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Luxury Amenities Grid */}
                    <div className="mb-6">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-3">Premium Amenities</h4>
                        <div className="grid grid-cols-4 gap-3">
                            {/* Residential Amenities (1BHK, Villas, etc.) */}
                            {!isServiceOriented && (
                                <>
                                    {property.modern_kitchen && (
                                        <div className="flex flex-col items-center gap-1 group/item" title="Modern Kitchen">
                                            <Utensils className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                            <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Kitchen</span>
                                        </div>
                                    )}
                                    {property.balcony && (
                                        <div className="flex flex-col items-center gap-1 group/item" title="Private Balcony">
                                            <Wind className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                            <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Balcony</span>
                                        </div>
                                    )}
                                    {property.attached_bathroom && (
                                        <div className="flex flex-col items-center gap-1 group/item" title="Attached Bathroom">
                                            <Bath className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                            <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Att. Bath</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Common / Service Amenities */}
                            {property.wifi && (
                                <div className="flex flex-col items-center gap-1 group/item" title="High-Speed WiFi">
                                    <Wifi className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">WiFi</span>
                                </div>
                            )}
                            {property.power_backup && (
                                <div className="flex flex-col items-center gap-1 group/item" title="Power Backup">
                                    <Zap className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Backup</span>
                                </div>
                            )}

                            {/* Service Specific (Housekeeping, Food) - Priority for PGs */}
                            {isServiceOriented && property.housekeeping && (
                                <div className="flex flex-col items-center gap-1 group/item" title="Daily Housekeeping">
                                    <Sparkles className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Service</span>
                                </div>
                            )}

                            {/* Additional Luxury Amenities */}
                            {property.gym && (
                                <div className="flex flex-col items-center gap-1 group/item" title="Gym">
                                    <Dumbbell className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Gym</span>
                                </div>
                            )}
                            {property.pool && (
                                <div className="flex flex-col items-center gap-1 group/item" title="Swimming Pool">
                                    <Waves className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Pool</span>
                                </div>
                            )}
                            {property.lounge && (
                                <div className="flex flex-col items-center gap-1 group/item" title="Community Lounge">
                                    <Coffee className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Lounge</span>
                                </div>
                            )}
                            {property.cctv && (
                                <div className="flex flex-col items-center gap-1 group/item" title="CCTV Security">
                                    <ShieldCheck className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Security</span>
                                </div>
                            )}

                            {property.geyser && (
                                <div className="flex flex-col items-center gap-1 group/item" title="Geyser">
                                    <Thermometer className="w-4 h-4 text-slate-400 group-hover/item:text-brand-red transition-colors" />
                                    <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">Geyser</span>
                                </div>
                            )}
                        </div>
                    </div>




                    {/* Price Section */}
                    <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-medium">
                                Starts {property.category === 'rent' ? '' : 'From'}
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-brand-red">
                                    {formattedPrice}
                                </span>
                                {property.category === 'rent' && (
                                    <span className="text-sm text-slate-400 font-medium">/mo</span>
                                )}
                            </div>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-brand-charcoal group-hover:border-brand-charcoal group-hover:text-white transition-all duration-300 shadow-sm">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>



                </div>
            </div>
        </Link>
    );
}
