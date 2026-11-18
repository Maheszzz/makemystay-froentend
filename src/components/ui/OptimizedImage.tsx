'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getOptimizedImageUrl, type ImageSize } from '@/lib/utils/images';
import { generateImageAltText } from '@/lib/imageSeoEngine';

export type OptimizedImageProps = {
    src: string;
    alt: string;
    title?: string;
    /** Use with a `position: relative` + explicit height parent */
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    className?: string;
    /** Unsplash resize preset */
    size?: ImageSize;
    ariaHidden?: boolean;
    fetchPriority?: 'auto' | 'high' | 'low';
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onError?: () => void;
    style?: React.CSSProperties;
};

function isOptimizableSrc(src: string): boolean {
    if (!src || src.startsWith('data:')) return false;
    if (src.startsWith('/')) return true;
    try {
        const host = new URL(src).hostname;
        return (
            host === 'images.unsplash.com' ||
            host.endsWith('.amazonaws.com') ||
            host.endsWith('makemystay.ai')
        );
    } catch {
        return false;
    }
}

/**
 * next/image wrapper: WebP/AVIF, lazy load, responsive sizes.
 * Falls back to unoptimized for CDN URLs outside remotePatterns.
 */
export function OptimizedImage({
    src,
    alt,
    title,
    fill,
    width,
    height,
    priority = false,
    quality,
    sizes,
    className,
    size = 'medium',
    ariaHidden = false,
    fetchPriority,
    onLoad,
    onError,
    style,
}: OptimizedImageProps) {
    const [failed, setFailed] = useState(false);
    const resolved = getOptimizedImageUrl(src, size) || src;

    if (!resolved || failed) {
        return null;
    }

    const unoptimized = !isOptimizableSrc(resolved);
    const effectiveAlt = !alt || alt.trim().length < 5 ? generateImageAltText({ customAlt: alt }) : alt;

    return (
        <Image
            src={resolved}
            alt={ariaHidden ? '' : effectiveAlt}
            title={title ?? effectiveAlt}
            fill={fill}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
            decoding="async"
            quality={quality ?? (priority ? 60 : 75)}
            sizes={sizes ?? (fill ? '(max-width: 768px) 100vw, 33vw' : undefined)}
            className={className}
            style={style}
            unoptimized={unoptimized}
            onLoad={onLoad}
            onError={() => {
                setFailed(true);
                onError?.();
            }}
            aria-hidden={ariaHidden || undefined}
        />
    );
}

