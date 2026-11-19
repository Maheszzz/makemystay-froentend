import { ArrowRight } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { HomeInventorySummary } from '@/lib/homePageData';
import { Link } from '@/lib/navigation';

interface HomeIntroProps {
    summary?: HomeInventorySummary;
}

export function HomeIntro({ summary }: HomeIntroProps) {
    const mosaicPhotos = summary?.mosaicPhotos ?? [];
    const hasMosaic = mosaicPhotos.length >= 4;

    const liveNumbers = [
        summary && summary.totalListings > 0
            ? { label: 'Verified listings in Bangalore', value: summary.totalListings }
            : null,
        summary && summary.pgCount > 0
            ? { label: 'PGs & coliving', value: summary.pgCount }
            : null,
        summary && summary.flatCount > 0
            ? { label: 'Flats for rent', value: summary.flatCount }
            : null,
        summary && summary.areaCount > 0
            ? { label: 'Bangalore areas', value: summary.areaCount }
            : null,
    ].filter((item): item is { label: string; value: number } => item !== null);

    return (
        <section id="about-us" className="bg-white border-t border-line py-12 md:py-20">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`grid grid-cols-1 gap-8 lg:gap-12 items-center ${
                        hasMosaic ? 'lg:grid-cols-12' : ''
                    }`}
                >
                    <div className={hasMosaic ? 'lg:col-span-6 min-w-0' : 'max-w-[66ch]'}>
                        <h2 className="font-heading font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-[1.15] tracking-[-0.015em] text-ink">
                            Verified homes across Bangalore, without broker guesswork
                        </h2>
                        <p className="mt-4 text-base md:text-[17px] leading-[1.7] text-slate max-w-[56ch]">
                            MakeMyStay.ai helps renters compare verified PGs, coliving spaces, and flats
                            across Bangalore with real property photos and upfront pricing. Explore live
                            listings, book visits directly, and shortlist homes without endless broker
                            follow-ups.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/about"
                                className="min-h-[44px] inline-flex items-center gap-2 text-sm md:text-base font-semibold text-red hover:text-red-hover hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                            >
                                <span>Read our story</span>
                                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>

                    {hasMosaic && (
                        <div className="lg:col-span-6">
                            <div className="grid grid-cols-2 gap-3">
                                {mosaicPhotos.slice(0, 4).map((photo) => (
                                    <Link
                                        key={photo.url}
                                        to={photo.href}
                                        aria-label={photo.alt}
                                        className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-line bg-blush-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                                    >
                                        <OptimizedImage
                                            src={photo.url}
                                            alt={photo.alt}
                                            fill
                                            placeholder="blur"
                                            size="medium"
                                            sizes="(max-width: 1024px) 45vw, 280px"
                                            className="object-cover"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {liveNumbers.length > 0 && (
                    <dl className="mt-10 md:mt-12 pt-8 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {liveNumbers.map((item) => (
                            <div key={item.label}>
                                <dd className="font-heading font-bold text-3xl md:text-4xl text-red tabular-nums">
                                    {item.value.toLocaleString('en-IN')}
                                </dd>
                                <dt className="mt-1 text-sm font-medium text-slate">{item.label}</dt>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </section>
    );
}
