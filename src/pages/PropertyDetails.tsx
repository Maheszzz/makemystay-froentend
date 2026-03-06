import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Check, Star, Heart, ArrowLeft, Share2, MapPin, CalendarDays, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePropertyBySlug } from '@/hooks';
import { paymentApi } from '@/lib/api';

import { ServiceFeeModal, ServiceFeeOption } from '@/components/modals/ServiceFeeModal';
import { ReviewSection } from '@/components/property/ReviewSection';
import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { amenityIconMap } from '@/lib/amenityIcons';
import logoImage from '@/assets/MakeMysStaylogo.svg';


export default function PropertyDetails() {
    const { type, slug } = useParams();
    const navigate = useNavigate();
    const { property, loading, error, refetch } = usePropertyBySlug(type, slug);
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [showServiceFeeModal, setShowServiceFeeModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [heroIdx, setHeroIdx] = useState(0);

    const wishlisted = property ? isWishlisted(String(property.id)) : false;

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (property) toggleWishlist(property);
    };

    const handleShare = async () => {
        if (!property) return;
        const productionUrl = `https://makemystay.ai/properties/${type}/${slug}`;
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

    const handleBack = () => {
        if (window.history.length > 2) navigate(-1);
        else navigate('/properties');
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
                        await paymentApi.verifyPayment({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature });
                        alert("Payment Successful! Your booking is confirmed.");
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
            alert(`Payment Initialization Failed: ${msg} ${detail}`);
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
    if (property.images && property.images.length > 0) {
        property.images.forEach((img: any) => {
            const url = typeof img === 'string' ? img : img?.image_url;
            if (url) allImages.push(url);
        });
    } else if (property.image) {
        allImages.push(property.image);
    }

    const heroImage = allImages[heroIdx] || null;

    // Build display features
    let displayFeatures = property.features || [];
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
        <div className="bg-[#f8f9fb] min-h-screen font-sans flex flex-col">
            <Navbar />

            <main id="main-content" className="pb-24 flex-grow">

                {/* ─── Hero Gallery ─── */}
                <div className="relative h-[55vh] md:h-[72vh] bg-slate-900 overflow-hidden group">
                    {heroImage ? (
                        <img
                            key={heroIdx}
                            src={heroImage}
                            alt={property.title}
                            className="w-full h-full object-cover transition-all duration-700 scale-[1.02] group-hover:scale-100"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                            <div className="text-center text-slate-500">
                                <div className="text-6xl mb-2">🏠</div>
                                <p className="text-sm font-medium">No image available</p>
                            </div>
                        </div>
                    )}

                    {/* gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />

                    {/* Back & actions */}
                    <div className="absolute top-24 left-4 md:left-8 z-20 flex items-center gap-3">
                        <button onClick={handleBack} className="p-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-white hover:bg-white/30 transition-all shadow-lg cursor-pointer">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute top-24 right-4 md:right-8 z-20 flex items-center gap-2">
                        {allImages.length > 0 && (
                            <button onClick={() => setLightboxIndex(heroIdx)} className="p-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-white hover:bg-white/30 transition-all">
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        )}
                        {copied && <span className="text-emerald-300 text-xs font-semibold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">Link copied!</span>}
                        <button onClick={handleShare} className="p-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-white hover:bg-white/30 transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button onClick={handleWishlistToggle} className={`p-2.5 backdrop-blur-md border rounded-full transition-all ${wishlisted ? 'bg-brand-red/80 border-brand-red text-white' : 'bg-white/15 border-white/25 text-white hover:bg-white/30'}`}>
                            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
                        </button>
                    </div>

                    {/* Multi-image prev/next */}
                    {allImages.length > 1 && (
                        <>
                            <button onClick={() => setHeroIdx((i) => (i === 0 ? allImages.length - 1 : i - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-white hover:bg-white/30 transition-all shadow-lg">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => setHeroIdx((i) => (i === allImages.length - 1 ? 0 : i + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-white hover:bg-white/30 transition-all shadow-lg">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            {/* Dot indicators */}
                            <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                                {allImages.map((_, i) => (
                                    <button key={i} onClick={() => setHeroIdx(i)}
                                        className={`rounded-full transition-all ${i === heroIdx ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Property Details Bar floating at the bottom */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-16 max-w-7xl mx-auto">
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="inline-flex items-center bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                    {property.tag || 'Available'}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-1">{property.title}</h1>
                                <p className="text-white/80 flex items-center gap-1.5 font-medium">
                                    <MapPin className="w-4 h-4 shrink-0" />{property.type} &bull; {property.location}
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-white">
                                {(property.rating ?? 0) > 0 ? (
                                    <>
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="font-bold">{(property.rating ?? 0).toFixed(1)}</span>
                                        <span className="text-white/60 text-sm">&middot; {property.reviews || 0} reviews</span>
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-4 h-4 text-amber-300" />
                                        <span className="font-semibold text-sm">New Listing</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Main Content ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

                        {/* LEFT — Main Details */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* About Section */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1 h-7 bg-brand-red rounded-full" />
                                        <h2 className="text-2xl font-extrabold text-slate-900">About this home</h2>
                                    </div>
                                    <div className="text-slate-600 leading-relaxed text-base space-y-3">
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

                                {/* Amenities */}
                                {displayFeatures.length > 0 && (
                                    <div className="border-t border-slate-50 px-8 py-8">
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
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
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
                                                className="aspect-[4/3] rounded-2xl overflow-hidden group cursor-zoom-in relative shadow-sm border border-slate-100 hover:border-slate-200 transition-all hover:shadow-md"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Property view ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
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
                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                                    {/* top accent */}
                                    <div className="h-1 bg-gradient-to-r from-brand-red via-red-400 to-orange-400" />

                                    <div className="p-7">
                                        {/* Price */}
                                        <div className="mb-5">
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Starting from</p>
                                            <div className="flex items-end gap-1">
                                                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{property.price}</span>
                                                {property.category === 'rent' && <span className="text-slate-400 font-medium pb-1">/mo</span>}
                                            </div>
                                        </div>

                                        {/* Price breakdown */}
                                        <div className="mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-sm">
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
                                        <div className="flex items-center justify-between mb-5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
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
                                            className="w-full py-4 text-base font-extrabold rounded-2xl bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-brand-red shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] border-0 text-white"
                                        >
                                            🔥 Secure This Room Now
                                        </Button>
                                        <p className="text-center text-xs text-slate-400 mt-3">Token ₹5,000 · No hidden charges · Instant confirmation</p>
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
        </div>
    );
}
