'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface PropertyGalleryProps {
    images: string[];
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

    const safeImages = images.filter(Boolean);
    const total = safeImages.length;

    const getAlt = useCallback(
        (idx: number) =>
            `${title}${location ? ` in ${location}` : ''} — photo ${idx + 1} of ${total}`,
        [title, location, total],
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

    if (total === 0) {
        return null;
    }

    const desktopImages = safeImages.slice(0, 5);

    const desktopGridClass = (() => {
        if (desktopImages.length === 1) return 'grid-cols-1';
        if (desktopImages.length === 2) return 'grid-cols-2 h-[380px]';
        if (desktopImages.length === 3) return 'grid-cols-3 grid-rows-2 h-[420px]';
        return 'grid-cols-4 grid-rows-2 h-[440px]';
    })();

    const getTileSpanClass = (idx: number, count: number): string => {
        if (count === 1) return 'aspect-[16/9] max-h-[460px]';
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
        if (count === 1) return '(max-width: 1024px) 100vw, 62vw';
        if (count === 2) return '(max-width: 1024px) 50vw, 31vw';
        if (idx === 0) return '(max-width: 1024px) 100vw, 36vw';
        return '(max-width: 1024px) 50vw, 18vw';
    };

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
                    {safeImages.map((src, idx) => (
                        <button
                            key={`${src}-${idx}`}
                            type="button"
                            onClick={() => openLightbox(idx)}
                            className="relative w-full shrink-0 snap-center aspect-[4/3] bg-[#EAEAE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                            aria-label={`Open photo ${idx + 1} of ${total} in full view`}
                        >
                            <OptimizedImage
                                src={src}
                                alt={getAlt(idx)}
                                fill
                                priority={idx === 0}
                                placeholder="blur"
                                size={idx === 0 ? 'large' : 'medium'}
                                sizes="100vw"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => openLightbox(mobileIndex)}
                    className="absolute bottom-3 right-3 min-h-[36px] px-3 py-1.5 rounded-lg bg-pdp-surface/95 text-pdp-ink border border-pdp-border text-xs font-medium tabular-nums shadow-sm"
                    aria-label={`Show all ${total} photos`}
                >
                    {mobileIndex + 1} / {total}
                </button>
            </div>

            {/* Desktop Mosaic Gallery */}
            <div className="hidden md:block relative overflow-hidden rounded-[var(--radius-pdp)] border border-pdp-border bg-[#EAEAE5]">
                <div className={`grid gap-2 ${desktopGridClass}`}>
                    {desktopImages.map((src, idx) => (
                        <button
                            key={`${src}-${idx}`}
                            type="button"
                            onClick={() => openLightbox(idx)}
                            className={`relative w-full overflow-hidden bg-[#EAEAE5] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pdp-ink ${getTileSpanClass(idx, desktopImages.length)}`}
                            aria-label={`View photo ${idx + 1} of ${total}`}
                        >
                            <OptimizedImage
                                src={src}
                                alt={getAlt(idx)}
                                fill
                                priority={idx === 0}
                                placeholder="blur"
                                size={idx === 0 ? 'large' : 'medium'}
                                sizes={getTileSizes(idx, desktopImages.length)}
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    className="absolute bottom-3.5 right-3.5 min-h-[44px] px-4 py-2 rounded-[10px] bg-pdp-surface text-pdp-ink border border-pdp-border text-sm font-medium inline-flex items-center gap-2 shadow-sm hover:bg-pdp-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                >
                    <Images className="w-4 h-4 shrink-0" aria-hidden />
                    <span>
                        {total === 1 ? 'View photo' : `Show all ${total} photos`}
                    </span>
                </button>
            </div>

            {/* Accessible Lightbox */}
            {lightboxIndex !== null && (
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Property photo gallery"
                    className="fixed inset-0 z-[200] bg-black/92 flex flex-col justify-between p-4 sm:p-6"
                    onClick={closeLightbox}
                >
                    <div
                        className="flex items-center justify-between text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-sm font-medium tabular-nums">
                            {lightboxIndex + 1} / {total}
                        </span>
                        <button
                            ref={closeBtnRef}
                            type="button"
                            onClick={closeLightbox}
                            aria-label="Close gallery"
                            className="min-w-[44px] min-h-[44px] rounded-full bg-white/10 border border-white/20 text-white inline-flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div
                        className="relative flex-1 flex items-center justify-center my-4 min-h-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {total > 1 && (
                            <button
                                type="button"
                                onClick={goPrev}
                                aria-label="Previous photo"
                                className="absolute left-0 sm:left-2 z-10 min-w-[44px] min-h-[44px] rounded-full bg-white/10 border border-white/20 text-white inline-flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        <img
                            src={safeImages[lightboxIndex]}
                            alt={getAlt(lightboxIndex)}
                            className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-[var(--radius-pdp)] select-none"
                            decoding="async"
                        />

                        {total > 1 && (
                            <button
                                type="button"
                                onClick={goNext}
                                aria-label="Next photo"
                                className="absolute right-0 sm:right-2 z-10 min-w-[44px] min-h-[44px] rounded-full bg-white/10 border border-white/20 text-white inline-flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    <p
                        className="text-center text-xs sm:text-sm text-white/80 truncate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {getAlt(lightboxIndex)}
                    </p>
                </div>
            )}
        </>
    );
}
