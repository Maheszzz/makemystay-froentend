'use client';

import { useEffect, useState } from 'react';

export interface PdpSectionNavItem {
    id: string;
    label: string;
}

interface PropertySectionNavProps {
    sections: PdpSectionNavItem[];
    /** Show sticky section bar only after this gallery element leaves the viewport. */
    galleryId?: string;
}

export function PropertySectionNav({
    sections,
    galleryId = 'pdp-gallery',
}: PropertySectionNavProps) {
    const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (sections.length === 0) return;
        setActiveId((prev) =>
            sections.some((s) => s.id === prev) ? prev : sections[0].id,
        );
    }, [sections]);

    // Reveal section nav only after the gallery leaves the top of the viewport
    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;
        const galleryEl = document.getElementById(galleryId);
        if (!galleryEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const pastGallery =
                    !entry.isIntersecting && entry.boundingClientRect.top < 64;
                setIsVisible(pastGallery);
            },
            {
                rootMargin: '-48px 0px 0px 0px',
                threshold: 0,
            },
        );

        observer.observe(galleryEl);
        return () => observer.disconnect();
    }, [galleryId]);

    useEffect(() => {
        if (sections.length === 0 || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const elements = sections
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => Boolean(el));

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    );
                if (visible.length > 0 && visible[0].target.id) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: '-120px 0px -55% 0px',
                threshold: [0, 0.1],
            },
        );

        for (const el of elements) {
            observer.observe(el);
        }

        return () => observer.disconnect();
    }, [sections]);

    if (sections.length <= 1 || !isVisible) {
        return null;
    }

    const handleSelect = (id: string) => {
        setActiveId(id);
        const target = document.getElementById(id);
        if (!target) return;
        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({
            behavior: prefersReduced ? 'auto' : 'smooth',
            block: 'start',
        });
    };

    return (
        <nav
            aria-label="Property sections"
            className="fixed top-[45px] sm:top-[49px] inset-x-0 z-40 bg-white border-b border-line"
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {sections.map((section) => {
                        const isActive = activeId === section.id;
                        return (
                            <li key={section.id} className="shrink-0">
                                <button
                                    type="button"
                                    aria-current={isActive ? 'location' : undefined}
                                    onClick={() => handleSelect(section.id)}
                                    className={`relative min-h-[44px] py-3 pdp-type-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 rounded-sm cursor-pointer ${
                                        isActive
                                            ? 'text-ink font-semibold'
                                            : 'text-slate font-medium hover:text-ink'
                                    }`}
                                >
                                    {section.label}
                                    {isActive && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 h-[2px] bg-red rounded-full"
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
