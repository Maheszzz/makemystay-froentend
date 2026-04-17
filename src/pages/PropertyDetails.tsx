import { Fragment } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Star, Heart, ArrowLeft, Share2, MapPin, CalendarDays, ChevronLeft, ChevronRight, X, Maximize2, Check, MessageCircle } from 'lucide-react';
import { Link, useParams, useLocation, Navigate } from 'react-router-dom';
import { useProperty, useSmartBack } from '@/hooks';
import { paymentApi } from '@/lib/api';
import { formatPropertyTitle, reviewsLabel } from '@/lib/formatPropertyTitle';
import { getPropertyDetailPath, parsePropertySlugParam } from '@/lib/propertyRouting';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPropertyDetailGraph } from '@/lib/schema';
import { buildPageSEO, interimPropertyDetailSeo, propertyDetailPageSeo, propertyErrorSeo } from '@/lib/seo';
import { SITE_URL } from '@/lib/siteConfig';

import { ServiceFeeModal, ServiceFeeOption } from '@/components/modals/ServiceFeeModal';
import { ReviewSection } from '@/components/property/ReviewSection';
import { useMemo, useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { getAmenityIcon } from '@/lib/amenityIcons';
import { dedupePropertyFeatures, normalizeFeatureKey } from '@/lib/propertyFeatures';
import logoImage from '@/assets/MakeMysStaylogo.svg';
import { PaymentSuccessModal } from '@/components/modals/PaymentSuccessModal';
import { LeadCaptureModal } from '@/components/modals/LeadCaptureModal';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PgLocalityHubTeaser } from '@/components/seo/PgLocalityHubTeaser';
import { PropertyQuickAnswers } from '@/components/seo/PropertyQuickAnswers';
import { SimilarPropertiesSection } from '@/components/property/SimilarPropertiesSection';
import { SafetyPopup } from '@/components/modals/SafetyPopup';
import { PeopleAlsoAsk } from '@/components/seo/PeopleAlsoAsk';
import { AeoSnippet } from '@/components/seo/AeoSnippet';
import { buildPropertyHeroIntro, buildPropertySeoHeading } from '@/lib/propertyDetailCopy';
import {
    buildClientSeoAbout,
    buildPropertyPdpFaqs,
    extractHeroLeadFromNarrative,
} from '@/lib/propertyClientSeoNarrative';
import { findPgLocationForArea } from '@/data/pgLocations';

export default function PropertyDetails() {
    const { slug: slugParam } = useParams<{ slug: string }>();
    const location = useLocation();
    const propertyId = parsePropertySlugParam(slugParam ?? '');
    const goBack = useSmartBack({ fallback: '/properties' });
    const { property, loading, error, refetch } = useProperty(propertyId);
    const { isWishlisted, toggleWishlist } = useWishlist();


    const [showServiceFeeModal, setShowServiceFeeModal] = useState(false);
    const [isSafetyPopupOpen, setIsSafetyPopupOpen] = useState(false);
    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
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

    /** Never show fabricated 4.6 / "27 Reviews" — only API-backed rating + review count or review list. */
    const showListingRating = useMemo(() => {
        if (!property) return false;
        const r = property.average_rating ?? property.rating ?? 0;
        if (r <= 0) return false;
        const rc = property.review_count ?? property.reviews ?? 0;
        const rl = property.reviews_list?.length ?? 0;
        return rc > 0 || rl > 0;
    }, [property]);

    const ratingStarsValue = property ? property.average_rating ?? property.rating ?? 0 : 0;
    const reviewLabelText = property
        ? (property.review_count ?? property.reviews ?? 0) > 0
            ? reviewsLabel(property.review_count ?? property.reviews ?? 0)
            : property.reviews_list && property.reviews_list.length > 0
              ? `${property.reviews_list.length} reviews`
              : ''
        : '';

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
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch { alert('Failed to copy link to clipboard.'); }
        }
    };

    const handleBack = goBack;

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
            const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!key) { alert("Error: VITE_RAZORPAY_KEY_ID is missing."); setIsPaymentProcessing(false); return; }
            const order = await paymentApi.createOrder({ amount: option.amount * 100, currency: "INR", payment_type: "booking", payer_name: "Guest User", payer_email: "guest@example.com", payer_phone: "9999999999" });
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount, currency: order.currency,
                name: "MakeMyStay", description: `Booking Fee - ${option.label}`,
                image: logoImage, order_id: order.id,
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
                <SEOHead {...interimHelmet} ogType="article" />
                <Navbar />
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
                <SEOHead {...errorHelmet} />
                <Navbar />
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

    if (location.pathname !== canonicalDetailPath) {
        return (
            <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
                <SEOHead 
                    {...interimHelmet} 
                    prerenderStatus={301} 
                    prerenderHeaders={{ Location: `${canonicalDetailPath}${location.search}${location.hash}` }}
                />
                <Navigate to={`${canonicalDetailPath}${location.search}${location.hash}`} replace />
            </div>
        );
    }

    // Build the images list
    const allImages: string[] = [];
    if (Array.isArray(property.images) && property.images.length > 0) {
        property.images.forEach((img: any) => {
            const url = typeof img === 'string' ? img : img?.image_url;
            if (url) allImages.push(url);
        });
    } else if (property.image) {
        allImages.push(property.image);
    }

    const heroImage = allImages[heroIdx] || null;

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

    /** ~500-word SEO: API `seo_about` when present; else client generator (localhost-friendly). */
    const longSeo =
        property.seo_about && property.seo_about.trim().length > 80
            ? property.seo_about.trim()
            : buildClientSeoAbout(property);
    const aboutNarrative = longSeo.length > 80 ? longSeo : desc;

    const aboutWordCount = aboutNarrative.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const showAboutToggle = aboutWordCount > 200;

    const seoHeading = buildPropertySeoHeading(property);
    const heroLead =
        extractHeroLeadFromNarrative(aboutNarrative, 520) || buildPropertyHeroIntro(property);
    const crumbLabel = seoHeading.trim();
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        ...(isPG
            ? [
                  { name: 'PG in Bangalore', path: '/pg/bangalore' },
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
            {detailHelmet && <SEOHead {...detailHelmet} ogType="article" />}
            {detailJsonLd && <JsonLd id="property-detail-jsonld" data={detailJsonLd} />}
            <div className="min-h-screen font-sans flex flex-col bg-gradient-to-b from-white via-[#fbfbfd] to-slate-50">
            <Navbar />

            <main id="main-content" className="pb-24 flex-grow">

                {/* ─── Hero gallery: image frame is overflow-hidden; metadata sits below to avoid clipping ─── */}
                <section className="relative bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-900/50 via-transparent to-slate-950/80" aria-hidden />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-5 md:pb-6">
                        {/* Top actions */}
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex items-center justify-center text-white/85 hover:text-white transition-colors"
                                aria-label="Go back to previous page"
                            >
                                <span className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                                    <ArrowLeft className="w-5 h-5" aria-hidden />
                                </span>
                            </button>

                            <div className="flex items-center gap-2">
                                {copied && (
                                    <span className="hidden sm:inline text-emerald-200 text-xs font-semibold bg-white/10 border border-white/15 px-3 py-2 rounded-full">
                                        Link copied
                                    </span>
                                )}
                                {allImages.length > 0 && (
                                    <button
                                        onClick={() => setLightboxIndex(heroIdx)}
                                        className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white/90 hover:text-white hover:bg-white/15 transition-all"
                                        aria-label="Open gallery"
                                    >
                                        <Maximize2 className="w-4 h-4 mx-auto" />
                                    </button>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white/90 hover:text-white hover:bg-white/15 transition-all"
                                    aria-label="Share property"
                                >
                                    <Share2 className="w-4 h-4 mx-auto" />
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`w-10 h-10 rounded-full border transition-all ${wishlisted ? 'bg-brand-red/90 border-brand-red text-white' : 'bg-white/10 border-white/15 text-white/90 hover:text-white hover:bg-white/15'}`}
                                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart className={`w-4 h-4 mx-auto ${wishlisted ? 'fill-white' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Gallery card: image area uses overflow-hidden only; summary is in normal flow below */}
                        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl shadow-black/25 overflow-hidden">
                            <div className="relative w-full group">
                                <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-800 to-slate-900" aria-hidden />
                                <div className="absolute inset-0 z-[15] pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/5" aria-hidden />

                                {heroImage ? (
                                    <div
                                        className={`relative z-[5] w-full overflow-hidden ${
                                            heroIsPortrait
                                                ? 'mx-auto max-w-[min(100%,280px)] h-[clamp(240px,min(40vh,380px),420px)]'
                                                : 'h-[clamp(220px,min(38vh,360px),400px)] sm:h-[clamp(240px,min(40vh,380px),440px)]'
                                        }`}
                                    >
                                        {/* object-contain shows the full photo (letterboxing on slate); switch to object-cover for edge-to-edge crop */}
                                        <img
                                            key={heroIdx}
                                            src={heroImage}
                                            alt={heroAlt}
                                            width={1200}
                                            height={800}
                                            onLoad={handleHeroImageLoad}
                                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-[1.01]"
                                            loading="eager"
                                            decoding="async"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative z-10 flex min-h-[280px] w-full items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                                        <div className="text-center text-slate-400">
                                            <div className="text-6xl mb-2">🏠</div>
                                            <p className="text-sm font-medium">No image available</p>
                                        </div>
                                    </div>
                                )}

                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setHeroIsPortrait(false);
                                                setHeroIdx((i) => (i === 0 ? allImages.length - 1 : i - 1));
                                            }}
                                            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/35 border border-white/20 text-white hover:bg-black/45 backdrop-blur-sm transition-all"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-5 h-5 mx-auto" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setHeroIsPortrait(false);
                                                setHeroIdx((i) => (i === allImages.length - 1 ? 0 : i + 1));
                                            }}
                                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/35 border border-white/20 text-white hover:bg-black/45 backdrop-blur-sm transition-all"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-5 h-5 mx-auto" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Property summary — compact so gallery + key facts stay above the fold */}
                            <div className="relative border-t border-white/10 bg-slate-950/90 px-4 py-3.5 sm:px-5 sm:py-4 backdrop-blur-md">
                                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${property.is_available ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30' : 'bg-amber-500/15 text-amber-200 border-amber-500/30'}`}>
                                        {property.tag || (property.is_available ? 'Available' : 'Limited availability')}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/85 border border-white/15">
                                        {Math.max(allImages.length, 1)} photos
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-200 border border-rose-500/30 animate-pulse">
                                        🔥 High Demand
                                    </span>
                                </div>
                                <h1
                                    className="text-lg sm:text-xl md:text-2xl lg:text-[1.65rem] font-extrabold text-white leading-snug tracking-tight break-words"
                                    data-seo="pdp-h1"
                                >
                                    {seoHeading}
                                </h1>
                                <p
                                    className="mt-2 text-white/80 text-sm sm:text-[15px] leading-relaxed max-w-3xl"
                                    data-seo="pdp-hero-lead"
                                >
                                    {heroLead}
                                </p>
                                <p className="mt-1.5 text-white/80 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm font-medium">
                                    <span className="inline-flex items-center gap-2 min-w-0">
                                        <MapPin className="w-4 h-4 shrink-0 text-white/70" />
                                        <span>{property.type}</span>
                                    </span>
                                    <span className="text-white/40 hidden sm:inline">•</span>
                                    <span className="text-white/90 min-w-0 sm:truncate max-w-full">{property.location}</span>
                                </p>

                                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[11px] sm:text-xs text-emerald-100/95 font-semibold list-none p-0">
                                    {['Verified listing', '24/7 support', 'No brokerage', 'Book online'].map((label) => (
                                        <li key={label} className="inline-flex items-center gap-1.5">
                                            <Check className="h-3.5 w-3.5 text-emerald-300 shrink-0" aria-hidden />
                                            {label}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                                    {showListingRating && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm">
                                            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" aria-hidden />
                                            <span className="font-extrabold">{ratingStarsValue.toFixed(1)}</span>
                                            <span className="text-white/65 text-xs font-semibold">({reviewLabelText})</span>
                                        </div>
                                    </div>
                                    )}

                                    <div className="flex flex-row items-baseline justify-between gap-3 sm:flex-col sm:items-end sm:text-right sm:ml-auto sm:justify-end border-t border-white/10 pt-3 sm:border-0 sm:pt-0">
                                        <span className="text-white/50 text-[10px] font-bold uppercase tracking-[0.15em]">Starting from</span>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-white font-extrabold text-xl sm:text-2xl tabular-nums tracking-tight">{property.price}</span>
                                                {property.category === 'rent' && (
                                                    <span className="text-white/60 font-semibold text-sm">/mo</span>
                                                )}
                                            </div>
                                            <span className="text-[10px] sm:text-[11px] text-white/55 font-medium max-w-[14rem] text-right leading-snug">
                                                All-inclusive options may be available — confirm on enquiry
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {allImages.length > 1 && (
                            <div className="mt-3 rounded-xl border border-slate-200/90 bg-slate-100 p-2 sm:p-2.5 shadow-inner">
                                <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {allImages.map((url, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setHeroIsPortrait(false);
                                                setHeroIdx(idx);
                                            }}
                                            className={`flex h-14 w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white transition-all sm:h-16 sm:w-24 ${idx === heroIdx ? 'border-brand-red ring-2 ring-brand-red/30 ring-offset-1 ring-offset-slate-100 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                                            aria-label={`Select image ${idx + 1}`}
                                            aria-current={idx === heroIdx ? 'true' : undefined}
                                        >
                                            <img
                                                src={url}
                                                alt={`${galleryAltBase} — photo ${idx + 1}`}
                                                width={400}
                                                height={300}
                                                className="h-full w-full object-cover"
                                                loading={idx < 4 ? "eager" : "lazy"}
                                                decoding="async"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── Main Content ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
                    <div className="mb-6">
                        <BreadcrumbNav items={breadcrumbItems} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

                        <div className="lg:col-span-2 space-y-12">
                            <AeoSnippet property={property} />
                            <PropertyQuickAnswers property={property} />

                            {/* About Section */}
                            <div className="relative rounded-3xl border border-slate-200/70 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.40)] overflow-hidden">
                                {/* Subtle luxury background */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
                                    <div className="absolute -top-28 -left-28 w-[26rem] h-[26rem] rounded-full blur-3xl" style={{ background: 'rgba(177,18,38,0.10)' }} />
                                    <div className="absolute -top-36 -right-36 w-[30rem] h-[30rem] rounded-full blur-3xl" style={{ background: 'rgba(245,158,11,0.10)' }} />
                                    <div className="absolute inset-0" style={{ background: 'radial-gradient(900px 450px at 10% 0%, rgba(2,6,23,0.06) 0%, transparent 60%)' }} />
                                </div>

                                {/* Top accent */}
                                <div className="relative h-1 bg-gradient-to-r from-brand-red via-red-400 to-amber-400" />

                                <div className="relative p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1 h-7 bg-brand-red rounded-full" />
                                        <div className="min-w-0">
                                            <h2 className="text-2xl font-extrabold text-slate-900">About this home</h2>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Verified listing · Premium amenities · High-demand location
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur-sm p-5 md:p-6 shadow-sm">
                                        <div className="relative">
                                            <div
                                                data-seo="pdp-about"
                                                className={`text-slate-700 leading-relaxed text-[15px] md:text-base space-y-4 ${
                                                    !aboutExpanded && showAboutToggle
                                                        ? 'max-h-[28rem] overflow-hidden'
                                                        : ''
                                                }`}
                                            >
                                                {aboutNarrative.split(/\n\n+/).map((block: string, bi: number) => {
                                                    const trimmed = block.trim();
                                                    if (!trimmed) return null;
                                                    return (
                                                        <div key={bi} className="space-y-3">
                                                            {trimmed.split('\n').map((line: string, i: number) => {
                                                                if (!line.trim()) return null;
                                                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                                                return (
                                                                    <p key={`${bi}-${i}`}>
                                                                        {parts.map((part: string, j: number) => {
                                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                                return (
                                                                                    <strong key={j} className="text-slate-900 font-semibold">
                                                                                        {part.slice(2, -2)}
                                                                                    </strong>
                                                                                );
                                                                            }
                                                                            return part;
                                                                        })}
                                                                    </p>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {!aboutExpanded && showAboutToggle && (
                                                <div
                                                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/95 to-transparent rounded-b-2xl"
                                                    aria-hidden
                                                />
                                            )}
                                        </div>
                                        {showAboutToggle && (
                                            <button
                                                type="button"
                                                onClick={() => setAboutExpanded((e) => !e)}
                                                className="mt-4 text-sm font-semibold text-brand-red hover:underline"
                                            >
                                                {aboutExpanded ? 'Show less' : `Read full description (${aboutWordCount} words)`}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Amenities */}
                                {displayFeatures.length > 0 && (
                                    <div className="relative border-t border-slate-200/60 px-6 md:px-8 py-7 md:py-8 bg-gradient-to-b from-slate-50/40 to-transparent">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {['Fully furnished', 'Move-in ready', 'No brokerage', 'Verified listing'].map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mb-6">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                                                Amenities
                                            </p>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                                                What this place offers
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
                                                Everything included with your stay — curated for comfort and convenience.
                                            </p>
                                        </div>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 list-none p-0 m-0">
                                            {displayFeatures.map((feature: string) => {
                                                const lookupKey = normalizeFeatureKey(feature);
                                                const icon = getAmenityIcon(lookupKey);
                                                return (
                                                    <li
                                                        key={lookupKey}
                                                        className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300/90 hover:shadow-md transition-all duration-200"
                                                    >
                                                        <div
                                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 text-brand-red border border-slate-200/80 [&_svg]:shrink-0"
                                                            aria-hidden
                                                        >
                                                            {icon}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-800 leading-snug pt-1.5 min-w-0">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Visual Tour */}
                            {allImages.length > 0 && (
                                <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.25)] p-6 md:p-8">
                                    <div className="mb-7 flex items-center gap-3">
                                        <div className="w-1 h-7 bg-brand-red rounded-full" />
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-slate-900">Visual Tour</h2>
                                            <p className="text-sm text-slate-400 mt-0.5">Explore every corner of this property</p>
                                        </div>
                                    </div>
                                    <div className={`grid gap-3 ${allImages.length === 1 ? 'grid-cols-1' : allImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
                                        {allImages.map((url, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="aspect-[4/3] rounded-2xl overflow-hidden group cursor-zoom-in relative shadow-sm border border-slate-200/70 hover:border-slate-300 transition-all hover:shadow-md bg-slate-100"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`${galleryAltBase} — gallery photo ${idx + 1}`}
                                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <SimilarPropertiesSection current={property} />

                            {/* Reviews */}
                            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.25)] p-6 md:p-8">
                                <ReviewSection
                                    propertyId={property.id}
                                    initialReviews={property.reviews_list || []}
                                    onReviewAdded={refetch}
                                />
                            </div>

                            <div className="pt-8 border-t border-slate-200">
                                <PeopleAlsoAsk items={buildPropertyPdpFaqs(property)} />
                            </div>
                        </div>

                        {/* RIGHT — Booking Card (sticky) */}
                        <div className="relative">
                            <div className="sticky top-24 space-y-5">

                                {/* Price + Book */}
                                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] overflow-hidden">
                                    <div className="h-0.5 bg-gradient-to-r from-brand-red via-rose-500 to-amber-400" />

                                    <div className="p-6 md:p-7 space-y-5">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                Starting from
                                            </p>
                                            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0">
                                                <span className="text-[2rem] md:text-4xl font-semibold tabular-nums tracking-tight text-slate-900">
                                                    {property.price}
                                                </span>
                                                {property.category === 'rent' && (
                                                    <span className="text-sm font-medium text-slate-400">/ month</span>
                                                )}
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                                                All-inclusive options may be available — confirm on enquiry
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-100 bg-slate-50/90 p-4 space-y-3 text-[13px]">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-slate-500">Monthly rent</span>
                                                <span className="font-semibold tabular-nums text-slate-900">{property.price}</span>
                                            </div>
                                            <div className="h-px bg-slate-200/80" aria-hidden />
                                            <div className="flex justify-between gap-4">
                                                <span className="text-slate-500">Maintenance</span>
                                                <span className="font-semibold text-emerald-700">Included</span>
                                            </div>
                                        </div>

                                        {showListingRating && (
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <Star className="h-4 w-4 shrink-0 text-amber-400 fill-amber-400" aria-hidden />
                                                <span className="font-semibold tabular-nums text-slate-900">
                                                    {ratingStarsValue.toFixed(1)}
                                                </span>
                                                <span className="truncate text-sm text-slate-500">{reviewLabelText}</span>
                                            </div>
                                            <span className="shrink-0 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                                                Verified
                                            </span>
                                        </div>
                                        )}

                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                                                <span>Posted on</span>
                                            </div>
                                            <span className="font-semibold tabular-nums text-slate-900">
                                                {property.postedDate ||
                                                    new Date().toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                            </span>
                                        </div>

                                        <div className="pt-1">
                                            <Button
                                                onClick={handlePayNow}
                                                className="w-full rounded-xl border-0 bg-brand-red py-3.5 text-[15px] font-semibold text-white shadow-md shadow-brand-red/20 transition hover:bg-brand-red/95 hover:shadow-lg hover:shadow-brand-red/30 active:scale-[0.99]"
                                            >
                                                Secure this room now
                                            </Button>
                                            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
                                                🔥 Only few rooms left – Book your visit today<br/>
                                                Token ₹5,000 · No hidden charges · Instant confirmation
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Talk to Agent — opens lead form (full contact page linked below) */}
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLeadModal({
                                                isOpen: true,
                                                title: 'Talk to an agent',
                                                subtitle: `Questions about ${displayTitle || 'this property'}? Share your details and our team will reach out shortly.`,
                                                source: 'Website - Property - Talk to Agent',
                                                actionLabel: 'Request a callback',
                                            })
                                        }
                                        className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-6 py-5 text-left shadow-xl transition-colors hover:bg-slate-800 group"
                                    >
                                        <div>
                                            <p className="text-base font-bold text-white">Talk to an agent</p>
                                            <p className="mt-0.5 text-sm text-slate-400">Get expert advice on this listing</p>
                                        </div>
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-md transition-transform group-hover:scale-105">
                                            <ChevronRight className="h-5 w-5" aria-hidden />
                                        </div>
                                    </button>
                                    <Link
                                        to="/contact-us"
                                        className="block text-center text-xs font-medium text-slate-500 transition hover:text-brand-red"
                                    >
                                        All contact options →
                                    </Link>
                                </div>

                                {/* Share / Wishlist */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={handleShare} className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-semibold">
                                        <Share2 className="w-4 h-4" /> {copied ? 'Copied!' : 'Share'}
                                    </button>
                                    <button onClick={handleWishlistToggle} className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${wishlisted ? 'bg-red-50 border-red-200 text-brand-red' : 'border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-brand-red'}`}>
                                        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-brand-red' : ''}`} />
                                        {wishlisted ? 'Saved' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {isPG && pgLoc && (
                    <section className="border-t border-slate-200/80 bg-slate-50/80 py-10 md:py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <PgLocalityHubTeaser name={pgLoc.name} slug={pgLoc.slug} />
                        </div>
                    </section>
                )}
            </main>

            {/* Sticky WhatsApp CTA (Conversion Signal) - Hidden on mobile as per user request */}
            <div className="hidden md:block fixed bottom-8 right-6 z-[60]">
                <a
                    href={`https://wa.me/919999999999?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(displayTitle || property.title)}%20in%20${encodeURIComponent(property.location)}.%20Is%20it%20available?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 hover:scale-110 transition-transform active:scale-95 group relative"
                    aria-label="Chat on WhatsApp"
                >
                    <MessageCircle className="h-7 w-7 fill-white" />
                    <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                        Chat on WhatsApp
                    </span>
                </a>
            </div>

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
                        alt={`${galleryAltBase} — full screen ${lightboxIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl select-none"
                    />
                    <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
                        {lightboxIndex + 1} / {allImages.length}
                    </p>
                </div>
            )}

            {/* Service Fee Modal */}
            <ServiceFeeModal
                isOpen={showServiceFeeModal}
                onClose={() => setShowServiceFeeModal(false)}
                onProceed={handleServiceFeeProceed}
                propertyType={property.type}
            />

            {/* Payment Overlay */}
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

            {/* PropertyStickyActions removed as per user request */}
            </div>
        </Fragment>
    );
}
