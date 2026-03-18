import { Link, useLocation } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import type { Property } from '@/types/api';

interface MobilePropertyCarouselProps {
    properties: Property[];
}

export function MobilePropertyCarousel({ properties }: MobilePropertyCarouselProps) {
    if (properties.length === 0) return null;
    const location = useLocation();
    const from = `${location.pathname}${location.search}${location.hash}`;

    return (
        <div className="md:hidden px-4 flex flex-col gap-4">
            {properties.map((property) => {
                const images = property.images && property.images.length > 0 ? property.images : [property.image];
                const routeCategory = property.type === 'PG' ? 'pg' : property.category.toLowerCase();
                const contactNumber = '919844594800';

                // Deterministic social proof & scarcity
                const idx = (Number(property.id) || 0) % 3;
                const scarcityLabels = ['Limited Availability', 'High Demand', 'Most Viewed'];
                const scarcityLabel = scarcityLabels[idx];
                const ratings = ['4.7', '4.8', '4.9'];
                const reviewCounts = [98, 124, 156];
                const roomsLeft = [2, 3, 1];
                const rating = ratings[idx];
                const reviews = reviewCounts[idx];
                const rooms = roomsLeft[idx];

                const waLink = `https://wa.me/${contactNumber}?text=${encodeURIComponent(`Hi! I'm interested in ${property.title} at ${property.location}. Please share more details.`)}`;

                return (
                    <div key={property.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        {/* Property Image */}
                        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                            <img
                                src={images[0] ?? ''}
                                alt={property.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                            {/* Stacked badges */}
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                                <span className="text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/85 text-slate-600 backdrop-blur-sm">
                                    {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                                </span>
                                <span
                                    className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-white"
                                    style={{ background: 'linear-gradient(90deg,#C5A021,#A8761A)' }}
                                >
                                    🔥 {scarcityLabel}
                                </span>
                            </div>
                        </div>

                        {/* Card Info */}
                        <div className="px-3.5 pt-3 pb-3.5">
                            {/* Social proof */}
                            <div className="flex items-center gap-1 mb-1.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-[11px] font-bold text-slate-700">{rating}</span>
                                <span className="text-[11px] text-slate-400">({reviews} Reviews)</span>
                            </div>

                            {/* Title + price row */}
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                                        {property.title}
                                    </h3>
                                    <div className="flex items-center text-slate-500 text-xs mt-0.5 gap-0.5">
                                        <MapPin className="w-3 h-3 shrink-0 text-[#B11226]/60" />
                                        <span className="truncate">
                                            <span className="font-semibold text-slate-700">{property.location?.split(',')[0]}</span>
                                            {property.location?.includes(',') ? `, ${property.location.split(',').slice(1).join(',').trim()}` : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[9px] text-slate-400 leading-none mb-0.5">Starting at</p>
                                    <p className="font-bold text-sm leading-snug" style={{ color: '#B11226' }}>{property.price}</p>
                                    {property.category === 'rent' && <p className="text-[9px] text-slate-400 leading-none">per month</p>}
                                    <p className="text-[9px] text-slate-400 italic mt-0.5">Only {rooms} left</p>
                                </div>
                            </div>

                            {/* CTA row */}
                            <div className="flex gap-2 mt-3">
                                <Link
                                    to={`/properties/${routeCategory}/${property.slug}`}
                                    state={{ from }}
                                    className="flex-1 text-center py-2.5 rounded-xl text-white text-xs font-bold tracking-wide transition-transform active:scale-95"
                                    style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)' }}
                                >
                                    Book a Visit
                                </Link>
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 border"
                                    style={{ color: '#B11226', borderColor: 'rgba(177,18,38,0.25)', background: 'rgba(177,18,38,0.04)' }}
                                    aria-label="WhatsApp chat"
                                >
                                    💬 Chat
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
