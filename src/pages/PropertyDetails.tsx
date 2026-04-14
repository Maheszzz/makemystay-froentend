import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Check, Star, Heart, ArrowLeft, Share2, MapPin, CalendarDays, ChevronLeft, ChevronRight, X, Maximize2, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useProperty, useSmartBack } from '@/hooks';
import { paymentApi } from '@/lib/api';
import { parsePropertySlugParam } from '@/lib/propertyRouting';

import { ServiceFeeModal, ServiceFeeOption } from '@/components/modals/ServiceFeeModal';
import { ReviewSection } from '@/components/property/ReviewSection';
import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { amenityIconMap } from '@/lib/amenityIcons';
import logoImage from '@/assets/MakeMysStaylogo.svg';
import { PaymentSuccessModal } from '@/components/modals/PaymentSuccessModal';
import { LeadCaptureModal } from '@/components/modals/LeadCaptureModal';


export default function PropertyDetails() {
    // Route: /properties/:slug  (e.g. "102-slc-bhk-2" or bare "102")
    const { slug: slugParam } = useParams<{ slug: string }>();
    const propertyId = parsePropertySlugParam(slugParam ?? '');
    const goBack = useSmartBack({ fallback: '/properties' });
    const { property, loading, error, refetch } = useProperty(propertyId);
    const { isWishlisted, toggleWishlist } = useWishlist();

    const [showServiceFeeModal, setShowServiceFeeModal] = useState(false);
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
        actionLabel: ''
    });

    const wishlisted = property ? isWishlisted(String(property.id)) : false;

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (property) toggleWishlist(property);
    };

    const handleShare = async () => {
        if (!property) return;
        const productionUrl = `https://makemystay.ai/properties/${slugParam}`;
        const shareData = {
            title: property.title,
            text: `Check out this property: ${property.title} in ${property.location}`,
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

    const handlePayNow = () => setShowServiceFeeModal(true);

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
    let displayFeatures = Array.isArray(property.features) ? property.features : [];
    const isPG = property.type === 'PG' || property.type === 'Hostel';
    if (isPG) {
        const standardAmenities = ["High-Speed WiFi", "Nutritious Food", "Daily Housekeeping", "Power Backup", "24/7 Security", "Washing Machine", "Refrigerator", "RO Water Purifier"];
        displayFeatures = Array.from(new Set([...displayFeatures, ...standardAmenities]));
    }
    const duplicatePairs: [string, string][] = [
        ['ro water', 'ro water purifier'], ['wifi', 'high-speed wifi'], ['wifi', 'wi-fi'],
        ['security', '24/7 security'], ['security', 'cctv security'], ['housekeeping', 'daily housekeeping'],
        ['housekeeping', 'professional housekeeping'], ['tv', 'smart tv'],
        ['parking', 'bike parking'], ['parking', 'car parking'], ['kitchen', 'common kitchen'],
        ['kitchen', 'shared kitchen'], ['kitchen', 'modern kitchen'], ['kitchen', 'fully equipped kitchen'],
        ['water purifier', 'ro water purifier'],
    ];
    const lowerSet = new Set(displayFeatures.map((f: string) => f.toLowerCase()));
    const toRemove = new Set<string>();
    for (const [generic, specific] of duplicatePairs) {
        if (lowerSet.has(generic) && lowerSet.has(specific)) toRemove.add(generic);
    }
    if (toRemove.size > 0) displayFeatures = displayFeatures.filter((f: string) => !toRemove.has(f.toLowerCase()));

    // Description
    const desc = property.description && property.description.length > 50
        ? property.description
        : `Experience premium living at **${property.title}** in the heart of **${property.location}**. This luxury ${property.type} offers a perfect blend of comfort and convenience, designed for modern professionals and students.\n\nEnjoy a hassle-free lifestyle with top-tier amenities including high-speed WiFi, nutritious food, and daily housekeeping. The property features spacious rooms with ample natural light, ensuring a pleasant stay. Located close to major tech parks and educational institutions, it provides easy access to public transport and local markets.\n\nBook your slot today and upgrade your living experience with MakeMyStay.`;

    return (
        <div className="min-h-screen font-sans flex flex-col bg-gradient-to-b from-white via-[#fbfbfd] to-slate-50">
            <Navbar />

            <main id="main-content" className="pb-24 flex-grow">

                {/* ─── Hero Slider (clean, high-clarity) ─── */}
                <section className="relative bg-black">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/35 via-black/25 to-black/70" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-6 md:pb-8">
                        {/* Top actions */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center gap-2 text-white/85 hover:text-white transition-colors"
                            >
                                <span className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                                    <ArrowLeft className="w-5 h-5" />
                                </span>
                                <span className="text-sm font-semibold tracking-wide hidden sm:inline">Back</span>
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

                        {/* Main slider — full photo visible (portrait / landscape), never cropped like object-cover */}
                        <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 group">
                            <div className="absolute inset-0 z-0 bg-slate-800 animate-pulse" aria-hidden />

                            {heroImage ? (
                                <div
                                    className="relative z-[5] w-full overflow-hidden"
                                    style={{ aspectRatio: heroIsPortrait ? '3/4' : '16/9' }}
                                >
                                    <img
                                        key={heroIdx}
                                        src={heroImage}
                                        alt={property.title}
                                        onLoad={handleHeroImageLoad}
                                        className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-[1.01]"
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

                            {/* Main Readability Overlay for texts (matches cinematic level) */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/10 to-transparent z-20" />

                            {/* Prev/next */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => {
                                            setHeroIsPortrait(false);
                                            setHeroIdx((i) => (i === 0 ? allImages.length - 1 : i - 1));
                                        }}
                                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-5 h-5 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setHeroIsPortrait(false);
                                            setHeroIdx((i) => (i === allImages.length - 1 ? 0 : i + 1));
                                        }}
                                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-5 h-5 mx-auto" />
                                    </button>
                                </>
                            )}

                            {/* Bottom content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest border ${property.is_available ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/25' : 'bg-amber-500/15 text-amber-200 border-amber-500/25'}`}>
                                        {property.tag || (property.is_available ? 'Available' : 'Limited availability')}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-white/10 text-white/80 border border-white/15">
                                        {Math.max(allImages.length, 1)} photos
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-[1.1] tracking-tight">
                                    {property.title}
                                </h1>
                                <p className="mt-2 text-white/80 flex items-center gap-2 text-sm sm:text-base font-medium">
                                    <MapPin className="w-4 h-4 shrink-0 text-white/70" />
                                    <span>{property.type}</span>
                                    <span className="text-white/40">•</span>
                                    <span className="truncate">{property.location}</span>
                                </p>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    {(property.rating ?? 0) > 0 ? (
                                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-white">
                                            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                                            <span className="font-extrabold">{(property.rating ?? 0).toFixed(1)}</span>
                                            <span className="text-white/60 text-sm font-semibold">({property.reviews || 0} reviews)</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-white/90">
                                            <Star className="w-4 h-4 text-amber-200" />
                                            <span className="text-sm font-semibold">New Listing</span>
                                        </div>
                                    )}

                                    <div className="ml-auto hidden md:flex items-end gap-2">
                                        <span className="text-white/60 text-xs font-bold uppercase tracking-[0.22em]">Starting from</span>
                                        <span className="text-white font-extrabold text-xl">{property.price}</span>
                                        {property.category === 'rent' && <span className="text-white/60 font-semibold pb-[2px]">/mo</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail strip (aligned, consistent aspect) */}
                        {allImages.length > 1 && (
                            <div className="mt-4">
                                <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {allImages.map((url, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setHeroIsPortrait(false);
                                                setHeroIdx(idx);
                                            }}
                                            className={`flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-slate-950 sm:h-28 sm:w-32 transition-all ${idx === heroIdx ? 'border-white/40 shadow-lg' : 'border-white/10 hover:border-white/25'}`}
                                            aria-label={`Select image ${idx + 1}`}
                                        >
                                            <img
                                                src={url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="max-h-full max-w-full object-contain"
                                                loading="lazy"
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

                        {/* LEFT — Main Details */}
                        <div className="lg:col-span-2 space-y-6">

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
                                        <div className="text-slate-700 leading-relaxed text-[15px] md:text-base space-y-3">
                                        {desc.split('\n').map((line: string, i: number) => {
                                            if (!line.trim()) return null;
                                            const parts = line.split(/(\*\*.*?\*\*)/g);
                                            return (
                                                <p key={i}>
                                                    {parts.map((part: string, j: number) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={j} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return part;
                                                    })}
                                                </p>
                                            );
                                        })}
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities */}
                                {displayFeatures.length > 0 && (
                                    <div className="relative border-t border-white/70 px-6 md:px-8 py-7 md:py-8">
                                        {/* Trust decision tags */}
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {['✓ Fully Furnished', '✓ Move-in Ready', '✓ No Brokerage', '✓ Verified Property'].map((tag) => (
                                                <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full border" style={{ color: '#1d7a4a', background: 'rgba(16,185,129,0.07)', borderColor: 'rgba(16,185,129,0.2)' }}>{tag}</span>
                                            ))}
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 mb-5 uppercase tracking-widest text-xs text-slate-400">What this place offers</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {displayFeatures.map((feature: string, idx: number) => {
                                                const icon = amenityIconMap[feature.toLowerCase()] ?? <Check className="w-4 h-4" />;
                                                return (
                                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default border border-transparent hover:border-slate-100">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                            {icon}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 leading-tight">{feature}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
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
                                                    alt={`Property view ${idx + 1}`}
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

                            {/* Reviews */}
                            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.25)] p-6 md:p-8">
                                <ReviewSection
                                    propertyId={property.id}
                                    initialReviews={property.reviews_list || []}
                                    onReviewAdded={refetch}
                                />
                            </div>
                        </div>

                        {/* RIGHT — Booking Card (sticky) */}
                        <div className="relative">
                            <div className="sticky top-24 space-y-5">

                                {/* Price + Book */}
                                <div className="bg-white rounded-3xl shadow-[0_22px_70px_-48px_rgba(15,23,42,0.45)] border border-slate-200/70 overflow-hidden">
                                    {/* top accent */}
                                    <div className="h-1 bg-gradient-to-r from-brand-red via-red-400 to-orange-400" />

                                    <div className="p-6 md:p-7">
                                        {/* Price */}
                                        <div className="mb-5">
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Starting from</p>
                                            <div className="flex items-end gap-1">
                                                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{property.price}</span>
                                                {property.category === 'rent' && <span className="text-slate-400 font-medium pb-1">/mo</span>}
                                            </div>
                                        </div>

                                        {/* Price breakdown */}
                                        <div className="mb-5 p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/70 space-y-2.5 text-sm">
                                            <div className="flex justify-between text-slate-600">
                                                <span>Monthly Rent</span>
                                                <span className="font-semibold text-slate-900">{property.price}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Maintenance</span>
                                                <span className="font-semibold text-emerald-600">Included</span>
                                            </div>
                                        </div>

                                        {/* Rating row */}
                                        <div className="flex items-center justify-between mb-5 p-3 bg-slate-50/70 rounded-2xl border border-slate-200/70">
                                            <div className="flex items-center gap-2">
                                                {(property.rating ?? 0) > 0 ? (
                                                    <>
                                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                        <span className="font-bold text-slate-900">{(property.rating ?? 0).toFixed(1)}</span>
                                                        <span className="text-slate-400 text-sm">&middot; {property.reviews || 0} reviews</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Star className="w-4 h-4 text-amber-300" />
                                                        <span className="text-sm font-semibold text-slate-700">New Listing</span>
                                                    </>
                                                )}
                                            </div>
                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Verified</span>
                                        </div>

                                        {/* Posted Date */}
                                        <div className="flex items-center justify-between mb-5 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <CalendarDays className="w-4 h-4 text-slate-300" />
                                                <span className="font-medium">Posted on</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{property.postedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>

                                        {/* CTA */}
                                        <Button
                                            onClick={handlePayNow}
                                            className="w-full py-4 text-base font-extrabold rounded-2xl bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-brand-red shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 transition-all transform hover:scale-[1.01] active:scale-[0.99] border-0 text-white"
                                        >
                                            🔥 Secure This Room Now
                                        </Button>
                                        <p className="text-center text-xs text-slate-400 mt-3">Token ₹5,000 · No hidden charges · Instant confirmation</p>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => setLeadModal({
                                                    isOpen: true,
                                                    title: 'Book a Site Visit',
                                                    subtitle: `Schedule a personal tour of ${property.title}. Our team will confirm the slot via WhatsApp.`,
                                                    source: 'Website - Book Visit',
                                                    actionLabel: 'Confirm Visit Slot'
                                                })}
                                                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <CalendarDays className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">Book Visit</span>
                                            </button>
                                            <button 
                                                onClick={() => setLeadModal({
                                                    isOpen: true,
                                                    title: 'Request a Call Back',
                                                    subtitle: `Have questions about ${property.title}? Our agent will call you within 15 minutes.`,
                                                    source: 'Website - Call Back',
                                                    actionLabel: 'Call Me ASAP'
                                                })}
                                                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">Call Back</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Talk to Agent */}
                                <Link to="/contact-us" className="flex items-center justify-between bg-slate-900 rounded-3xl px-6 py-5 shadow-xl hover:bg-slate-800 transition-colors group">
                                    <div>
                                        <p className="font-bold text-white text-base">Talk to an Agent</p>
                                        <p className="text-slate-400 text-sm mt-0.5">Get expert advice instantly</p>
                                    </div>
                                    <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform shadow-md">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </Link>

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
                        alt={`Full view ${lightboxIndex + 1}`}
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
                onClose={() => setLeadModal(prev => ({ ...prev, isOpen: false }))}
                title={leadModal.title}
                subtitle={leadModal.subtitle}
                source={leadModal.source}
                actionLabel={leadModal.actionLabel}
                propertyTitle={property.title}
                propertyLocation={property.location}
            />
        </div>
    );
}
