'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export type GalleryImageInput = string | { url: string; caption?: string };

interface NormalizedGalleryItem {
    url: string;
    caption?: string;
}

interface PropertyGalleryProps {
    images: GalleryImageInput[];
    title: string;
    location: string;
}

export function PropertyGallery({ images, title, location }: PropertyGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [mobileIndex, setMobileIndex] = useState(0);
    const mobileTrackRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const lastActiveRef = useRef<HTMLElement | null>(null);
    const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const safeImages = useMemo<NormalizedGalleryItem[]>(() => {
        const seen = new Set<string>();
        const items: NormalizedGalleryItem[] = [];
        for (const entry of images) {
            const url = typeof entry === 'string' ? entry.trim() : entry?.url?.trim();
            if (!url || seen.has(url)) continue;
            seen.add(url);
            const caption =
                typeof entry === 'string'
                    ? undefined
                    : entry?.caption?.trim() || undefined;
            items.push(caption ? { url, caption } : { url });
        }
        return items;
    }, [images]);

    const total = safeImages.length;

    const getAlt = useCallback(
        (idx: number) => {
            const cap = safeImages[idx]?.caption;
            const place = location ? ` in ${location}` : '';
            return cap
                ? `${title}${place} — ${cap} (${idx + 1} of ${total})`
                : `${title}${place} — photo ${idx + 1} of ${total}`;
        },
        [safeImages, title, location, total],
    );

    const openLightbox = useCallback((idx: number) => {
        if (typeof document !== 'undefined') {
            lastActiveRef.current = document.activeElement as HTMLElement | null;
        }
        setLightboxIndex(idx);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
    }, []);

    const goPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev === null ? null : prev === 0 ? total - 1 : prev - 1));
    }, [total]);

    const goNext = useCallback(() => {
        setLightboxIndex((prev) => (prev === null ? null : prev === total - 1 ? 0 : prev + 1));
    }, [total]);

    // Auto-scroll active thumbnail into view when navigating in lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;
        const activeThumb = thumbRefs.current[lightboxIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [lightboxIndex]);

    // Lock body scroll, manage focus trap & keyboard shortcuts when lightbox is open.
    useEffect(() => {
        if (lightboxIndex === null) {
            if (lastActiveRef.current) {
                lastActiveRef.current.focus();
                lastActiveRef.current = null;
            }
            return;
        }

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeBtnRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
                return;
            }
            if (e.key === 'ArrowLeft' && total > 1) {
                e.preventDefault();
                goPrev();
                return;
            }
            if (e.key === 'ArrowRight' && total > 1) {
                e.preventDefault();
                goNext();
                return;
            }
            if (e.key === 'Tab' && dialogRef.current) {
                const focusables = Array.from(
                    dialogRef.current.querySelectorAll<HTMLElement>(
                        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
                    ),
                );
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxIndex, total, closeLightbox, goPrev, goNext]);

    const handleMobileScroll = () => {
        const el = mobileTrackRef.current;
        if (!el || el.clientWidth <= 0) return;
        const idx = Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)));
        if (idx !== mobileIndex) {
            setMobileIndex(idx);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current || total <= 1 || e.changedTouches.length === 0) {
            touchStartRef.current = null;
            return;
        }
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
        touchStartRef.current = null;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) goNext();
            else goPrev();
        }
    };

    if (total === 0) {
        return null;
    }

    const desktopImages = safeImages.slice(0, 5);

    const desktopGridClass = (() => {
        if (desktopImages.length === 1) return 'grid-cols-1 h-[480px] lg:h-[520px]';
        if (desktopImages.length === 2) return 'grid-cols-2 h-[480px] lg:h-[520px]';
        if (desktopImages.length === 3) return 'grid-cols-3 grid-rows-2 h-[480px] lg:h-[520px]';
        return 'grid-cols-4 grid-rows-2 h-[480px] lg:h-[520px]';
    })();

    const getTileSpanClass = (idx: number, count: number): string => {
        if (count === 1) return 'h-full';
        if (count === 2) return 'h-full';
        if (count === 3) return idx === 0 ? 'col-span-2 row-span-2 h-full' : 'col-span-1 row-span-1 h-full';
        if (count === 4) {
            if (idx === 0) return 'col-span-2 row-span-2 h-full';
            if (idx === 1) return 'col-span-2 row-span-1 h-full';
            return 'col-span-1 row-span-1 h-full';
        }
        return idx === 0 ? 'col-span-2 row-span-2 h-full' : 'col-span-1 row-span-1 h-full';
    };

    const getTileSizes = (idx: number, count: number): string => {
        if (count === 1) return '(max-width: 1024px) 100vw, 760px';
        if (count === 2) return '(max-width: 1024px) 50vw, 380px';
        if (idx === 0) return '(max-width: 1024px) 100vw, 420px';
        return '(max-width: 1024px) 50vw, 220px';
    };

    const activeItem = lightboxIndex !== null ? safeImages[lightboxIndex] : null;

    return (
        <>
            {/* Mobile Swipeable Carousel (1 / N counter, no thumbnail strip) */}
            <div className="md:hidden relative overflow-hidden rounded-[var(--radius-pdp)] border border-pdp-border bg-[#EAEAE5]">
                <div
                    ref={mobileTrackRef}
                    onScroll={handleMobileScroll}
                    className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
                    aria-label="Property photos"
                >
                    {safeImages.map((item, idx) => (
                        <button
                            key={`${item.url}-${idx}`}
                            type="button"
                            onClick={() => openLightbox(idx)}
                            className="relative w-full shrink-0 snap-center aspect-[4/3] bg-[#EAEAE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                            aria-label={`Open photo ${idx + 1} of ${total} in full view`}
                        >
                            <OptimizedImage
                                src={item.url}
                                alt={getAlt(idx)}
                                fill
                                priority={idx === 0}
                                placeholder="blur"
                                size={idx === 0 ? 'large' : 'medium'}
                                sizes="100vw"
                                className="object-cover"
                            />
                            {item.caption && (
                                <span className="absolute bottom-3 left-3 max-w-[65%] truncate rounded-md bg-black/65 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                                    {item.caption}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => openLightbox(mobileIndex)}
                    className="absolute bottom-3 right-3 min-h-[36px] px-3 py-1.5 rounded-lg bg-pdp-surface/95 text-pdp-ink border border-pdp-border text-xs font-medium tabular-nums shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                    aria-label={`Show all ${total} photos`}
                >
                    {mobileIndex + 1} / {total}
                </button>
            </div>

            {/* Desktop Mosaic Gallery — 480-520px tall, 8px gutter (gap-2), 14px outer radius */}
            <div className="hidden md:block relative overflow-hidden rounded-[var(--radius-pdp)] border border-pdp-border bg-[#EAEAE5]">
                <div className={`grid gap-2 ${desktopGridClass}`}>
                    {desktopImages.map((item, idx) => (
                        <button
                            key={`${item.url}-${idx}`}
                            type="button"
                            onClick={() => openLightbox(idx)}
                            className={`group relative w-full overflow-hidden bg-[#EAEAE5] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pdp-ink cursor-pointer ${getTileSpanClass(idx, desktopImages.length)}`}
                            aria-label={`View photo ${idx + 1} of ${total}${item.caption ? ` (${item.caption})` : ''}`}
                        >
                            <OptimizedImage
                                src={item.url}
                                alt={getAlt(idx)}
                                fill
                                priority={idx === 0}
                                placeholder="blur"
                                size={idx === 0 ? 'large' : 'medium'}
                                sizes={getTileSizes(idx, desktopImages.length)}
                                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
                            />
                            {item.caption && (
                                <span className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-md bg-black/65 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                                    {item.caption}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Positioned bottom-right with 12px inset (bottom-3 right-3), away from left main subject */}
                <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    className="absolute bottom-3 right-3 min-h-[40px] px-3.5 py-2 rounded-[10px] bg-pdp-surface/95 backdrop-blur-sm text-pdp-ink border border-pdp-border text-xs font-medium inline-flex items-center gap-2 shadow-sm hover:bg-pdp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink transition-colors cursor-pointer"
                >
                    <Images className="w-4 h-4 shrink-0" aria-hidden />
                    <span className="tabular-nums">
                        {total === 1 ? 'View photo' : `Show all ${total} photos`}
                    </span>
                </button>
            </div>

            {/* Accessible Smooth Lightbox with Swipe & Thumbnails Strip */}
            {lightboxIndex !== null && activeItem && (
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Property photo gallery"
                    className="animate-pdp-backdrop fixed inset-0 z-[200] bg-black/92 flex flex-col justify-between p-4 sm:p-6 gap-4"
                    onClick={closeLightbox}
                >
                    {/* Top Bar */}
                    <div
                        className="flex items-center justify-between text-white shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-sm font-medium tabular-nums">
                                {lightboxIndex + 1} / {total}
                            </span>
                            {activeItem.caption && (
                                <span className="truncate rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/95">
                                    {activeItem.caption}
                                </span>
                            )}
                        </div>
                        <button
                            ref={closeBtnRef}
                            type="button"
                            onClick={closeLightbox}
                            aria-label="Close gallery"
                            className="min-w-[44px] min-h-[44px] rounded-full bg-white/10 border border-white/20 text-white inline-flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Main Image Stage with Touch Swipe & Scale-In */}
                    <div
                        className="relative flex-1 flex items-center justify-center min-h-0"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {total > 1 && (
                            <button
                                type="button"
                                onClick={goPrev}
                                aria-label="Previous photo"
                                className="absolute left-0 sm:left-2 z-10 min-w-[44px] min-h-[44px] rounded-full bg-white/10 border border-white/20 text-white inline-flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        <div
                            key={lightboxIndex}
                            className="animate-pdp-lightbox flex items-center justify-center max-w-full max-h-full"
                        >
                            <img
                                src={activeItem.url}
                                alt={getAlt(lightboxIndex)}
                                className="max-w-[90vw] max-h-[68vh] w-auto h-auto object-contain rounded-[var(--radius-pdp)] select-none"
                                decoding="async"
                            />
                        </div>

                        {total > 1 && (
                            <button
                                type="button"
                                onClick={goNext}
                                aria-label="Next photo"
                                className="absolute right-0 sm:right-2 z-10 min-w-[44px] min-h-[44px] rounded-full bg-white/10 border border-white/20 text-white inline-flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Bottom Thumbnails Strip */}
                    {total > 1 && (
                        <div
                            className="shrink-0 flex flex-col items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="flex items-center gap-2 max-w-[92vw] overflow-x-auto no-scrollbar px-2 py-1"
                                role="tablist"
                                aria-label="Select a photo"
                            >
                                {safeImages.map((item, idx) => {
                                    const active = idx === lightboxIndex;
                                    return (
                                        <button
                                            key={`${item.url}-thumb-${idx}`}
                                            ref={(el) => {
                                                thumbRefs.current[idx] = el;
                                            }}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            aria-label={`Photo ${idx + 1}${item.caption ? `: ${item.caption}` : ''}`}
                                            onClick={() => setLightboxIndex(idx)}
                                            className={`relative w-14 h-14 sm:w-16 sm:h-12 shrink-0 rounded-lg overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
                                                active
                                                    ? 'ring-2 ring-white opacity-100 scale-105'
                                                    : 'opacity-50 hover:opacity-85'
                                            }`}
                                        >
                                            <img
                                                src={item.url}
                                                alt=""
                                                aria-hidden="true"
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
