import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Hash, ArrowRight, Heart } from 'lucide-react';
import type { Property } from '@/types/api';

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    // Format price if possible
    const formattedPrice = property.price;

    return (
        <Link to={`/property/${property.id}`} className="block group">
            <div className="relative bg-white transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] hover:border-brand-red/50 border border-slate-200 overflow-hidden h-full flex flex-col">

                {/* Image Section */}
                <div className="relative h-52 md:h-80 overflow-hidden bg-slate-100">
                    <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

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
                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-brand-red" />
                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                            {property.location.split(',')[0]}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-cormorant text-xl md:text-2xl font-semibold text-slate-900 mb-4 md:mb-5 leading-snug line-clamp-2 min-h-[3rem] md:min-h-[3.75rem] group-hover:text-brand-red transition-colors duration-300">
                        {property.title}
                    </h3>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 py-4 md:py-5 border-t border-b border-slate-100 mb-4 md:mb-5">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-md text-brand-charcoal group-hover:bg-brand-red/5 group-hover:text-brand-red transition-colors duration-300">
                                <Bed className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-slate-900">{property.beds}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide">Beds</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 px-2 border-l border-r border-slate-50">
                            <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-md text-brand-charcoal group-hover:bg-brand-red/5 group-hover:text-brand-red transition-colors duration-300">
                                <Bath className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-slate-900">{property.baths}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide">Baths</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-md text-brand-charcoal group-hover:bg-brand-red/5 group-hover:text-brand-red transition-colors duration-300">
                                <Hash className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <span className="text-xs font-bold text-slate-900 truncate w-full px-1">{property.sqft?.replace(' sqft', '') || 'On Request'}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide">sqft</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-medium">
                                Starts {property.category === 'rent' ? '' : 'From'}
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="font-cormorant text-2xl font-bold text-brand-red">
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

                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {property.type || 'PG'}
                    </div>
                </div>
            </div>
        </Link>
    );
}
