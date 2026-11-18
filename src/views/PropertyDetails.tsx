'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    ArrowUpDown,
    Bath,
    Bed,
    Car,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    Heart,
    MapPin,
    Maximize2,
    Share2,
    Sofa,
    Video,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PgLocalityHubTeaser } from '@/components/seo/PgLocalityHubTeaser';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyBookingCard, type SharingPriceRow } from '@/components/property/PropertyBookingCard';
import { PropertyMobileBar } from '@/components/property/PropertyMobileBar';
import { SimilarPropertiesSection } from '@/components/property/SimilarPropertiesSection';
import type { ServiceFeeOption } from '@/components/modals/ServiceFeeModal';
import { useWishlist } from '@/context/WishlistContext';
import { findPgLocationForArea } from '@/data/pgLocations';
import { usePropertyFromRoute, useSmartBack } from '@/hooks';
import { getAmenityIcon } from '@/lib/amenityIcons';
import { paymentApi } from '@/lib/api';
import { brandLogoUrl } from '@/lib/brand';
import { getRazorpayKeyId } from '@/lib/env';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { Link, useLocation, useParams } from '@/lib/navigation';
import { enterPdpSticky } from '@/lib/pdpStickyState';
import { buildPropertyPdpFaqs } from '@/lib/propertyClientSeoNarrative';
import { buildPropertySeoHeading } from '@/lib/propertyDetailCopy';
import { dedupePropertyFeatures, normalizeFeatureKey } from '@/lib/propertyFeatures';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import { buildPropertyDetailGraph } from '@/lib/schema';
import {
    buildPageSEO,
    interimPropertyDetailSeo,
    propertyDetailPageSeo,
    propertyErrorSeo,
    propertyUnavailableSeo,
} from '@/lib/seo';
import { SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';

const ServiceFeeModal = dynamic(
    () => import('@/components/modals/ServiceFeeModal').then((m) => m.ServiceFeeModal),
    { ssr: false },
);
const ReviewSection = dynamic(
    () => import('@/components/property/ReviewSection').then((m) => m.ReviewSection),
    { ssr: false },
);
const PaymentSuccessModal = dynamic(
    () => import('@/components/modals/PaymentSuccessModal').then((m) => m.PaymentSuccessModal),
    { ssr: false },
);
const LeadCaptureModal = dynamic(
    () => import('@/components/modals/LeadCaptureModal').then((m) => m.LeadCaptureModal),
    { ssr: false },
);
const SafetyPopup = dynamic(
    () => import('@/components/modals/SafetyPopup').then((m) => m.SafetyPopup),
    { ssr: false },
);

type PropertyDetailsProps = {
    /** SSR-hydrated listing from the server page. */
    initialProperty?: Property;
    /** SSR-hydrated similar listings. */
    initialSimilar?: Property[];
    slug?: string;
};

function formatFurnishingLabel(raw?: string): string | null {
    if (!raw || !raw.trim()) return null;
    const cleaned = raw.trim().replace(/_/g, ' ').toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function formatVerifiedDate(raw?: string | null): string | null {
    if (!raw) return null;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getYouTubeEmbedUrl(inputUrl: string): string | null {
    if (!inputUrl || typeof inputUrl !== 'string') return null;
    let url = inputUrl.trim();
    const iframeSrcMatch = url.match(/src=["'](.*?)["']/);
    if (iframeSrcMatch) url = iframeSrcMatch[1];
    const regExp =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|watch|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = url.match(regExp);
    if (match?.[1]) {
        return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
    if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
        return url;
    }
    return null;
}

export default function PropertyDetails({
    initialProperty,
    initialSimilar,
    slug: slugProp,
}: PropertyDetailsProps = {}) {
    const { slug: slugFromParams } = useParams<{ slug: string }>();
    const slugParam = slugProp ?? slugFromParams;
    const location = useLocation();
    const goBack = useSmartBack({ fallback: '/properties' });
    const { property, loading, error, refetch } = usePropertyFromRoute(
        slugParam,
        location.pathname,
        initialProperty,
    );
    const { isWishlisted, toggleWishlist } = useWishlist();

    const [showServiceFeeModal, setShowServiceFeeModal] = useState(false);
    const [isSafetyPopupOpen, setIsSafetyPopupOpen] = useState(false);
    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('');
    const [shareCopied, setShareCopied] = useState(false);
    const [successData, setSuccessData] = useState<{
        isOpen: boolean;
        paymentId: string;
        amount: number;
        receiptUrl: string;
    }>({
        isOpen: false,
        paymentId: '',
        amount: 0,
        receiptUrl: '',
    });

    const [leadModal, setLeadModal] = useState<{
        isOpen: boolean;
        title: string;
        subtitle: string;
        source: string;
        actionLabel: string;
        initialMessage?: string;
    }>({
        isOpen: false,
        title: '',
        subtitle: '',
        source: '',
        actionLabel: 'Send request',
    });

    // Coordinate with global MobileBottomCTA / WhatsAppWidget so they never overlap PDP mobile bar.
    useEffect(() => {
        return enterPdpSticky();
    }, []);

    const wishlisted = property ? isWishlisted(String(property.id)) : false;
    const isPG = property?.type === 'PG' || property?.type === 'Hostel' || property?.category === 'pg';
    const isPlot = property?.type === 'Plot' || property?.category === 'plot';
    const pgLoc = findPgLocationForArea(property?.location);
    const displayTitle = useMemo(() => formatPropertyTitle(property?.title), [property?.title]);
    const canonicalDetailPath = property
        ? getPropertyDetailPath(property)
        : slugParam
          ? `/pg/${slugParam}`
          : '/pg';

    const detailHelmet = useMemo(() => {
        if (!property) return null;
        if (property.is_available === false) {
            return buildPageSEO(propertyUnavailableSeo(canonicalDetailPath, property.location));
        }
        return buildPageSEO(propertyDetailPageSeo(property, canonicalDetailPath));
    }, [property, canonicalDetailPath]);

    const interimHelmet = useMemo(
        () => buildPageSEO(interimPropertyDetailSeo(slugParam, location.pathname)),
        [slugParam, location.pathname],
    );
    const errorHelmet = useMemo(() => buildPageSEO(propertyErrorSeo(location.pathname)), [location.pathname]);
    const detailJsonLd = useMemo(() => {
        if (!property) return null;
        return buildPropertyDetailGraph(property, canonicalDetailPath, undefined, buildPropertyPdpFaqs(property));
    }, [property, canonicalDetailPath]);

    const ratingSummary = getQualifiedRatingSummary(property, { requireReviewsList: true });

    const primaryBrochureOrDriveLink = useMemo(() => {
        if (!property) return null;
        const salesKit = (property as any)?.metadata?.sales_kit || {};
        const metaObj = (property as any)?.metadata || {};
        const firstDoc =
            Array.isArray(property.documents) && property.documents.length > 0
                ? property.documents[0]?.document_url
                : null;
        return (
            salesKit.drive_link ||
            salesKit.brochure ||
            metaObj.drive_link ||
            metaObj.brochure_url ||
            salesKit.pricing ||
            salesKit.album ||
            salesKit.wap ||
            firstDoc ||
            null
        );
    }, [property]);

    const handleWishlistToggle = () => {
        if (property) toggleWishlist(property);
    };

    const handleShare = async () => {
        if (!property) return;
        const productionUrl = `${SITE_URL}${canonicalDetailPath}`;
        const shareData = {
            title: displayTitle || property.title,
            text: `${displayTitle || property.title} in ${property.location}`,
            url: productionUrl,
        };
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // User cancelled or share unsupported; fall back to clipboard
            }
        }
        try {
            await navigator.clipboard.writeText(productionUrl);
            setShareCopied(true);
            window.setTimeout(() => setShareCopied(false), 2000);
        } catch {
            // Ignore clipboard permission denial
        }
    };

    const handleBookVisitOpen = () => {
        const visitSummary = [visitDate, visitTime].filter(Boolean).join(' at ');
        setLeadModal({
            isOpen: true,
            title: 'Book a visit',
            subtitle: `Schedule a walkthrough for ${displayTitle || property?.title || 'this property'}.`,
            source: 'Property Details - Book a Visit',
            actionLabel: 'Request visit',
            initialMessage: visitSummary ? `Preferred visit slot: ${visitSummary}` : '',
        });
    };

    const handlePayNow = () => setIsSafetyPopupOpen(true);

    const handleSafetyConfirm = () => {
        setIsSafetyPopupOpen(false);
        setShowServiceFeeModal(true);
    };

    const loadRazorpay = () =>
        new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleServiceFeeProceed = async (option: ServiceFeeOption) => {
        setShowServiceFeeModal(false);
        try {
            setIsPaymentProcessing(true);
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Please check your connection.');
                setIsPaymentProcessing(false);
                return;
            }
            const key = getRazorpayKeyId();
            if (!key) {
                alert('Payment configuration missing. Please contact support.');
                setIsPaymentProcessing(false);
                return;
            }
            const order = await paymentApi.createOrder({
                amount: option.amount * 100,
                currency: 'INR',
                payment_type: 'booking',
                payer_name: 'Guest User',
                payer_email: 'guest@example.com',
                payer_phone: '9999999999',
            });
            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: 'MakeMyStay',
                description: `Booking Fee - ${option.label}`,
                image: brandLogoUrl(),
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verification = await paymentApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        const pId = verification.payment_id || response.razorpay_payment_id;
                        setSuccessData({
                            isOpen: true,
                            paymentId: pId,
                            amount: option.amount,
                            receiptUrl: paymentApi.getReceiptUrl(pId),
                        });
                    } catch {
                        alert('Payment verification failed. Please contact support.');
                    } finally {
                        setIsPaymentProcessing(false);
                    }
                },
                prefill: { name: 'Guest User', email: 'guest@example.com', contact: '9999999999' },
                theme: { color: '#16181D' },
                modal: { ondismiss: () => setIsPaymentProcessing(false) },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                alert(`Payment Failed: ${response.error.description}`);
                setIsPaymentProcessing(false);
            });
            rzp.open();
        } catch (err: any) {
            const msg = err?.message || 'Unknown error';
            const detail = err?.detail || '';
            const suffix = detail && detail !== msg ? ` ${detail}` : '';
            alert(`Payment Initialization Failed: ${msg}${suffix}`);
            setIsPaymentProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-pdp-bg min-h-screen font-sans flex flex-col text-pdp-ink">
                <SEOHead {...interimHelmet} />
                <Navbar city={property?.city} />
                <main className="flex-grow flex items-center justify-center pt-24">
                    <LoadingSpinner message="Loading property details..." />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="bg-pdp-bg min-h-screen font-sans flex flex-col text-pdp-ink">
                <SEOHead {...errorHelmet} />
                <Navbar city={property?.city} />
                <main className="flex-grow flex flex-col items-center justify-center py-12 text-center w-full px-4 pt-28">
                    <div className="max-w-md w-full bg-pdp-surface p-8 rounded-[var(--radius-pdp)] border border-pdp-border">
                        <ErrorMessage
                            message={error?.message || 'Property not found'}
                            detail={
                                error?.detail ||
                                "The property you're looking for doesn't exist or could not be loaded."
                            }
                            onRetry={refetch}
                        />
                        <div className="mt-6 flex justify-center">
                            <Link to="/properties">
                                <Button variant="primary">Back to listings</Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Build gallery images
    const allImages: string[] = [];
    if (Array.isArray(property.images) && property.images.length > 0) {
        const sortedImages = [...property.images].sort((a: any, b: any) => {
            const aPrimary = a && typeof a === 'object' && (a.is_primary || a.isPrimary || a.is_cover) ? 1 : 0;
            const bPrimary = b && typeof b === 'object' && (b.is_primary || b.isPrimary || b.is_cover) ? 1 : 0;
            return bPrimary - aPrimary;
        });
        sortedImages.forEach((img: any) => {
            const url = typeof img === 'string' ? img : img?.image_url || img?.url || img?.src;
            if (url && !allImages.includes(url)) allImages.push(url);
        });
    } else if (property.image) {
        allImages.push(property.image);
    }

    // Videos from real fields only
    const meta = (() => {
        const m = (property as any).metadata || (property as any).metadata_json;
        if (typeof m === 'string') {
            try {
                return JSON.parse(m);
            } catch {
                return {};
            }
        }
        return m || {};
    })();

    const allVideos: { title: string; url: string; is_short?: boolean }[] = [];
    const pushVideo = (title: string, url: string, is_short?: boolean) => {
        if (!url || typeof url !== 'string') return;
        if (!allVideos.some((v) => v.url === url)) {
            allVideos.push({ title: title || 'Property walkthrough', url, is_short });
        }
    };
    if (Array.isArray(property.videos)) {
        property.videos.forEach((v: any) => {
            const url = typeof v === 'string' ? v : v?.video_url || v?.url;
            if (url) pushVideo(v.title || 'Video tour', url, v.is_short);
        });
    }
    if (Array.isArray(meta.youtube_videos)) {
        meta.youtube_videos.forEach((v: any) => {
            if (v?.url) pushVideo(v.title || 'Video visit', v.url, v.is_short);
        });
    }
    if (meta.youtube_url) pushVideo('Video walkthrough', meta.youtube_url);
    if (meta.video_url) pushVideo('Video tour', meta.video_url);
    if (meta.property_walkthrough) pushVideo('Property walkthrough', meta.property_walkthrough);

    // Real amenities (no hardcoded PG defaults)
    const rawDisplayFeatures: string[] = Array.isArray(property.features) ? [...property.features] : [];
    if (property.wifi) rawDisplayFeatures.push('High-speed WiFi');
    if (property.food) rawDisplayFeatures.push('Food available');
    if (property.housekeeping) rawDisplayFeatures.push('Housekeeping');
    if (property.power_backup) rawDisplayFeatures.push('Power backup');
    if (property.parking) rawDisplayFeatures.push('Parking');
    if (property.lift) rawDisplayFeatures.push('Lift');
    if (property.cctv) rawDisplayFeatures.push('CCTV security');
    if (property.washing_machine) rawDisplayFeatures.push('Washing machine');
    if (property.geyser) rawDisplayFeatures.push('Geyser');
    if (property.gym) rawDisplayFeatures.push('Gym');
    const displayFeatures = dedupePropertyFeatures(rawDisplayFeatures);

    // Real description & backend seo_about only
    const aboutNarrative = property.description?.trim() || '';
    const longSeo = property.seo_about?.trim() || '';
    const aboutWordCount = aboutNarrative
        ? aboutNarrative.split(/\s+/).filter((w) => w.length > 0).length
        : 0;
    const showAboutToggle = aboutWordCount > 200;

    // Key facts row from real fields only (hide missing items)
    const keyFacts: { label: string; icon: typeof Bed }[] = [];
    if (!isPG && !isPlot && property.beds > 0) {
        keyFacts.push({
            label: `${property.beds} ${property.beds === 1 ? 'bedroom' : 'bedrooms'}`,
            icon: Bed,
        });
    }
    if (!isPG && !isPlot && property.baths > 0) {
        keyFacts.push({
            label: `${property.baths} ${property.baths === 1 ? 'bathroom' : 'bathrooms'}`,
            icon: Bath,
        });
    }
    if (typeof property.area === 'number' && property.area > 0) {
        keyFacts.push({
            label: `${property.area.toLocaleString('en-IN')} sq ft`,
            icon: Maximize2,
        });
    }
    const furnishingLabel = formatFurnishingLabel(property.furnishing);
    if (furnishingLabel) {
        keyFacts.push({ label: furnishingLabel, icon: Sofa });
    }
    if (property.lift === true) {
        keyFacts.push({ label: 'Lift available', icon: ArrowUpDown });
    }
    if (property.parking === true) {
        keyFacts.push({ label: 'Parking available', icon: Car });
    }

    // Pricing, sharing, deposit & verification
    const isMonthlyListing = property.category === 'pg' || property.category === 'rent' || isPG;
    const hasNumericPrice = Boolean(property.price && !/request|negotiable/i.test(property.price));
    const sharingRows: SharingPriceRow[] = [
        { label: 'Single sharing', price: property.single_price },
        { label: 'Double sharing', price: property.double_price },
        { label: 'Triple sharing', price: property.triple_price },
        { label: 'Private room', price: property.private_price },
    ].filter((row): row is SharingPriceRow => typeof row.price === 'number' && row.price > 0);

    const lastVerifiedLabel = formatVerifiedDate(property.last_verified_at);

    const availabilityText =
        property.is_available === false
            ? 'Currently booked'
            : typeof property.units_remaining === 'number' && property.units_remaining > 0
              ? `${property.units_remaining} ${property.units_remaining === 1 ? 'unit' : 'units'} available`
              : 'Available';

    const depositDisplay = (() => {
        if (
            property.deposit_amount !== null &&
            property.deposit_amount !== undefined &&
            property.deposit_amount !== ''
        ) {
            return typeof property.deposit_amount === 'number'
                ? `₹${property.deposit_amount.toLocaleString('en-IN')}`
                : String(property.deposit_amount);
        }
        return 'Ask for deposit details';
    })();

    const hasPolicyDetails =
        Boolean(property.gender) ||
        (property.notice_period_days !== null && property.notice_period_days !== undefined) ||
        Boolean(property.house_rules && property.house_rules.length > 0) ||
        Boolean(property.food_menu);

    const visitNote = [visitDate, visitTime].filter(Boolean).join(' at ');

    const seoHeading = buildPropertySeoHeading(property);
    const propertyCity = property.city || 'Bangalore';
    const crumbLabel = seoHeading.trim();
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        ...(isPG
            ? [
                  { name: `PG in ${propertyCity}`, path: `/pg/${propertyCity.toLowerCase()}` },
                  ...(pgLoc ? [{ name: `PG in ${pgLoc.name}`, path: `/pg/${pgLoc.slug}` }] : []),
              ]
            : [{ name: 'Listings', path: '/properties' }]),
        { name: crumbLabel.length > 72 ? `${crumbLabel.slice(0, 71)}…` : crumbLabel },
    ];

    const nearbyPlaces = Array.isArray(property.nearby_places) ? property.nearby_places : [];
    const mapsHref =
        property.map_link ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${property.location || ''}, ${property.city || 'Bangalore, India'}`,
        )}`;
    const mapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
        `${property.location || ''}, ${property.city || 'Bangalore, India'}`,
    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

    return (
        <Fragment>
            {detailHelmet && (
                <SEOHead
                    title={detailHelmet.title}
                    description={detailHelmet.description}
                    keywords={detailHelmet.keywords}
                    canonicalHref={detailHelmet.canonicalHref}
                    ogImage={detailHelmet.ogImage}
                    noindex={detailHelmet.noindex}
                    ogType="article"
                />
            )}
            {detailJsonLd && <JsonLd data={detailJsonLd} id="property-detail-schema" />}

            <div className="min-h-screen font-sans flex flex-col bg-pdp-bg text-pdp-ink overflow-x-clip">
                <Navbar city={property.city} />

                <main id="main-content" className="flex-grow pt-20 sm:pt-24 pb-24 lg:pb-16">
                    {property.is_available === false && (
                        <div
                            role="status"
                            data-testid="property-unavailable-banner"
                            className="bg-amber-50 border-b border-amber-200 py-3.5 px-4 sm:px-6 lg:px-8 mb-4"
                        >
                            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <p className="text-sm text-amber-900">
                                    This listing in {property.location || 'Bangalore'} is currently booked.
                                </p>
                                <Link
                                    to={pgLoc ? `/pg/${pgLoc.slug}` : '/properties'}
                                    className="min-h-[44px] inline-flex items-center px-4 py-2 rounded-[10px] bg-amber-900 text-white text-sm font-medium hover:bg-amber-800 shrink-0"
                                >
                                    {pgLoc ? `Browse stays in ${pgLoc.name}` : 'Browse available listings'}
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Top Action Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                            <button
                                type="button"
                                onClick={goBack}
                                className="min-h-[44px] inline-flex items-center gap-2 px-2 -ml-2 text-sm font-medium text-pdp-ink hover:text-pdp-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded-lg cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
                                <span>Back to listings</span>
                            </button>

                            <div className="flex items-center gap-2">
                                {primaryBrochureOrDriveLink && (
                                    <a
                                        href={primaryBrochureOrDriveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="min-h-[44px] inline-flex items-center gap-1.5 px-3 text-sm text-pdp-muted hover:text-pdp-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded-lg"
                                    >
                                        <Download className="w-4 h-4 shrink-0" aria-hidden />
                                        <span>Download brochure</span>
                                    </a>
                                )}

                                <button
                                    type="button"
                                    onClick={handleShare}
                                    aria-label={shareCopied ? 'Link copied' : 'Share property'}
                                    title={shareCopied ? 'Link copied' : 'Share property'}
                                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full border border-pdp-border bg-pdp-surface text-pdp-ink hover:bg-pdp-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer"
                                >
                                    <Share2 className="w-4 h-4" aria-hidden />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleWishlistToggle}
                                    aria-label={
                                        wishlisted
                                            ? `Remove ${displayTitle} from saved properties`
                                            : `Save ${displayTitle} to wishlist`
                                    }
                                    aria-pressed={wishlisted}
                                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full border border-pdp-border bg-pdp-surface text-pdp-ink hover:bg-pdp-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer"
                                >
                                    <Heart
                                        className={`w-4 h-4 ${wishlisted ? 'fill-pdp-cta text-pdp-cta' : ''}`}
                                        aria-hidden
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Two-Column Aligned Desktop Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            {/* Left Column */}
                            <div className="lg:col-span-7 xl:col-span-8 min-w-0">
                                {/* Gallery */}
                                <PropertyGallery
                                    images={allImages}
                                    title={displayTitle || property.title}
                                    location={property.location || 'Bangalore'}
                                />

                                {/* Title, Area & Verification Line */}
                                <header className="pt-6 pb-6 border-b border-pdp-border">
                                    <h1
                                        data-seo="pdp-h1"
                                        title={displayTitle || property.title}
                                        className="font-[var(--font-serif-display)] text-[32px] sm:text-[40px] lg:text-[44px] font-normal leading-[1.15] tracking-tight text-pdp-ink line-clamp-2 break-words"
                                    >
                                        {displayTitle || property.title}
                                    </h1>

                                    {property.location && (
                                        <p className="mt-2 text-base text-pdp-muted break-words">
                                            {property.location}
                                        </p>
                                    )}

                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                        {lastVerifiedLabel && (
                                            <span className="inline-flex items-center gap-1.5 font-medium text-pdp-verified">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden />
                                                Verified by our team on {lastVerifiedLabel}
                                            </span>
                                        )}
                                        <span className="text-pdp-muted">{availabilityText}</span>
                                    </div>
                                </header>

                                {/* Key Facts Row (real fields only) */}
                                {keyFacts.length > 0 && (
                                    <section
                                        aria-label="Key property facts"
                                        className="py-6 border-b border-pdp-border"
                                    >
                                        <ul className="flex flex-wrap gap-x-6 gap-y-3">
                                            {keyFacts.map((fact) => {
                                                const Icon = fact.icon;
                                                return (
                                                    <li
                                                        key={fact.label}
                                                        className="inline-flex items-center gap-2 text-[15px] text-pdp-ink"
                                                    >
                                                        <Icon className="w-4 h-4 text-pdp-muted shrink-0" aria-hidden />
                                                        <span>{fact.label}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </section>
                                )}

                                {/* Mobile Booking Card (below key facts) */}
                                <div className="lg:hidden py-6 border-b border-pdp-border">
                                    <PropertyBookingCard
                                        property={property}
                                        displayTitle={displayTitle || property.title}
                                        canonicalPath={canonicalDetailPath}
                                        isMonthly={isMonthlyListing}
                                        hasNumericPrice={hasNumericPrice}
                                        depositDisplay={depositDisplay}
                                        sharingRows={sharingRows}
                                        visitDate={visitDate}
                                        onVisitDateChange={setVisitDate}
                                        visitTime={visitTime}
                                        onVisitTimeChange={setVisitTime}
                                        onBookVisit={handleBookVisitOpen}
                                        onPayToken={handlePayNow}
                                        isPaymentProcessing={isPaymentProcessing}
                                    />
                                </div>

                                {/* About (property.description only; hidden if empty) */}
                                {aboutNarrative.length > 0 && (
                                    <section className="py-8 border-b border-pdp-border">
                                        <h2 className="text-xl font-semibold text-pdp-ink mb-4">
                                            About this property
                                        </h2>
                                        <div
                                            data-seo="pdp-about"
                                            className={`max-w-[70ch] text-base leading-[1.7] text-pdp-ink space-y-4 ${
                                                !aboutExpanded && showAboutToggle ? 'max-h-[260px] overflow-hidden' : ''
                                            }`}
                                        >
                                            {aboutNarrative.split(/\n\n+/).map((block, bi) => (
                                                <p key={bi} className="whitespace-pre-line">
                                                    {block}
                                                </p>
                                            ))}
                                        </div>
                                        {showAboutToggle && (
                                            <button
                                                type="button"
                                                onClick={() => setAboutExpanded((v) => !v)}
                                                className="mt-4 min-h-[44px] inline-flex items-center text-sm font-medium text-pdp-ink underline underline-offset-4 hover:text-pdp-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded cursor-pointer"
                                            >
                                                {aboutExpanded ? 'Show less' : 'Read full description'}
                                            </button>
                                        )}
                                    </section>
                                )}

                                {/* Amenities (real deduped features only) */}
                                {displayFeatures.length > 0 && (
                                    <section className="py-8 border-b border-pdp-border">
                                        <h2 className="text-xl font-semibold text-pdp-ink mb-5">Amenities</h2>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3.5">
                                            {displayFeatures.map((feature) => {
                                                const lookupKey = normalizeFeatureKey(feature);
                                                const icon = getAmenityIcon(lookupKey);
                                                return (
                                                    <li
                                                        key={lookupKey}
                                                        className="flex items-center gap-3 text-[15px] text-pdp-ink"
                                                    >
                                                        <span className="text-pdp-muted shrink-0" aria-hidden>
                                                            {icon}
                                                        </span>
                                                        <span>{feature}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </section>
                                )}

                                {/* Price by Sharing Table */}
                                {sharingRows.length > 0 && (
                                    <section className="py-8 border-b border-pdp-border">
                                        <h2 className="text-xl font-semibold text-pdp-ink mb-5">
                                            Price by sharing
                                        </h2>
                                        <div className="max-w-xl overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-pdp-border text-sm text-pdp-muted">
                                                        <th className="py-3 pr-4 font-medium">Room type</th>
                                                        <th className="py-3 pl-4 font-medium text-right">
                                                            Monthly rent
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-pdp-border">
                                                    {sharingRows.map((row) => (
                                                        <tr key={row.label} className="text-[15px]">
                                                            <td className="py-3.5 pr-4 text-pdp-ink">
                                                                {row.label}
                                                            </td>
                                                            <td className="py-3.5 pl-4 font-medium text-pdp-ink text-right tabular-nums">
                                                                ₹{row.price.toLocaleString('en-IN')}/month
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}

                                {/* Policies, House Rules & Food Menu (hidden until populated) */}
                                {hasPolicyDetails && (
                                    <section className="py-8 border-b border-pdp-border space-y-6">
                                        <h2 className="text-xl font-semibold text-pdp-ink">
                                            Stay details &amp; house rules
                                        </h2>

                                        {(property.gender ||
                                            (property.notice_period_days !== null &&
                                                property.notice_period_days !== undefined)) && (
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                                                {property.gender && (
                                                    <div>
                                                        <dt className="text-sm text-pdp-muted">Suitable for</dt>
                                                        <dd className="text-base font-medium text-pdp-ink mt-0.5">
                                                            {property.gender}
                                                        </dd>
                                                    </div>
                                                )}
                                                {property.notice_period_days !== null &&
                                                    property.notice_period_days !== undefined && (
                                                        <div>
                                                            <dt className="text-sm text-pdp-muted">
                                                                Notice period
                                                            </dt>
                                                            <dd className="text-base font-medium text-pdp-ink mt-0.5">
                                                                {property.notice_period_days} days
                                                            </dd>
                                                        </div>
                                                    )}
                                            </dl>
                                        )}

                                        {property.house_rules && property.house_rules.length > 0 && (
                                            <div>
                                                <h3 className="text-base font-medium text-pdp-ink mb-2.5">
                                                    House rules
                                                </h3>
                                                <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-pdp-ink max-w-[70ch]">
                                                    {property.house_rules.map((rule) => (
                                                        <li key={rule}>{rule}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {property.food_menu && (
                                            <div>
                                                <h3 className="text-base font-medium text-pdp-ink mb-2.5">
                                                    Food menu
                                                </h3>
                                                {typeof property.food_menu === 'string' ? (
                                                    <p className="text-[15px] text-pdp-ink leading-relaxed max-w-[70ch] whitespace-pre-line">
                                                        {property.food_menu}
                                                    </p>
                                                ) : (
                                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                                                        {Object.entries(property.food_menu).map(([day, menu]) => (
                                                            <div
                                                                key={day}
                                                                className="py-2 border-b border-pdp-border"
                                                            >
                                                                <dt className="text-sm text-pdp-muted">{day}</dt>
                                                                <dd className="text-[15px] text-pdp-ink mt-0.5">
                                                                    {menu}
                                                                </dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                )}
                                            </div>
                                        )}
                                    </section>
                                )}

                                {/* Video Walkthrough (hidden if no videos) */}
                                {allVideos.length > 0 && (
                                    <section className="py-8 border-b border-pdp-border">
                                        <h2 className="text-xl font-semibold text-pdp-ink mb-5">
                                            Video walkthrough
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {allVideos.map((v, idx) => {
                                                const ytEmbedUrl = getYouTubeEmbedUrl(v.url);
                                                const isMp4 =
                                                    !ytEmbedUrl &&
                                                    (v.url.endsWith('.mp4') ||
                                                        v.url.endsWith('.webm') ||
                                                        v.url.includes('cloudinary') ||
                                                        v.url.includes('.mp4?'));
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`rounded-[var(--radius-pdp)] overflow-hidden border border-pdp-border bg-pdp-surface ${
                                                            allVideos.length === 1 ? 'md:col-span-2' : ''
                                                        }`}
                                                    >
                                                        <div
                                                            className={`relative w-full bg-black ${
                                                                v.is_short
                                                                    ? 'aspect-[9/16] max-w-xs mx-auto'
                                                                    : 'aspect-video'
                                                            }`}
                                                        >
                                                            {ytEmbedUrl ? (
                                                                <iframe
                                                                    src={ytEmbedUrl}
                                                                    title={v.title || `Video walkthrough ${idx + 1}`}
                                                                    className="w-full h-full border-0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            ) : isMp4 ? (
                                                                <video
                                                                    src={v.url}
                                                                    controls
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-pdp-ink">
                                                                    <Video className="w-10 h-10 mb-3" aria-hidden />
                                                                    <p className="text-sm font-medium mb-3">
                                                                        {v.title}
                                                                    </p>
                                                                    <a
                                                                        href={v.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-pdp-surface text-pdp-ink text-sm font-medium"
                                                                    >
                                                                        Watch video <ExternalLink className="w-4 h-4" />
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}

                                {/* Location & Nearby Places */}
                                <section className="py-8 border-b border-pdp-border">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                        <div>
                                            <h2 className="text-xl font-semibold text-pdp-ink">
                                                Location and nearby places
                                            </h2>
                                            {property.location && (
                                                <p className="text-sm text-pdp-muted mt-1">{property.location}</p>
                                            )}
                                        </div>
                                        <a
                                            href={mapsHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-pdp-border bg-pdp-surface text-sm font-medium text-pdp-ink hover:bg-pdp-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                                        >
                                            <MapPin className="w-4 h-4 shrink-0" aria-hidden />
                                            <span>Open in Google Maps</span>
                                        </a>
                                    </div>

                                    <div className="relative w-full h-[320px] sm:h-[380px] rounded-[var(--radius-pdp)] overflow-hidden border border-pdp-border bg-[#EAEAE5]">
                                        <iframe
                                            title={`Map showing ${displayTitle || property.title} in ${property.location || 'Bangalore'}`}
                                            src={mapsEmbedSrc}
                                            className="w-full h-full border-0"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>

                                    {nearbyPlaces.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-base font-medium text-pdp-ink mb-3">
                                                Nearby places
                                            </h3>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {nearbyPlaces.map((place, idx) => (
                                                    <li
                                                        key={place.id || `${place.name}-${idx}`}
                                                        className="py-3 px-4 rounded-[10px] border border-pdp-border bg-pdp-surface flex items-center justify-between gap-3"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-[15px] font-medium text-pdp-ink truncate">
                                                                {place.name}
                                                            </p>
                                                            <p className="text-sm text-pdp-muted flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                                                <span>{place.distance}</span>
                                                                {place.travel_time && (
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <Clock className="w-3.5 h-3.5" aria-hidden />
                                                                        {place.travel_time}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {place.map_link && (
                                                            <a
                                                                href={place.map_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label={`View ${place.name} on Google Maps`}
                                                                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-pdp-muted hover:text-pdp-ink hover:bg-pdp-bg shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                                                            >
                                                                <ExternalLink className="w-4 h-4" aria-hidden />
                                                            </a>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </section>

                                {/* Backend-authored detailed narrative (only if API provides seo_about) */}
                                {longSeo && longSeo.length > 80 && (
                                    <section className="py-8 border-b border-pdp-border">
                                        <h2 className="text-xl font-semibold text-pdp-ink mb-4">
                                            Additional details
                                        </h2>
                                        <div className="max-w-[70ch] text-base leading-[1.7] text-pdp-ink space-y-4">
                                            {longSeo
                                                .replace(/\\(#{1,6})/g, '$1')
                                                .split(/\n\n+/)
                                                .map((block, bi) => {
                                                    const trimmed = block.trim();
                                                    if (/^#{1,6}\s+/.test(trimmed)) {
                                                        const firstNewline = trimmed.indexOf('\n');
                                                        if (firstNewline === -1) {
                                                            return (
                                                                <h3 key={bi} className="text-lg font-semibold text-pdp-ink pt-2">
                                                                    {trimmed.replace(/^#{1,6}\s+/, '')}
                                                                </h3>
                                                            );
                                                        }
                                                        const headingText = trimmed
                                                            .slice(0, firstNewline)
                                                            .replace(/^#{1,6}\s+/, '');
                                                        const restText = trimmed.slice(firstNewline + 1).trim();
                                                        return (
                                                            <div key={bi} className="space-y-2">
                                                                <h3 className="text-lg font-semibold text-pdp-ink pt-2">
                                                                    {headingText}
                                                                </h3>
                                                                {restText && (
                                                                    <p className="whitespace-pre-line">{restText}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    }

                                                    const renderBold = (text: string) =>
                                                        text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                                                            part.startsWith('**') && part.endsWith('**') ? (
                                                                <strong key={i} className="font-semibold">
                                                                    {part.slice(2, -2)}
                                                                </strong>
                                                            ) : (
                                                                part
                                                            ),
                                                        );

                                                    if (trimmed.startsWith('- ')) {
                                                        return (
                                                            <ul key={bi} className="list-disc pl-5 space-y-1.5">
                                                                {trimmed
                                                                    .split('\n')
                                                                    .filter(Boolean)
                                                                    .map((line, li) => (
                                                                        <li key={li}>
                                                                            {renderBold(line.replace(/^- /, '').trim())}
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        );
                                                    }

                                                    return (
                                                        <p key={bi} className="whitespace-pre-line">
                                                            {renderBold(trimmed)}
                                                        </p>
                                                    );
                                                })}
                                        </div>
                                    </section>
                                )}

                                {/* Reviews (only shown when qualified: reviewCount >= MIN_REVIEWS_FOR_RATING) */}
                                {ratingSummary.showRating && (
                                    <section className="py-8 border-b border-pdp-border">
                                        <ReviewSection
                                            propertyId={property.id}
                                            initialReviews={property.reviews_list || []}
                                            onReviewAdded={refetch}
                                        />
                                    </section>
                                )}

                                {/* Similar Properties (hides itself if empty) */}
                                <SimilarPropertiesSection current={property} initialSimilar={initialSimilar} />

                                {/* Breadcrumbs */}
                                <div className="pt-8">
                                    <BreadcrumbNav items={breadcrumbItems} />
                                </div>
                            </div>

                            {/* Right Column: Sticky Booking Card */}
                            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 self-start">
                                <PropertyBookingCard
                                    property={property}
                                    displayTitle={displayTitle || property.title}
                                    canonicalPath={canonicalDetailPath}
                                    isMonthly={isMonthlyListing}
                                    hasNumericPrice={hasNumericPrice}
                                    depositDisplay={depositDisplay}
                                    sharingRows={sharingRows}
                                    visitDate={visitDate}
                                    onVisitDateChange={setVisitDate}
                                    visitTime={visitTime}
                                    onVisitTimeChange={setVisitTime}
                                    onBookVisit={handleBookVisitOpen}
                                    onPayToken={handlePayNow}
                                    isPaymentProcessing={isPaymentProcessing}
                                />
                            </div>
                        </div>
                    </div>

                    {isPG && pgLoc && (
                        <section className="mt-12 border-t border-pdp-border py-12">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <PgLocalityHubTeaser name={pgLoc.name} slug={pgLoc.slug} />
                            </div>
                        </section>
                    )}
                </main>

                <Footer />

                {/* Mobile Sticky Bottom Bar */}
                <PropertyMobileBar
                    property={property}
                    displayTitle={displayTitle || property.title}
                    canonicalPath={canonicalDetailPath}
                    isMonthly={isMonthlyListing}
                    hasNumericPrice={hasNumericPrice}
                    visitNote={visitNote}
                    onBookVisit={handleBookVisitOpen}
                />

                <ServiceFeeModal
                    isOpen={showServiceFeeModal}
                    onClose={() => setShowServiceFeeModal(false)}
                    onProceed={handleServiceFeeProceed}
                    propertyType={property.type}
                />

                {isPaymentProcessing && (
                    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white">
                        <LoadingSpinner size={48} className="text-white" />
                        <p className="mt-4 text-lg font-medium">Processing payment...</p>
                        <p className="text-sm text-slate-300">Please do not close this window</p>
                    </div>
                )}

                <PaymentSuccessModal
                    isOpen={successData.isOpen}
                    onClose={() => setSuccessData((prev) => ({ ...prev, isOpen: false }))}
                    paymentId={successData.paymentId}
                    amount={successData.amount}
                    receiptUrl={successData.receiptUrl}
                />

                <LeadCaptureModal
                    isOpen={leadModal.isOpen}
                    onClose={() => setLeadModal((prev) => ({ ...prev, isOpen: false }))}
                    title={leadModal.title}
                    subtitle={leadModal.subtitle}
                    source={leadModal.source}
                    actionLabel={leadModal.actionLabel}
                    propertyTitle={displayTitle || property.title}
                    propertyLocation={property.location}
                    initialMessage={leadModal.initialMessage}
                />

                <SafetyPopup isOpen={isSafetyPopupOpen} onClose={handleSafetyConfirm} />
            </div>
        </Fragment>
    );
}
