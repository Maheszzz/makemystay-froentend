'use client';

import { useEffect, useState } from 'react';

export interface PdpSectionNavItem {
    id: string;
    label: string;
}

interface PropertySectionNavProps {
    sections: PdpSectionNavItem[];
}

export function PropertySectionNav({ sections }: PropertySectionNavProps) {
    const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

    useEffect(() => {
        if (sections.length === 0) return;
        setActiveId((prev) =>
            sections.some((s) => s.id === prev) ? prev : sections[0].id,
        );
    }, [sections]);

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

    if (sections.length <= 1) {
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
            className="sticky top-[44px] sm:top-[48px] z-30 bg-pdp-bg/95 backdrop-blur-md border-b border-pdp-border"
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
                                    className={`relative min-h-[44px] py-3 pdp-type-caption font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded-sm cursor-pointer ${
                                        isActive
                                            ? 'text-pdp-ink'
                                            : 'text-pdp-muted hover:text-pdp-ink'
                                    }`}
                                >
                                    {section.label}
                                    {isActive && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 h-[2px] bg-pdp-ink rounded-full"
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
