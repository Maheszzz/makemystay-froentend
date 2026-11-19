import { Link } from '@/lib/navigation';
import { useRef, useState } from 'react';
import { ArrowRight, BadgeCheck, MapPin, MessageCircle, Star } from 'lucide-react';
import { formatPropertyTitle, reviewsLabel } from '@/lib/formatPropertyTitle';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import type { Property } from '@/types/api';
import { LeadCaptureModal } from '@/components/modals/LeadCaptureModal';

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
    const from = '';

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [selectedWaLink, setSelectedWaLink] = useState<string>('');

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
                const displayTitle = formatPropertyTitle(property.title);
                const isMonthlyRent = property.category === 'pg' || property.category === 'rent';
                const hasNumericPrice = Boolean(property.price && !/request/i.test(property.price));
                const waLink = buildPropertyWhatsappUrl(displayTitle || property.title, property.location || '', propertyPath);

                return (
                    <div
                        key={property.id}
                        className="group bg-white rounded-[var(--radius-pdp)] overflow-hidden border border-line"
                    >
                        <div className="relative w-full bg-blush-100" style={{ aspectRatio: '16/9' }}>
                            <div className="absolute inset-0">
                                <SwipeableImageGallery
                                    images={images}
                                    fallbackImg={getFallbackImageForType(property.type)}
                                    title={displayTitle}
                                />
                            </div>
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                                <span className="text-xs font-medium leading-tight px-2.5 py-1 rounded-full bg-white/95 text-ink border border-line">
                                    {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium leading-tight px-2.5 py-1 rounded-full text-white bg-red-900/90">
                                    <BadgeCheck className="w-3 h-3 shrink-0 text-champagne" aria-hidden />
                                    Verified
                                </span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 bg-white">
                            {(() => {
                                const ratingSummary = getQualifiedRatingSummary(property);
                                return (
                                    <div className="flex items-center gap-1.5 mb-2">
                                        {ratingSummary.showRating ? (
                                            <>
                                                <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
                                                <span className="text-xs font-semibold text-ink tabular-nums">
                                                    {ratingSummary.rating.toFixed(1)}
                                                </span>
                                                <span className="text-xs text-slate tabular-nums">
                                                    ({reviewsLabel(ratingSummary.reviewCount)})
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs font-medium text-slate">New Listing</span>
                                        )}
                                    </div>
                                );
                            })()}

                            <h3 className="font-heading text-[18px] font-bold text-ink leading-snug line-clamp-2 mb-1">{displayTitle}</h3>

                            <div className="flex items-center text-slate text-xs gap-1 mb-4">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-red" />
                                <span className="truncate">
                                    <span className="font-medium text-ink">{property.location?.split(',')[0]}</span>
                                    {property.location?.includes(',')
                                        ? `, ${property.location.split(',').slice(1).join(',').trim()}`
                                        : ''}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2.5 mb-4">
                                <div>
                                    <p className="text-xs text-slate leading-tight mb-1">Starting at</p>
                                    <p className="font-heading text-[1.25rem] font-bold leading-tight text-ink tabular-nums">
                                        {property.price}
                                        {isMonthlyRent && hasNumericPrice ? ' /mo' : ''}
                                    </p>
                                </div>
                                {typeof property.units_remaining === 'number' && property.units_remaining > 0 ? (
                                    <span className="inline-flex self-start items-center rounded-lg bg-blush-100 px-2.5 py-1.5 text-xs font-medium text-champagne-text border border-champagne/40 tabular-nums">
                                        Only {property.units_remaining}{' '}
                                        {property.units_remaining === 1 ? 'Room' : 'Rooms'} Left
                                    </span>
                                ) : (
                                    <span className="inline-flex self-start items-center rounded-lg bg-page px-2.5 py-1.5 text-xs font-medium text-slate border border-line">
                                        {property.is_available === false ? 'Currently Full' : 'Ready to Move'}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to={propertyPath}
                                    state={{ from }}
                                    className="flex-1 text-center py-2.5 rounded-[10px] text-white text-xs font-semibold bg-red hover:bg-red-hover transition-colors inline-flex items-center justify-center gap-1"
                                >
                                    <span>Book a Visit</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedProperty(property);
                                        setSelectedWaLink(waLink);
                                    }}
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[10px] text-xs font-semibold transition-colors border text-ink border-ink bg-white hover:bg-blush-100 cursor-pointer"
                                    aria-label="WhatsApp chat"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-verified" aria-hidden />
                                    Chat
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {selectedProperty && (
                <LeadCaptureModal
                    isOpen={!!selectedProperty}
                    onClose={() => {
                        setSelectedProperty(null);
                        setSelectedWaLink('');
                    }}
                    title="Enquire on WhatsApp"
                    subtitle={`Get immediate pricing, availability, and scheduling details for ${formatPropertyTitle(selectedProperty.title)} directly on WhatsApp.`}
                    source="Website - Mobile Carousel - WhatsApp"
                    actionLabel="Submit & Chat on WhatsApp"
                    propertyTitle={formatPropertyTitle(selectedProperty.title) || selectedProperty.title}
                    propertyLocation={selectedProperty.location}
                    whatsappUrl={selectedWaLink}
                />
            )}
        </div>
    );
}
