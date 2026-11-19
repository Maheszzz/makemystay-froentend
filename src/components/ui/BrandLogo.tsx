import React from 'react';

export interface BrandLogoProps {
    /**
     * `'dark'` — red emblem + ink wordmark for light/white surfaces (Navbar).
     * `'light'` — white emblem + white wordmark for dark/red surfaces (Footer, drawers).
     */
    variant?: 'light' | 'dark';
    className?: string;
}

/**
 * Single transparent SVG-ready logo component used in Navbar and Footer.
 * Swap the inline SVG/wordmark block inside with a transparent SVG asset
 * when final vector wordmark files are added to `/public`.
 */
export function BrandLogo({ variant = 'dark', className = '' }: BrandLogoProps) {
    const isLight = variant === 'light';

    return (
        <span
            data-brand-logo={variant}
            className={`inline-flex items-center gap-2.5 select-none shrink-0 ${className}`}
        >
            {/* Transparent vector emblem — house + street-map line motif matching favicons */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                width={30}
                height={30}
                aria-hidden="true"
                className="w-[30px] h-[30px] shrink-0"
            >
                <rect
                    width="36"
                    height="36"
                    rx="8"
                    fill={isLight ? 'rgba(255,255,255,0.12)' : 'var(--color-red)'}
                    stroke={isLight ? 'var(--color-champagne)' : 'none'}
                    strokeOpacity={isLight ? '0.45' : undefined}
                    strokeWidth={isLight ? '1' : undefined}
                />
                <path
                    d="M6 12L12 6M22 32L32 22M2 24L24 2"
                    stroke="#FFFFFF"
                    strokeOpacity={isLight ? '0.16' : '0.18'}
                    strokeWidth="1"
                    fill="none"
                />
                <path
                    d="M9 26.5V14l9-6 9 6v12.5h-5V17.25L18 14.5l-4 2.75V26.5H9z"
                    fill="#FFFFFF"
                />
                <rect
                    x="16.25"
                    y="19.5"
                    width="3.5"
                    height="7"
                    rx="0.75"
                    fill={isLight ? 'var(--color-red-subtitle)' : 'var(--color-blush-100)'}
                />
            </svg>

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
