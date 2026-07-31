'use client';

import React, { useState } from 'react';
import {
    generateImageSeoMeta,
    buildImageGalleryJsonLd,
    type ImageSeoContext,
    type ImageLayoutPreset,
    type ImageSeoResult,
} from '@/lib/imageSeoEngine';
import styles from './SeoImage.module.css';

export interface SeoImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt?: string;
    title?: string;
    caption?: string;
    context?: ImageSeoContext;
    layout?: ImageLayoutPreset;
    priority?: boolean;
    width?: number;
    height?: number;
    withFigure?: boolean;
    withSchema?: boolean;
    showVerifiedBadge?: boolean;
    customSizes?: string;
    customWidths?: number[];
    figureClassName?: string;
    captionClassName?: string;
}

/**
 * Enterprise-grade SEO Image Component.
 * Automatically generates alt text, title tooltip, figure caption, responsive srcSet/sizes,
 * native lazy loading/fetchpriority, and optional Schema.org ImageObject structured data.
 */
export function SeoImage({
    src,
    alt: altOverride,
    title: titleOverride,
    caption: captionOverride,
    context = {},
    layout = 'card',
    priority = false,
    width,
    height,
    withFigure = true,
    withSchema = false,
    showVerifiedBadge = false,
    customSizes,
    customWidths,
    figureClassName = '',
    captionClassName = '',
    className = '',
    style,
    onLoad,
    onError,
    ...rest
}: SeoImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const mergedContext: ImageSeoContext = {
        ...context,
        customAlt: altOverride || context.customAlt,
        customTitle: titleOverride || context.customTitle,
        customCaption: captionOverride || context.customCaption,
    };

    const seoMeta: ImageSeoResult = generateImageSeoMeta({
        url: src,
        context: mergedContext,
        layout,
        priority,
        width,
        height,
        customSizes,
        customWidths,
    });

    if (!src || hasError) {
        return null;
    }

    const imgElement = (
        <img
            src={seoMeta.url}
            srcSet={seoMeta.srcSet || undefined}
            sizes={seoMeta.sizes}
            alt={seoMeta.alt}
            title={seoMeta.title}
            loading={seoMeta.loading}
            decoding={seoMeta.decoding}
            fetchPriority={seoMeta.fetchPriority}
            width={width}
            height={height}
            className={`${styles.image} ${isLoaded ? styles.imageLoaded : styles.imageLoading} ${className}`}
            style={style}
            onLoad={(e) => {
                setIsLoaded(true);
                onLoad?.(e);
            }}
            onError={(e) => {
                setHasError(true);
                onError?.(e);
            }}
            {...rest}
        />
    );

    const schemaElement = withSchema ? (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(seoMeta.structuredData),
            }}
        />
    ) : null;

    if (!withFigure) {
        return (
            <>
                {schemaElement}
                {imgElement}
            </>
        );
    }

    return (
        <figure className={`${styles.figure} ${styles.figureHover} ${figureClassName}`}>
            {schemaElement}
            <div
                className={styles.imageContainer}
                style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
            >
                {imgElement}
                {(showVerifiedBadge || context.isVerified) && (
                    <span className={styles.badge} aria-label="Verified Stay">
                        <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                    </span>
                )}
            </div>
            {seoMeta.caption && (
                <figcaption className={`${styles.caption} ${captionClassName}`}>
                    <svg className={styles.captionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className={styles.captionText}>{seoMeta.caption}</span>
                </figcaption>
            )}
        </figure>
    );
}

export interface SeoImageGalleryProps {
    name: string;
    description?: string;
    images: Array<{
        src: string;
        alt?: string;
        title?: string;
        caption?: string;
        context?: ImageSeoContext;
        width?: number;
        height?: number;
    }>;
    layout?: ImageLayoutPreset;
    withSchema?: boolean;
    className?: string;
}

/**
 * Reusable SEO Image Gallery with grid layout and combined Schema.org ImageGallery JSON-LD.
 */
export function SeoImageGallery({
    name,
    description,
    images,
    layout = 'card',
    withSchema = true,
    className = '',
}: SeoImageGalleryProps) {
    if (!images || images.length === 0) return null;

    const schemaData = buildImageGalleryJsonLd(
        name,
        images.map((item) => ({
            url: item.src,
            context: item.context,
            width: item.width,
            height: item.height,
        })),
        description,
    );

    return (
        <section className={className} aria-label={name}>
            {withSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaData),
                    }}
                />
            )}
            <div className={styles.galleryGrid}>
                {images.map((img, index) => (
                    <SeoImage
                        key={`${img.src}-${index}`}
                        src={img.src}
                        alt={img.alt}
                        title={img.title}
                        caption={img.caption}
                        context={{ ...img.context, index, totalImages: images.length }}
                        layout={layout}
                        width={img.width}
                        height={img.height}
                        priority={index === 0}
                        withFigure={true}
                        withSchema={false}
                    />
                ))}
            </div>
        </section>
    );
}

export const SeoFigure = (props: SeoImageProps) => <SeoImage {...props} withFigure={true} />;
