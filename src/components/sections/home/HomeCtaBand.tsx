'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { LISTING_HERO_PHOTO } from '@/components/modules/listings/ListingHero';
import { Link } from '@/lib/navigation';
import { getWhatsappDigits } from '@/lib/whatsapp';

export function HomeCtaBand() {
    const [photoFailed, setPhotoFailed] = useState(false);

    const whatsappHref = `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(
        'Hi MakeMyStay team, I want to find a verified home in Bangalore.',
    )}`;

    return (
        <section className="relative isolate overflow-hidden bg-cta-band text-white min-h-[280px] md:min-h-[340px] flex items-center">
            {!photoFailed && (
                <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
                    <Image
                        src={LISTING_HERO_PHOTO}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="100vw"
                        quality={75}
                        onError={() => setPhotoFailed(true)}
                        className="object-cover object-right"
                    />
                </div>
            )}

            <div aria-hidden="true" className="listing-hero-overlay absolute inset-0 -z-10" />

            {/* Subtle 10% logo street-line SVG motif layered cleanly over the band */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-10"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath d=\'M-1 1L1 -1M0 40L40 0M39 41L41 39M0 0L40 40M-1 39L1 41M39 -1L41 1M-1 21L21 -1M19 41L41 19\' stroke=\'%23FFFFFF\' stroke-width=\'1\' fill=\'none\'/%3E%3C/svg%3E")',
                    backgroundSize: '40px 40px',
                    backgroundRepeat: 'repeat',
                }}
            />

            <div className="relative z-10 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="max-w-[580px]">
                    <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-[42px] leading-[1.15] tracking-[-0.015em] text-white">
                        Ready to find your next home?
                    </h2>
                    <p className="mt-3 text-base md:text-lg leading-relaxed text-white/90">
                        Browse verified PGs, rental flats, homes to buy, and plots across Bangalore.
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                            to="/properties"
                            className="min-h-[44px] px-6 py-3 rounded-[10px] bg-white text-red hover:bg-blush-100 font-semibold text-sm inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-deep"
                        >
                            <span>Explore properties</span>
                            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                        </Link>
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[44px] px-6 py-3 rounded-[10px] border border-white text-white hover:bg-white/10 font-semibold text-sm inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-deep"
                        >
                            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>Chat on WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
