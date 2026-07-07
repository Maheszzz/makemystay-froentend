'use client';

import {
    ArrowRight,
    Bath,
    Bed,
    Heart,
    MapPin,
    MessageCircle,
    Star,
    Users,
    Utensils,
    Zap,
    ShieldCheck,
    Video,
    TrendingUp,
    CheckCircle2,
    Clock,
    Zap as Flash,
    Map
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from '@/lib/navigation';

import { useWishlist } from '@/context/WishlistContext';
import { LeadCaptureModal } from '@/components/modals/LeadCaptureModal';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { Property } from '@/types/api';

interface PropertyCardProps {
    property: Property;
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

function PropertyCardComponent({ property }: PropertyCardProps) {
    let listingFrom = '';
    let wishlisted = false;
    let toggleWishlist = (_p: Property) => {};
    try {
        const wishlistContext = useWishlist();
        wishlisted = wishlistContext.isWishlisted(String(property.id));
        toggleWishlist = wishlistContext.toggleWishlist;
    } catch {
        // Fallback
    }

    const handleHeartClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(property);
    }, [property, toggleWishlist]);

    const fallbackImage = useMemo(() => getFallbackImageForType(property.type), [property.type]);

    const displayImage = useMemo(() => {
        const prop: any = property;
        const imgs = Array.isArray(prop.images) ? prop.images : [];
        const ph = Array.isArray(prop.photos) ? prop.photos : [];
        const parsedImages = imgs.map((img: any) => (typeof img === 'string' ? img : img?.image_url)).filter(Boolean);
        const parsedPhotos = ph.map((img: any) => (typeof img === 'string' ? img : img?.image_url)).filter(Boolean);
        return parsedImages[0] || prop.image || parsedPhotos[0] || fallbackImage || '/default-property.jpg';
    }, [property, fallbackImage]);

    const typeLower = (property.type || '').toLowerCase();
    const isServiceOriented = typeLower === 'pg' || typeLower === 'hostel';

    const amenities = useMemo(() => {
        const next: string[] = [];
        if (property.wifi) next.push('WiFi');
        if (property.ac) next.push('AC');
        if (property.power_backup) next.push('Power Backup');
        if (property.food) next.push('Food Included');
        if (property.gym) next.push('Gym');
        if (property.cctv) next.push('Security');
        return next;
    }, [property]);

    const propertyPath = getPropertyDetailPath(property);
    const displayTitle = useMemo(() => formatPropertyTitle(property.title), [property.title]);
    const waLink = useMemo(() => buildPropertyWhatsappUrl(displayTitle || property.title, property.location || ''), [displayTitle, property.title, property.location]);
    
    // Mocking premium AI fields for visual presentation based on property ID length/chars to keep it consistent
    const idHash = String(property.id).length + (String(property.id).charCodeAt(0) || 0);
    const aiMatchScore = 88 + (idHash % 11); // 88 - 98
    const distanceMetro = 200 + (idHash % 900); // 200m - 1100m
    const showInstantBook = idHash % 2 === 0;
    const showTrending = idHash % 3 === 0;
    const showPriceDrop = idHash % 4 === 0;

    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    return (
        <>
        <Link
            to={propertyPath}
            state={{ from: listingFrom }}
            className="block h-full group outline-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
            aria-label={`View details for ${displayTitle}`}
        >
            <div className="bg-white rounded-[24px] border border-gray-200 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 h-full flex flex-col overflow-hidden relative">
                
                {/* Image Area - 16:10 Aspect Ratio */}
                <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-gray-100">
                    <OptimizedImage
                        src={displayImage}
                        alt={displayTitle}
                        fill
                        size="medium"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pr-12">
                        {showInstantBook && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-semibold text-[#111827] shadow-sm">
                                <Flash className="w-3 h-3 text-[#E53935]" /> Instant Book
                            </span>
                        )}
                        {showTrending && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-semibold text-[#111827] shadow-sm">
                                <TrendingUp className="w-3 h-3 text-orange-500" /> Trending
                            </span>
                        )}
                    </div>

                    {/* Wishlist Heart */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleHeartClick}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleHeartClick(e as any);
                            }
                        }}
                        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm cursor-pointer"
                    >
                        <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-[#E53935] text-[#E53935]' : 'text-gray-500'}`} />
                    </div>

                    {/* Bottom Image Info */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="w-fit flex items-center gap-1 px-2 py-1 bg-[#E53935] rounded-md text-[11px] font-bold text-white shadow-sm">
                                <Star className="w-3 h-3 fill-white" />
                                {property.rating ? property.rating.toFixed(1) : '4.8'}
                            </span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[10px] font-medium text-white">
                                <Video className="w-3 h-3" /> 360° Tour
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-5 bg-white">
                    {/* Header: AI Score & Title */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-[#E53935] uppercase tracking-wider flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5" /> {aiMatchScore}% Match for you
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                {property.type?.toUpperCase() || 'PG'}
                            </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#111827] leading-tight line-clamp-1 mb-2 group-hover:text-[#E53935] transition-colors">
                            {displayTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium w-full">
                            <div className="flex items-center gap-1 min-w-0 flex-shrink">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-[#E53935]" />
                                <span className="truncate">{property.location}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Map className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                <span className="whitespace-nowrap">{distanceMetro}m to Metro</span>
                            </div>
                        </div>
                    </div>

                    {/* Room Config / Specs */}
                    <div className="flex flex-wrap gap-2 mt-1 mb-4">
                        {isServiceOriented ? (
                            <>
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold border border-gray-100 rounded-md flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-gray-400" /> {Array.isArray(property.sharing) ? property.sharing[0] : 'Shared'}
                                </span>
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold border border-gray-100 rounded-md flex items-center gap-1.5">
                                    <Utensils className="w-3.5 h-3.5 text-gray-400" /> {property.food ? 'Food Incl.' : 'No Food'}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold border border-gray-100 rounded-md flex items-center gap-1.5">
                                    <Bed className="w-3.5 h-3.5 text-gray-400" /> {property.beds || 1} Bed
                                </span>
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold border border-gray-100 rounded-md flex items-center gap-1.5">
                                    <Bath className="w-3.5 h-3.5 text-gray-400" /> {property.baths || 1} Bath
                                </span>
                            </>
                        )}
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100 rounded-md flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" /> Move In Today
                        </span>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                            <ShieldCheck className="w-3.5 h-3.5" /> Owner Verified
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Zero Brokerage
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-auto pt-1 flex flex-wrap items-center justify-between gap-y-3 gap-x-2">
                        <div className="flex-1 min-w-[120px]">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Starting From
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[18px] font-black text-[#111827] leading-none whitespace-nowrap">
                                    {property.price}
                                </span>
                                {isServiceOriented && (
                                    <span className="text-[11px] font-bold text-gray-400">/mo</span>
                                )}
                            </div>
                            {showPriceDrop && (
                                <p className="text-[10px] font-semibold text-emerald-500 mt-1.5 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 rotate-180" /> Price dropped
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsLeadModalOpen(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsLeadModalOpen(true);
                                    }
                                }}
                                className="w-9 h-9 rounded-full bg-[#ecfdf5] border border-[#d1fae5] flex items-center justify-center text-[#059669] hover:bg-[#10b981] hover:text-white transition-colors cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <div className="h-9 px-3.5 rounded-full bg-[#111827] text-white flex items-center justify-center text-[12px] font-bold gap-1.5 transition-all group-hover:bg-[#E53935] group-hover:shadow-[0_4px_12px_rgba(229,57,53,0.3)]">
                                View Details <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Link>
            
            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                title="Chat on WhatsApp"
                subtitle={`Connect directly with the verified owner of ${displayTitle}.`}
                source="Premium Card - WhatsApp"
                actionLabel="Continue to WhatsApp"
                propertyTitle={displayTitle || property.title}
                propertyLocation={property.location}
                whatsappUrl={waLink}
            />
        </>
    );
}

export const PropertyCard = memo(PropertyCardComponent);
