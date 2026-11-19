import Image from 'next/image';
import React from 'react';

export interface BrandLogoProps {
    /**
     * `'dark'` — red emblem + ink wordmark for light/white surfaces (Navbar).
     * `'light'` — emblem with hairline border + white wordmark for dark/red surfaces (Footer, drawers).
     */
    variant?: 'light' | 'dark';
    className?: string;
}

/**
 * Official MakeMyStay Realty emblem + MakeMyStay.ai wordmark used across Navbar, drawers, and Footer.
 */
export function BrandLogo({ variant = 'dark', className = '' }: BrandLogoProps) {
    const isLight = variant === 'light';

    return (
        <span
            data-brand-logo={variant}
            className={`inline-flex items-center gap-2.5 select-none shrink-0 ${className}`}
        >
            <Image
                src="/logo-mark.webp"
                alt=""
                width={32}
                height={32}
                priority={variant === 'dark'}
                aria-hidden="true"
                className={`w-8 h-8 shrink-0 rounded-[8px] object-cover ${
                    isLight ? 'border border-champagne/40' : ''
                }`}
            />

            <span
                className={`text-lg sm:text-[19px] font-bold tracking-tight font-heading leading-none ${
                    isLight ? 'text-white' : 'text-ink'
                }`}
            >
                MakeMyStay
                <span className={isLight ? 'text-red-subtitle font-semibold' : 'text-red font-semibold'}>
                    .ai
                </span>
            </span>
        </span>
    );
}
