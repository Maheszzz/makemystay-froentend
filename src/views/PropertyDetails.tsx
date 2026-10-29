'use client';

import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Star, Heart, ArrowLeft, Share2, MapPin, CalendarDays, ChevronLeft, ChevronRight, X, Maximize2, MessageCircle, Download, FileText, ExternalLink, Clock, Video } from 'lucide-react';
import { Link, useParams, useLocation } from '@/lib/navigation';
import { usePropertyFromRoute, useSmartBack } from '@/hooks';
import { paymentApi } from '@/lib/api';
import { formatPropertyTitle, reviewsLabel } from '@/lib/formatPropertyTitle';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPropertyDetailGraph } from '@/lib/schema';
import { buildPageSEO, interimPropertyDetailSeo, propertyDetailPageSeo, propertyErrorSeo, propertyUnavailableSeo } from '@/lib/seo';
import { SITE_URL } from '@/lib/siteConfig';

import type { ServiceFeeOption } from '@/components/modals/ServiceFeeModal';
import { useMemo, useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { getAmenityIcon } from '@/lib/amenityIcons';
import { dedupePropertyFeatures, normalizeFeatureKey } from '@/lib/propertyFeatures';
import { brandLogoUrl } from '@/lib/brand';
import { getRazorpayKeyId } from '@/lib/env';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PgLocalityHubTeaser } from '@/components/seo/PgLocalityHubTeaser';
import { PropertyQuickAnswers } from '@/components/seo/PropertyQuickAnswers';
import { FreshnessBadge } from '@/components/trust/FreshnessBadge';
import { getFreshnessBadges } from '@/lib/freshness';
import { PeopleAlsoAsk } from '@/components/seo/PeopleAlsoAsk';
import { AeoSnippet } from '@/components/seo/AeoSnippet';
import { buildPropertyHeroIntro, buildPropertySeoHeading } from '@/lib/propertyDetailCopy';
import {
    buildPropertyPdpFaqs,
    extractHeroLeadFromNarrative,
    generatePropertyLongFormContent,
} from '@/lib/propertyClientSeoNarrative';
import { findPgLocationForArea } from '@/data/pgLocations';
import type { Property } from '@/types/api';

import { SimilarPropertiesSection } from '@/components/property/SimilarPropertiesSection';

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
    /** SSR-hydrated listing from the server page (avoids empty HTML for crawlers). */
    initialProperty?: Property;
    /** SSR-hydrated similar listings. */
    initialSimilar?: Property[];
    slug?: string;
};

export default function PropertyDetails({ initialProperty, initialSimilar, slug: slugProp }: PropertyDetailsProps = {}) {
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
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [heroIdx, setHeroIdx] = useState(0);
    const [heroIsPortrait, setHeroIsPortrait] = useState(false);
    const [successData, setSuccessData] = useState<{
        isOpen: boolean; paymentId: string; amount: number; receiptUrl: string;
    }>({
        isOpen: false, paymentId: '', amount: 0, receiptUrl: ''
    });

    const [leadModal, setLeadModal] = useState<{
        isOpen: boolean;
        title: string;
        subtitle: string;
        source: string;
        actionLabel: string;
    }>({
        isOpen: false,
        title: '',
        subtitle: '',
        source: '',
        actionLabel: 'Send request',
    });

    const wishlisted = property ? isWishlisted(String(property.id)) : false;
    const isPG = property?.type === 'PG' || property?.type === 'Hostel';
    const pgLoc = findPgLocationForArea(property?.location);

    const displayTitle = useMemo(() => formatPropertyTitle(property?.title), [property?.title]);

    const canonicalDetailPath = property ? getPropertyDetailPath(property) : (slugParam ? `/pg/${slugParam}` : '/pg');

    const detailHelmet = useMemo(() => {
        if (!property) return null;
        if (property.is_available === false) {
            return buildPageSEO(propertyUnavailableSeo(canonicalDetailPath, property.location));
        }
        return buildPageSEO(propertyDetailPageSeo(property, canonicalDetailPath));
    }, [property, canonicalDetailPath]);
    const interimHelmet = useMemo(
        () => buildPageSEO(interimPropertyDetailSeo(slugParam, location.pathname)),
        [slugParam, location.pathname]
    );
    const errorHelmet = useMemo(() => buildPageSEO(propertyErrorSeo(location.pathname)), [location.pathname]);
    const detailJsonLd = useMemo(() => {
        if (!property) return null;
        return buildPropertyDetailGraph(property, canonicalDetailPath, undefined, buildPropertyPdpFaqs(property));
    }, [property, canonicalDetailPath]);

    const ratingStarsValue = property ? property.average_rating ?? property.rating ?? 0 : 0;
    const reviewLabelText = property
        ? (property.review_count ?? property.reviews ?? 0) > 0
            ? reviewsLabel(property.review_count ?? property.reviews ?? 0)
            : property.reviews_list && property.reviews_list.length > 0
              ? `${property.reviews_list.length} reviews`
              : ''
        : '';

    const freshnessBadges = useMemo(
        () =>
            property
                ? getFreshnessBadges({
                      last_verified_at: property.last_verified_at,
                      last_booked_at: property.last_booked_at,
                      last_review_at: property.last_review_at,
                      updated_at: property.updated_at,
                  })
                : [],
        [property],
    );

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (property) toggleWishlist(property);
    };

    const handleShare = async () => {
        if (!property) return;
        const productionUrl = `${SITE_URL}${canonicalDetailPath}`;
        const shareData = {
            title: displayTitle || property.title,
            text: `Check out this property: ${displayTitle || property.title} in ${property.location}`,
            url: productionUrl,
        };
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try { await navigator.share(shareData); } catch { /* user cancelled */ }
        } else {
            try {
                await navigator.clipboard.writeText(productionUrl);
            } catch { alert('Failed to copy link to clipboard.'); }
        }
    };

    const handleBack = goBack;

    const allSalesKitDocuments = useMemo(() => {
        const list: { id: string; title: string; document_type: string; url: string; file_size?: string }[] = [];
        const salesKit = (property as any)?.metadata?.sales_kit || {};
        const metaObj = (property as any)?.metadata || {};
        const masterDriveLink = salesKit.drive_link || salesKit.brochure || metaObj.drive_link || metaObj.brochure_url;

        if (masterDriveLink && typeof masterDriveLink === 'string' && masterDriveLink.trim()) {
            list.push({
                id: 'master_drive_link',
                title: 'Property Brochure & Sales Kit (Google Drive)',
                document_type: 'Complete Google Drive Folder & Brochures',
                url: masterDriveLink.trim(),
            });
        }

        const titlesMap: Record<string, { title: string; type: string }> = {
            brochure: { title: 'Brochure PDF', type: 'Full High-Resolution Property Brochure' },
            pricing: { title: 'Pricing PDF', type: 'Detailed Rate Card & Fee Breakdown' },
            album: { title: 'Photo Album PDF', type: 'Printable Photo Gallery Booklet' },
            wap: { title: 'WAP PDF', type: 'Welcome Pack & Tenant Guidelines' },
        };

        Object.keys(titlesMap).forEach((key) => {
            if (salesKit[key] && !list.some((i) => i.url === salesKit[key])) {
                list.push({
                    id: key,
                    title: titlesMap[key].title,
                    document_type: titlesMap[key].type,
                    url: salesKit[key],
                });
            }
        });

        if (property?.documents && Array.isArray(property.documents)) {
            property.documents.forEach((doc, idx) => {
                if (doc.document_url && !list.some((i) => i.url === doc.document_url)) {
                    list.push({
                        id: `doc_${idx}`,
                        title: doc.title || `Document ${idx + 1}`,
                        document_type: doc.document_type || 'PDF Document',
                        url: doc.document_url,
                        file_size: doc.file_size,
                    });
                }
            });
        }

        return list;
    }, [property]);

    const primaryBrochureOrDriveLink = useMemo(() => {
        const salesKit = (property as any)?.metadata?.sales_kit || {};
        const metaObj = (property as any)?.metadata || {};
        return (
            salesKit.drive_link ||
            salesKit.brochure ||
            metaObj.drive_link ||
            metaObj.brochure_url ||
            salesKit.pricing ||
            salesKit.album ||
            salesKit.wap ||
            (allSalesKitDocuments.length > 0 ? allSalesKitDocuments[0].url : null)
        );
    }, [property, allSalesKitDocuments]);

    const handleDownloadAllBrochures = (e: React.MouseEvent) => {
        e.preventDefault();
        const targetUrl = primaryBrochureOrDriveLink;
        if (targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else if (allSalesKitDocuments.length > 0) {
            window.open(allSalesKitDocuments[0].url, '_blank', 'noopener,noreferrer');
        } else {
            alert('The Google Drive Sales Kit / Brochure link has not been attached for this property yet. Please add your Drive link in Step 6 (Sales Kit) of the Admin Dashboard.');
        }
    };

    const handleHeroImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setHeroIsPortrait(img.naturalHeight > img.naturalWidth);
    };

    const handlePayNow = () => setIsSafetyPopupOpen(true);

    const handleSafetyConfirm = () => {
        setIsSafetyPopupOpen(false);
        setShowServiceFeeModal(true);
    };

    const loadRazorpay = () => new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handleServiceFeeProceed = async (option: ServiceFeeOption) => {
        setShowServiceFeeModal(false);
        try {
            setIsPaymentProcessing(true);
            const isLoaded = await loadRazorpay();
            if (!isLoaded) { alert("Razorpay SDK failed to load. Are you online?"); setIsPaymentProcessing(false); return; }
            const key = getRazorpayKeyId();
            if (!key) { alert("Error: Razorpay key is missing. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local."); setIsPaymentProcessing(false); return; }
            const order = await paymentApi.createOrder({ amount: option.amount * 100, currency: "INR", payment_type: "booking", payer_name: "Guest User", payer_email: "guest@example.com", payer_phone: "9999999999" });
            const options = {
                key,
                amount: order.amount, currency: order.currency,
                name: "MakeMyStay", description: `Booking Fee - ${option.label}`,
                image: brandLogoUrl(), order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verification = await paymentApi.verifyPayment({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature });
                        const pId = verification.payment_id || response.razorpay_payment_id;
                        setSuccessData({
                            isOpen: true,
                            paymentId: pId,
                            amount: option.amount,
                            receiptUrl: paymentApi.getReceiptUrl(pId)
                        });
                    } catch { alert("Payment verification failed. Please contact support."); }
                    finally { setIsPaymentProcessing(false); }
                },
                prefill: { name: "Guest User", email: "guest@example.com", contact: "9999999999" },
                theme: { color: "#0f172a" },
                modal: { ondismiss: () => setIsPaymentProcessing(false) }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', (response: any) => { alert(`Payment Failed: ${response.error.description}`); setIsPaymentProcessing(false); });
            rzp.open();
        } catch (error: any) {
            const msg = error?.message || "Unknown error";
            const detail = error?.detail || "";
            const suffix = detail && detail !== msg ? ` ${detail}` : "";
            alert(`Payment Initialization Failed: ${msg}${suffix}`);
            setIsPaymentProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
                <SEOHead 
                    title={interimHelmet.title}
                    description={interimHelmet.description}
                    keywords={interimHelmet.keywords}
                    canonicalHref={interimHelmet.canonicalHref}
                    ogImage={interimHelmet.ogImage}
                    noindex={interimHelmet.noindex}
                />
                <Navbar city={property?.city} />
                <main className="flex-grow flex items-center justify-center">
                    <LoadingSpinner message="Loading property details..." />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
                <SEOHead 
                    title={errorHelmet.title}
                    description={errorHelmet.description}
                    keywords={errorHelmet.keywords}
                    canonicalHref={errorHelmet.canonicalHref}
                    ogImage={errorHelmet.ogImage}
                    noindex={errorHelmet.noindex}
                />
                <Navbar city={property?.city} />
                <main className="flex-grow flex flex-col items-center justify-center py-12 text-center w-full px-4">
                    <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <ErrorMessage
                            message={error?.message || "Property Not Found"}
                            detail={error?.detail || "The property you're looking for doesn't exist or there was an error loading it."}
                            onRetry={refetch}
                        />
                        <div className="mt-6 flex justify-center">
                            <Link to="/properties"><Button variant="primary">Back to Listings</Button></Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Build the images list
    const allImages: string[] = [];
    if (Array.isArray(property.images) && property.images.length > 0) {
        const sortedImages = [...property.images].sort((a: any, b: any) => {
            const aPrimary = (a && typeof a === 'object' && (a.is_primary || a.isPrimary || a.is_cover)) ? 1 : 0;
            const bPrimary = (b && typeof b === 'object' && (b.is_primary || b.isPrimary || b.is_cover)) ? 1 : 0;
            return bPrimary - aPrimary;
        });

        sortedImages.forEach((img: any) => {
            const url = typeof img === 'string' ? img : img?.image_url || img?.url || img?.src;
            if (url) allImages.push(url);
        });
    } else if (property.image) {
        allImages.push(property.image);
    }

    const heroImage = allImages[heroIdx] || null;

    // Build the videos list from all possible fields (videos, metadata.youtube_videos, metadata.youtube_url, etc.)
    const allVideos: { title: string; url: string; is_short?: boolean }[] = [];
    const pushVideo = (title: string, url: string, is_short?: boolean) => {
        if (!url || typeof url !== 'string') return;
        if (!allVideos.some((v) => v.url === url)) {
            allVideos.push({ title: title || 'Property Walkthrough Video', url, is_short });
        }
    };
    if (Array.isArray(property.videos)) {
        property.videos.forEach((v: any) => {
            const url = typeof v === 'string' ? v : v?.video_url || v?.url;
            if (url) pushVideo(v.title || 'Video Tour', url, v.is_short);
        });
    }
    const meta = (() => {
        const m = (property as any).metadata || (property as any).metadata_json;
        if (typeof m === 'string') {
            try { return JSON.parse(m); } catch { return {}; }
        }
        return m || {};
    })();
    if (Array.isArray(meta.youtube_videos)) {
        meta.youtube_videos.forEach((v: any) => {
            if (v?.url) pushVideo(v.title || 'Video Visit', v.url, v.is_short);
        });
    }
    if (Array.isArray(meta.videos)) {
        meta.videos.forEach((v: any) => {
            const url = typeof v === 'string' ? v : v?.url || v?.video_url;
            if (url) pushVideo(v.title || 'Video Visit', url, v.is_short);
        });
    }
    if (meta.youtube_url) pushVideo('YouTube Walkthrough', meta.youtube_url);
    if (meta.video_url) pushVideo('Video Walkthrough', meta.video_url);
    if (meta.virtual_tour_url) pushVideo('Virtual Video Visit', meta.virtual_tour_url);
    if (meta.property_walkthrough) pushVideo('Property Walkthrough', meta.property_walkthrough);
    if (meta.drone_video) pushVideo('Drone Video Tour', meta.drone_video);
    if (meta.instagram_reel) pushVideo('Instagram Reel', meta.instagram_reel);
    if (meta.virtual_tour) pushVideo('Virtual Tour', meta.virtual_tour);
    if ((property as any).video_url) pushVideo('Property Video Tour', (property as any).video_url);

    const getYouTubeEmbedUrl = (inputUrl: string): string | null => {
        if (!inputUrl || typeof inputUrl !== 'string') return null;
        let url = inputUrl.trim();
        const iframeSrcMatch = url.match(/src=["'](.*?)["']/);
        if (iframeSrcMatch) {
            url = iframeSrcMatch[1];
        }
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
        }
        if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
            return url;
        }
        return null;
    };

    // Build display features (non-array truthy `{}` must not reach .map)
    let displayFeatures = Array.isArray(property.features) ? [...property.features] : [];
    if (isPG) {
        const standardAmenities = [
            'High-Speed WiFi',
            'Nutritious Food',
            'Daily Housekeeping',
            'Power Backup',
            '24/7 Security',
            'Washing Machine',
            'Refrigerator',
            'RO Water Purifier',
        ];
        displayFeatures = [...displayFeatures, ...standardAmenities];
    }
    displayFeatures = dedupePropertyFeatures(displayFeatures);

    // Description
    const desc = property.description && property.description.length > 50
        ? property.description
        : `Experience premium living at **${displayTitle}** in the heart of **${property.location}**. This luxury ${property.type} offers a perfect blend of comfort and convenience, designed for modern professionals and students.\n\nEnjoy a hassle-free lifestyle with top-tier amenities including high-speed WiFi, nutritious food, and daily housekeeping. The property features spacious rooms with ample natural light, ensuring a pleasant stay. Located close to major tech parks and educational institutions, it provides easy access to public transport and local markets.\n\nBook your slot today and upgrade your living experience with MakeMyStay.`;

    /** Short description shown in the "About this property" card (2-3 paragraphs max). */
    const aboutNarrative = property.description?.trim() || desc;

    /** Full SEO article moved to "Area Guide" section at the bottom of the page. */
    const longSeo = generatePropertyLongFormContent(property);

    const aboutWordCount = aboutNarrative.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const showAboutToggle = aboutWordCount > 200;

    const seoHeading = buildPropertySeoHeading(property);
    const heroLead =
        extractHeroLeadFromNarrative(longSeo, 520) || buildPropertyHeroIntro(property);
    const propertyCity = property?.city || 'Bangalore';
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

    const galleryAltBase = `${displayTitle || property.title} room in ${property.location} Bangalore with premium furnishings and clean interiors`;
    const heroAlt =
        allImages.length > 0
            ? `${galleryAltBase} — ${property.type} photo ${heroIdx + 1} of ${allImages.length}`
            : `${galleryAltBase} — ${property.type} main view`;

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
            <div className="min-h-screen font-sans flex flex-col bg-gradient-to-b from-white via-[#fbfbfd] to-slate-50">
            <Navbar city={property?.city} />

            <main id="main-content" className="pb-20 md:pb-24 flex-grow">
                {property.is_available === false && (
                    <div
                        role="status"
                        data-testid="property-unavailable-banner"
                        className="bg-amber-50 border-b border-amber-200 pt-20 pb-4 px-4 sm:px-6 lg:px-8"
                    >
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-sm sm:text-base font-bold text-amber-900">
                                    This property is no longer available
                                </p>
                                <p className="text-xs sm:text-sm text-amber-800">
                                    This listing in {property.location || 'Bangalore'} is currently rented out or paused. Browse verified similar stays below.
                                </p>
                            </div>
                            <Link
                                to={pgLoc ? `/pg/${pgLoc.slug}` : '/properties'}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 transition-colors shrink-0"
                            >
                                {pgLoc ? `Browse available PGs in ${pgLoc.name}` : 'Browse available properties'}
                            </Link>
                        </div>
                    </div>
                )}

                {/* ─── Cinematic Hero Section ─── */}
                <section className="relative bg-[#0a0a0b] overflow-hidden group">
                    <div className="absolute inset-0 z-0 relative">
                        {heroImage && (
                            <OptimizedImage
                                src={heroImage}
                                alt=""
                                fill
                                size="hero"
                                sizes="100vw"
                                ariaHidden
                                className="object-cover opacity-40 scale-105 blur-[2px] transition-all duration-[2000ms] group-hover:scale-100 group-hover:blur-0"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/80 via-transparent to-[#0a0a0b]/80" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-20 lg:pb-24">
                        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
                            
                            {/* Left: Main Image Frame */}
                            <div className="w-full lg:w-2/3 xl:w-[62%]">
                                <div className="flex items-center justify-between gap-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-all bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/10"
                                    >
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Back to properties</span>
                                    </button>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleDownloadAllBrochures}
                                            className="inline-flex items-center gap-2 bg-brand-red/90 hover:bg-brand-red text-white px-4 py-2.5 rounded-full border border-brand-red/30 hover:border-white/30 transition-all shadow-lg text-xs font-bold tracking-wide group"
                                            title="Download All 4 Sales Kit PDFs (Brochure, Pricing, Album, WAP)"
                                        >
                                            <Download className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                                            <span>Download Brochure</span>
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center shadow-lg"
                                            aria-label="Share"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleWishlistToggle}
                                            className={`w-11 h-11 rounded-full backdrop-blur-md border transition-all flex items-center justify-center shadow-lg ${wishlisted ? 'bg-brand-red border-brand-red text-white' : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'}`}
                                            aria-label="Wishlist"
                                        >
                                            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group/hero">
                                    <div className={`relative ${heroIsPortrait ? 'aspect-[3/4] max-w-md mx-auto' : 'aspect-[16/9]'}`}>
                                        <OptimizedImage
                                            key={heroIdx}
                                            src={heroImage || ''}
                                            alt={heroAlt}
                                            fill
                                            priority
                                            size="large"
                                            sizes="(max-width: 1024px) 100vw, 62vw"
                                            className="object-cover transition-transform duration-[1000ms] group-hover/hero:scale-110"
                                            onLoad={handleHeroImageLoad}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                        
                                        <div className="absolute bottom-6 right-6">
                                            <button
                                                onClick={() => setLightboxIndex(heroIdx)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-xs font-bold hover:bg-white/20 transition-all"
                                            >
                                                <Maximize2 className="w-3.5 h-3.5" />
                                                View Gallery
                                            </button>
                                        </div>

                                        {allImages.length > 1 && (
                                            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setHeroIdx(i => (i === 0 ? allImages.length - 1 : i - 1)); }}
                                                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition-all pointer-events-auto shadow-xl"
                                                >
                                                    <ChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setHeroIdx(i => (i === allImages.length - 1 ? 0 : i + 1)); }}
                                                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition-all pointer-events-auto shadow-xl"
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnails */}
                                {allImages.length > 1 && (
                                    <div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar py-2">
                                        {allImages.map((url, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setHeroIdx(idx)}
                                                className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${heroIdx === idx ? 'border-brand-red scale-105 shadow-glow' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                                                aria-label={`View photo ${idx + 1}`}
                                            >
                                                <OptimizedImage
                                                    src={url}
                                                    alt={`${displayTitle} thumbnail ${idx + 1}`}
                                                    fill
                                                    size="thumbnail"
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Property Intro Meta */}
                            <div className="w-full lg:w-1/3 xl:w-[38%] text-left">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 rounded-lg bg-brand-red text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-red/30">
                                        {property.tag || (property.is_available ? 'Verified' : 'Limited')}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        High Demand
                                    </span>
                                </div>

                                <h1 data-seo="pdp-h1" className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-6">
                                    {displayTitle}
                                </h1>

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center gap-4 text-white/60">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-brand-red/70" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Location</p>
                                            <p className="text-sm font-bold text-white/90">{property.location}</p>
                                        </div>
                                    </div>

                                    <p className="text-lg text-white/60 leading-relaxed font-medium">
                                        {heroLead}
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Investment / Rent</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-white tracking-tighter">{property.price}</span>
                                                {property.category === 'rent' && <span className="text-lg font-bold text-white/40">/mo</span>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                                                <Star className="w-4 h-4 fill-amber-400" />
                                                <span className="text-lg font-black">{ratingStarsValue.toFixed(1)}</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{reviewLabelText}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Main Content ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 lg:pt-16">
                    <div className="mb-10 space-y-4">

                        {freshnessBadges.length > 0 && <FreshnessBadge items={freshnessBadges} />}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-x-12 lg:gap-y-12 xl:gap-x-14 xl:gap-y-14 items-start">

                        {/* LEFT COLUMN: Details & Info */}
                        <div className="lg:col-span-8 space-y-12 md:space-y-14 lg:space-y-16">
                            
                            {/* Quick Overview Grid */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-8 bg-brand-red rounded-full" />
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Essential Details</h2>
                                </div>
                                <PropertyQuickAnswers property={property} />
                            </section>

                            {/* About Section */}
                            <section className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-red/10 to-amber-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.1)] overflow-hidden">
                                    <div className="p-8 md:p-12">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-red/5 flex items-center justify-center">
                                                    <CalendarDays className="w-6 h-6 text-brand-red" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">About this property</h2>
                                                    <p className="text-slate-400 text-sm font-medium mt-0.5">Verified & Managed Listing</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {['Move-in ready', 'No brokerage'].map(tag => (
                                                    <span key={tag} className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="prose prose-slate max-w-none">
                                            <div
                                                className={`text-slate-600 leading-relaxed text-base md:text-lg space-y-6 ${!aboutExpanded && showAboutToggle ? 'max-h-[300px] overflow-hidden' : ''}`}
                                            >
                                                {aboutNarrative.split(/\n\n+/).map((block: string, bi: number) => (
                                                    <p key={bi}>{block}</p>
                                                ))}
                                            </div>
                                            
                                            {!aboutExpanded && showAboutToggle && (
                                                <div className="absolute bottom-32 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                                            )}
                                        </div>

                                        {showAboutToggle && (
                                            <button
                                                onClick={() => setAboutExpanded(!aboutExpanded)}
                                                className="mt-8 px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-brand-red transition-all shadow-lg shadow-slate-900/10"
                                            >
                                                {aboutExpanded ? 'Read less' : 'Read full description'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Visual Tour */}
                            {allImages.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between gap-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-brand-red rounded-full" />
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visual Tour</h2>
                                        </div>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{allImages.length} verified photos</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {allImages.map((url, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm border border-slate-100 hover:scale-[1.02] transition-all duration-500"
                                            >
                                                <OptimizedImage
                                                    src={url}
                                                    alt={`${displayTitle} - photo ${idx + 1}`}
                                                    fill
                                                    size="thumbnail"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Maximize2 className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Video Visit / Video Walkthrough */}
                            {allVideos.length > 0 && (
                                <section className="bg-slate-50/50 rounded-[3rem] p-8 md:p-12 border border-slate-100">
                                    <div className="flex items-center justify-between gap-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-brand-red rounded-full" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-1">Virtual Walkthrough</p>
                                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Video Visit</h2>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{allVideos.length} {allVideos.length === 1 ? 'Video' : 'Videos'}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {allVideos.map((v, idx) => {
                                            const ytEmbedUrl = getYouTubeEmbedUrl(v.url);
                                            const isMp4 = !ytEmbedUrl && (v.url.endsWith('.mp4') || v.url.endsWith('.webm') || v.url.includes('cloudinary') || v.url.includes('.mp4?'));
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col ${
                                                        allVideos.length === 1 ? 'md:col-span-2 max-w-4xl mx-auto w-full' : ''
                                                    }`}
                                                >
                                                    <div className={`relative w-full bg-black ${v.is_short ? 'aspect-[9/16] max-w-xs mx-auto' : 'aspect-video'}`}>
                                                        {ytEmbedUrl ? (
                                                            <iframe
                                                                src={ytEmbedUrl}
                                                                title={v.title || `Video Visit ${idx + 1}`}
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
                                                            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                                                                <Video className="w-12 h-12 text-brand-red mb-3" />
                                                                <p className="font-bold text-sm mb-2">{v.title}</p>
                                                                <a
                                                                    href={v.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white font-bold text-xs hover:bg-brand-red/90 transition"
                                                                >
                                                                    Watch Video <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {v.title && (
                                                        <div className="p-4 flex items-center justify-between border-t border-slate-100">
                                                            <span className="text-sm font-bold text-slate-800">{v.title}</span>
                                                            <span className="text-[10px] font-black uppercase px-2 py-1 bg-red-50 text-brand-red rounded-md">
                                                                {v.is_short ? 'Shorts' : 'Tour'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* Amenities Overlay */}
                            {displayFeatures.length > 0 && (
                                <section className="bg-slate-50/50 rounded-[3rem] p-8 md:p-12 border border-slate-100">
                                    <div className="mb-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">Amenities</p>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">What this place offers</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {displayFeatures.map((feature: string) => {
                                            const lookupKey = normalizeFeatureKey(feature);
                                            const icon = getAmenityIcon(lookupKey);
                                            return (
                                                <div
                                                    key={lookupKey}
                                                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand-red transition-colors">
                                                        {icon}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{feature}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}
                            {/* Sales Kit Downloads Section */}
                            {allSalesKitDocuments.length > 0 && (
                                <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">Downloads</p>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sales Kit & Brochures</h2>
                                            <p className="text-sm text-slate-500 mt-1">Download official brochures, pricing schedules, photo album, and welcome packs.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleDownloadAllBrochures}
                                            className="px-5 py-3 bg-brand-red hover:bg-red-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md self-start sm:self-auto shrink-0"
                                        >
                                            <Download className="w-4 h-4" /> Open Brochure / Google Drive
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {allSalesKitDocuments.map((doc, idx) => (
                                            <div
                                                key={doc.id || idx}
                                                className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-red/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-red transition-colors">
                                                            {doc.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 uppercase font-semibold truncate">
                                                            {doc.document_type || 'PDF Document'} {doc.file_size ? `• ${doc.file_size}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-slate-900 hover:bg-brand-red text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                                                >
                                                    <Download className="w-3.5 h-3.5" /> Open / Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Property Location & Interactive Map Section */}
                            <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">Location & Map</p>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Property Location</h2>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Located in <span className="font-semibold text-slate-800">{property.location || property.city || 'Bangalore'}</span> — view interactive neighborhood map below.
                                        </p>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.location || ''}, ${property.city || 'Bangalore, India'}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-3 bg-slate-900 hover:bg-brand-red text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md self-start sm:self-auto shrink-0"
                                    >
                                        <MapPin className="w-4 h-4 text-brand-red" /> Open in Google Maps
                                    </a>
                                </div>

                                {/* Interactive Google Maps Embed */}
                                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
                                    <iframe
                                        title="Property Location Map"
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.location || ''}, ${property.city || 'Bangalore, India'}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>

                                {property.nearby_places && property.nearby_places.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                                            Key Landmarks Nearby
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {property.nearby_places.map((place, idx) => (
                                                <div
                                                    key={place.id || idx}
                                                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4"
                                                >
                                                    <div className="flex items-center gap-3.5 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-bold text-xs">
                                                            {place.category === 'Metro' ? '🚇' : place.category === 'IT Park' ? '🏢' : place.category === 'Hospital' ? '🏥' : '📍'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-sm font-bold text-slate-900 truncate">{place.name}</h4>
                                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                                                <span className="font-semibold text-brand-red">{place.distance}</span>
                                                                {place.travel_time && (
                                                                    <span className="inline-flex items-center gap-1">
                                                                        • <Clock className="w-3 h-3 text-slate-400" /> {place.travel_time}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {place.map_link && (
                                                        <a
                                                            href={place.map_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors shrink-0"
                                                            title="View on Google Maps"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            <SimilarPropertiesSection current={property} initialSimilar={initialSimilar} />

                            {/* Reviews */}
                            <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                                <ReviewSection
                                    propertyId={property.id}
                                    initialReviews={property.reviews_list || []}
                                    onReviewAdded={refetch}
                                />
                            </section>

                        </div>

                        {/* RIGHT COLUMN: Sticky Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-[88px] xl:top-24 self-start">
                            <div className="space-y-6">
                                {/* Main Booking Card */}
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.15)] overflow-hidden ring-1 ring-slate-900/[0.02]">
                                    <div className="p-8 space-y-8">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Starting from</p>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{property.price}</span>
                                                    {property.category === 'rent' && <span className="text-sm font-bold text-slate-400">/mo</span>}
                                                </div>
                                            </div>
                                            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 shrink-0">
                                                Verified
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <span className="text-sm font-bold text-slate-500">Maintenance</span>
                                                <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">Included</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <span className="text-sm font-bold text-slate-500">Security Deposit</span>
                                                <span className="text-sm font-black text-slate-900">1 Month</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Button 
                                                variant="primary" 
                                                className="w-full py-7 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                                                onClick={handlePayNow}
                                                disabled={isPaymentProcessing}
                                            >
                                                {isPaymentProcessing ? 'Processing...' : 'Secure this room now'}
                                            </Button>
                                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                                Instant Confirmation • No Hidden Charges
                                            </p>
                                        </div>

                                        <div className="pt-8 border-t border-slate-50">
                                            <div 
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-brand-charcoal text-white group cursor-pointer hover:bg-slate-800 transition-colors shadow-lg"
                                                onClick={() =>
                                                    setLeadModal({
                                                        isOpen: true,
                                                        title: 'Talk to an agent',
                                                        subtitle: `Questions about ${displayTitle || 'this property'}? Share your details and our team will reach out shortly.`,
                                                        source: 'Website - Property - Talk to Agent',
                                                        actionLabel: 'Request a callback',
                                                    })
                                                }
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                    <MessageCircle className="w-6 h-6" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-sm font-bold leading-tight">Talk to an agent</p>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Get expert advice instantly</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform shrink-0" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Support Info Card */}
                                <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                                            <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
                                        </div>
                                        <p className="text-xs font-bold text-amber-900 leading-relaxed">
                                            This property is a top-rated choice in {property.location} with verified listings and zero brokerage.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── SEO / Supplementary Content ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                    <BreadcrumbNav items={breadcrumbItems} />
                    <AeoSnippet property={property} />

                    {/* Area Guide & Locality Information — full SEO article, below the fold */}
                    {longSeo && longSeo.trim().length > 80 && (
                        <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                            <div className="mb-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">
                                    Area Guide
                                </p>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    Area Guide &amp; Locality Information
                                </h2>
                                <p className="text-slate-400 text-sm font-medium mt-1">
                                    Everything you need to know about living in {property.location}
                                </p>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                {longSeo.split(/\n\n+/).map((block: string, bi: number) => {
                                    if (block.startsWith('## ')) {
                                        return <h2 key={bi} className="text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-3">{block.replace('## ', '')}</h2>;
                                    }

                                    const renderTextWithBold = (text: string) => {
                                        const parts = text.split(/(\*\*.*?\*\*)/g);
                                        return parts.map((part, i) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
                                            }
                                            return part;
                                        });
                                    };

                                    if (block.startsWith('- ')) {
                                        return (
                                            <ul key={bi} className="list-disc pl-5 mb-4 space-y-1">
                                                {block.split('\n').filter(Boolean).map((line, li) => (
                                                    <li key={li}>{renderTextWithBold(line.replace(/^- /, '').trim())}</li>
                                                ))}
                                            </ul>
                                        );
                                    }

                                    return <p key={bi} className="mb-4 whitespace-pre-line">{renderTextWithBold(block)}</p>;
                                })}
                            </div>
                        </section>
                    )}

                    <div className="border-t border-slate-100 pt-12">
                        <PeopleAlsoAsk items={buildPropertyPdpFaqs(property)} />
                    </div>
                </div>

                {isPG && pgLoc && (
                    <section className="border-t border-slate-100 bg-slate-50/30 py-16 md:py-24">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <PgLocalityHubTeaser name={pgLoc.name} slug={pgLoc.slug} />
                        </div>
                    </section>
                )}
            </main>

            <Footer />

            {/* ─── Lightbox ─── */}
            {lightboxIndex !== null && allImages.length > 0 && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
                    <button onClick={() => setLightboxIndex(null)} className="absolute top-5 right-5 p-2.5 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-10">
                        <X className="w-5 h-5" />
                    </button>
                    {allImages.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i! === 0 ? allImages.length - 1 : i! - 1); }}
                                className="absolute left-4 p-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i! === allImages.length - 1 ? 0 : i! + 1); }}
                                className="absolute right-4 p-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                    <img
                        src={allImages[lightboxIndex]}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl select-none"
                        decoding="async"
                    />
                </div>
            )}

            <ServiceFeeModal
                isOpen={showServiceFeeModal}
                onClose={() => setShowServiceFeeModal(false)}
                onProceed={handleServiceFeeProceed}
                propertyType={property.type}
            />

            {isPaymentProcessing && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white">
                    <LoadingSpinner size={48} className="text-white" />
                    <p className="mt-4 text-lg font-medium">Processing Payment...</p>
                    <p className="text-sm text-slate-300">Please do not close this window</p>
                </div>
            )}

            <PaymentSuccessModal
                isOpen={successData.isOpen}
                onClose={() => setSuccessData(prev => ({ ...prev, isOpen: false }))}
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
            />

            <SafetyPopup 
                isOpen={isSafetyPopupOpen} 
                onClose={handleSafetyConfirm} 
            />
            </div>
        </Fragment>
    );
}
