'use client';

export function PropertyDetailsSkeleton() {
    return (
        <main
            aria-label="Loading property details"
            className="flex-grow pt-14 sm:pt-16 pb-24 lg:pb-16"
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Action Row Skeleton matching py-4 + min-h-[44px] */}
                <div className="flex items-center justify-between py-4">
                    <div className="h-11 w-36 rounded-lg bg-[#EAEAE5] animate-pulse" />
                    <div className="flex items-center gap-2">
                        <div className="h-11 w-11 rounded-full bg-[#EAEAE5] animate-pulse" />
                        <div className="h-11 w-11 rounded-full bg-[#EAEAE5] animate-pulse" />
                    </div>
                </div>

                {/* Two-column layout matching final heights to prevent CLS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-7 xl:col-span-8 min-w-0">
                        {/* Mobile Gallery Skeleton */}
                        <div className="md:hidden w-full aspect-[4/3] rounded-[var(--radius-pdp)] bg-[#EAEAE5] animate-pulse" />
                        {/* Desktop Mosaic Skeleton matching 480-520px height */}
                        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[480px] lg:h-[520px] rounded-[var(--radius-pdp)] overflow-hidden">
                            <div className="col-span-2 row-span-2 bg-[#EAEAE5] animate-pulse" />
                            <div className="col-span-1 row-span-1 bg-[#EAEAE5] animate-pulse" />
                            <div className="col-span-1 row-span-1 bg-[#EAEAE5] animate-pulse" />
                            <div className="col-span-1 row-span-1 bg-[#EAEAE5] animate-pulse" />
                            <div className="col-span-1 row-span-1 bg-[#EAEAE5] animate-pulse" />
                        </div>

                        {/* Title, area & verification lines */}
                        <div className="pt-8 pb-8 border-b border-pdp-border space-y-4">
                            <div className="h-12 w-3/4 rounded-lg bg-[#EAEAE5] animate-pulse" />
                            <div className="h-5 w-48 rounded-md bg-[#EAEAE5] animate-pulse" />
                            <div className="h-4 w-64 rounded-md bg-[#EAEAE5] animate-pulse" />
                        </div>

                        {/* Highlights / Key facts */}
                        <div className="py-8 border-b border-pdp-border flex flex-wrap gap-4">
                            <div className="h-12 w-40 rounded-lg bg-[#EAEAE5] animate-pulse" />
                            <div className="h-12 w-40 rounded-lg bg-[#EAEAE5] animate-pulse" />
                            <div className="h-12 w-40 rounded-lg bg-[#EAEAE5] animate-pulse" />
                        </div>

                        {/* About block */}
                        <div className="py-10 space-y-3">
                            <div className="h-7 w-48 rounded-md bg-[#EAEAE5] animate-pulse" />
                            <div className="h-4 w-full rounded bg-[#EAEAE5] animate-pulse" />
                            <div className="h-4 w-5/6 rounded bg-[#EAEAE5] animate-pulse" />
                            <div className="h-4 w-2/3 rounded bg-[#EAEAE5] animate-pulse" />
                        </div>
                    </div>

                    {/* Sticky Booking Card Skeleton */}
                    <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
                        <div className="h-[490px] rounded-[var(--radius-pdp)] border border-pdp-border bg-pdp-surface p-6 space-y-6">
                            <div className="space-y-2 pb-5 border-b border-pdp-border">
                                <div className="h-4 w-24 rounded bg-[#EAEAE5] animate-pulse" />
                                <div className="h-9 w-36 rounded bg-[#EAEAE5] animate-pulse" />
                                <div className="h-4 w-full rounded bg-[#EAEAE5] animate-pulse mt-3" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-4 w-32 rounded bg-[#EAEAE5] animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-10 w-20 rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                    <div className="h-10 w-24 rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                    <div className="h-10 w-24 rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                </div>
                                <div className="h-4 w-32 rounded bg-[#EAEAE5] animate-pulse pt-2" />
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-11 rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                    <div className="h-11 rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                    <div className="h-11 rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                    <div className="h-11 rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="h-12 w-full rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                                <div className="h-11 w-full rounded-[10px] bg-[#EAEAE5] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
