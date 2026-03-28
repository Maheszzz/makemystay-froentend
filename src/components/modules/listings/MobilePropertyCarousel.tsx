import { Link, useLocation } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import type { Property } from '@/types/api';

interface MobilePropertyCarouselProps {
    properties: Property[];
}

function getFallbackImageForType(type?: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'pg' || t === 'hostel') {
        return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80';
    }
    if (t === 'plot') {
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
    }
    if (t.includes('villa') || t.includes('4bhk') || t.includes('3bhk')) {
        return 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';
}

export function MobilePropertyCarousel({ properties }: MobilePropertyCarouselProps) {
    if (properties.length === 0) return null;
    const location = useLocation();
    const from = `${location.pathname}${location.search}${location.hash}`;

    return (
        <div className="md:hidden px-4 flex flex-col gap-4">
            {properties.map((property) => {
                const rawImages = property.images && property.images.length > 0 ? property.images : (property.image ? [property.image] : []);
                const images = rawImages.map((img: any) => typeof img === 'string' ? img : img?.image_url).filter(Boolean);
                const propertyPath = getPropertyDetailPath(property);
                const contactNumber = '8150099911';

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
                        <div className="relative w-full bg-slate-100" style={{ aspectRatio: '16/9' }}>
                            {images[0] ? (
                                <img
                                    src={images[0]}
                                    alt={property.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        const fallback = getFallbackImageForType(property.type);
                                        if (target.src !== fallback) {
                                            target.src = fallback;
                                            return;
                                        }
                                        // Hide broken image icon as final fallback.
                                        target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <img
                                    src={getFallbackImageForType(property.type)}
                                    alt={property.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            )}
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
                                    to={propertyPath}
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
