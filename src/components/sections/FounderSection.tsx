import Image from 'next/image';
import { Linkedin } from 'lucide-react';
import { FOUNDER_PROFILE } from '@/data/team';

interface FounderSectionProps {
    bgClass?: string;
}

export function FounderSection({ bgClass = 'bg-page' }: FounderSectionProps) {
    const hasPhoto = Boolean(FOUNDER_PROFILE.photoSrc);

    return (
        <section
            aria-labelledby="founder-heading"
            className={`${bgClass} border-t border-line py-12 md:py-20`}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
                    <div className="md:col-span-4">
                        <h2
                            id="founder-heading"
                            className="font-heading font-bold text-[28px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] text-ink"
                        >
                            Our founder
                        </h2>

                        {hasPhoto && FOUNDER_PROFILE.photoSrc && (
                            <div className="mt-5 relative w-32 h-32 rounded-[14px] overflow-hidden border border-line bg-blush-100">
                                <Image
                                    src={FOUNDER_PROFILE.photoSrc}
                                    alt={FOUNDER_PROFILE.name}
                                    fill
                                    loading="lazy"
                                    sizes="128px"
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="mt-4">
                            <p className="text-lg font-bold text-ink">{FOUNDER_PROFILE.name}</p>
                            <p className="text-sm font-medium text-red mt-0.5">
                                {FOUNDER_PROFILE.role}
                            </p>
                            {FOUNDER_PROFILE.linkedinUrl && (
                                <a
                                    href={FOUNDER_PROFILE.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold text-red hover:text-red-hover hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                                >
                                    <Linkedin className="w-4 h-4 shrink-0" aria-hidden="true" />
                                    <span>LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-8 max-w-[62ch]">
                        <p className="text-base md:text-[17px] leading-[1.7] text-slate">
                            {FOUNDER_PROFILE.bio}
                        </p>
                        {FOUNDER_PROFILE.quote && (
                            <blockquote className="mt-5 pl-4 border-l-2 border-red text-ink text-base italic leading-relaxed">
                                &ldquo;{FOUNDER_PROFILE.quote}&rdquo;
                            </blockquote>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
