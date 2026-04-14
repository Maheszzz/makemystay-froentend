import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import { MapPin, MessageCircle, Star, TrendingUp } from 'lucide-react';
import { formatPropertyTitle, reviewsLabel } from '@/lib/formatPropertyTitle';
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

function SwipeableImageGallery({ images, fallbackImg, title }: { images: string[], fallbackImg: string, title: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };

    const displayImages = images.length > 0 ? images : [fallbackImg];

    return (
        <>
            {/* Carousel */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {displayImages.map((img, i) => (
                    <div key={i} className="min-w-full h-full snap-center relative shrink-0">
                        <img
                            src={img}
                            alt={`${title} - view ${i + 1}`}
                            className="w-full h-full object-cover object-center transition-opacity duration-500"
                            draggable={false}
                            loading="lazy"
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== fallbackImg) {
                                    target.src = fallbackImg;
                                } else {
                                    target.style.display = 'none';
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Dots */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 pointer-events-none z-10">
                    {displayImages.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                currentIndex === i
                                    ? "bg-white scale-125 shadow-sm"
                                    : "bg-white/50 shadow-sm"
                            }`}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export function MobilePropertyCarousel({ properties }: MobilePropertyCarouselProps) {
    const list = Array.isArray(properties) ? properties : [];
    if (list.length === 0) return null;
    const location = useLocation();
    const from = `${location.pathname}${location.search}${location.hash}`;

    return (
        <div className="md:hidden px-4 flex flex-col gap-4">
            {list.map((property) => {
                const rawImages =
                    Array.isArray(property.images) && property.images.length > 0
                        ? property.images
                        : property.image
                          ? [property.image]
                          : [];
                const images = rawImages.map((img: any) => typeof img === 'string' ? img : img?.image_url).filter(Boolean);
                const propertyPath = getPropertyDetailPath(property);
                const contactNumber = '918150099911';
                const displayTitle = formatPropertyTitle(property.title);

                // Deterministic scarcity only (rooms left)
                const idx = (Number(property.id) || 0) % 3;
                const scarcityLabels = ['Limited Availability', 'High Demand', 'Most Viewed'];
                const scarcityLabel = scarcityLabels[idx];
                const roomsLeft = [2, 3, 1];
                const rooms = roomsLeft[idx];

                const waLink = `https://wa.me/${contactNumber}?text=${encodeURIComponent(`Hi! I'm interested in ${displayTitle} at ${property.location}. Please share more details.`)}`;

                return (
                    <div
                        key={property.id}
                        className="bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-listing"
                    >
                        <div className="relative w-full bg-slate-900" style={{ aspectRatio: '16/9' }}>
                            <div className="absolute inset-0">
                                <SwipeableImageGallery
                                    images={images}
                                    fallbackImg={getFallbackImageForType(property.type)}
                                    title={displayTitle}
                                />
                            </div>
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase leading-tight px-2.5 py-1 rounded-full bg-white/95 text-slate-800 shadow-sm backdrop-blur-md border border-white/60">
                                    {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold tracking-wide uppercase leading-tight px-2.5 py-1 rounded-full text-white bg-slate-900/88 backdrop-blur-sm shadow-sm border border-white/10">
                                    <TrendingUp className="w-3 h-3 shrink-0 opacity-95" aria-hidden />
                                    {scarcityLabel}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-1.5 mb-2">
                                {(property.rating ?? 0) > 0 ? (
                                    <>
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-bold text-slate-700">{(property.rating ?? 0).toFixed(1)}</span>
                                        <span className="text-xs text-slate-500">({reviewsLabel(property.reviews || 0)})</span>
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                                        <span className="text-xs font-semibold text-slate-400">New Listing</span>
                                    </>
                                )}
                            </div>

                            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-1">{displayTitle}</h3>

                            <div className="flex items-center text-slate-500 text-xs gap-1 mb-4">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-red/70" />
                                <span className="truncate">
                                    <span className="font-semibold text-slate-700">{property.location?.split(',')[0]}</span>
                                    {property.location?.includes(',')
                                        ? `, ${property.location.split(',').slice(1).join(',').trim()}`
                                        : ''}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 mb-4">
                                <div>
                                    <p className="text-xs text-slate-500 leading-tight mb-1">Starting at</p>
                                    <p className="text-xl font-bold leading-tight text-brand-red">{property.price}</p>
                                    {property.category === 'rent' && (
                                        <p className="text-xs text-slate-500 mt-1">Per month</p>
                                    )}
                                </div>
                                <span className="inline-flex self-start items-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200/80">
                                    Only {rooms} Rooms Left
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Link
                                    to={propertyPath}
                                    state={{ from }}
                                    className="flex-1 text-center py-3 rounded-xl text-white text-xs font-bold tracking-wide bg-gradient-to-br from-brand-red to-red-900 shadow-md shadow-brand-red/15 active:scale-[0.98] transition-transform"
                                >
                                    Book a Visit
                                </Link>
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-semibold transition-all border active:scale-[0.98] text-brand-red border-brand-red/25 bg-brand-red/[0.06] hover:bg-brand-red/[0.1]"
                                    aria-label="WhatsApp chat"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                    Chat
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
