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
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onError?: () => void;
    style?: React.CSSProperties;
};

const DEFAULT_BLUR_DATA_URL =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEwIiBmaWxsPSIjZThlOGUyIi8+PC9zdmc+';

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
    placeholder,
    blurDataURL,
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
            placeholder={placeholder}
            blurDataURL={placeholder === 'blur' ? (blurDataURL ?? DEFAULT_BLUR_DATA_URL) : undefined}
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

