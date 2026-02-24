import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Check, Star, Heart, ArrowLeft, Share2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePropertyBySlug } from '@/hooks';
import { paymentApi } from '@/lib/api';

import { ServiceFeeModal, ServiceFeeOption } from '@/components/modals/ServiceFeeModal';
import { ReviewSection } from '@/components/property/ReviewSection';
import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { amenityIconMap } from '@/lib/amenityIcons';


export default function PropertyDetails() {
    const { type, slug } = useParams();
    const navigate = useNavigate();
    const { property, loading, error, refetch } = usePropertyBySlug(type, slug);
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [showServiceFeeModal, setShowServiceFeeModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

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
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(productionUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Error copying to clipboard:', err);
                alert('Failed to copy link to clipboard.');
            }
        }
    };

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/properties');
        }
    };

    const handlePayNow = () => {
        setShowServiceFeeModal(true);
    };

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleServiceFeeProceed = async (option: ServiceFeeOption) => {
        // Close modal first
        setShowServiceFeeModal(false);

        try {
            setIsPaymentProcessing(true);

            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                setIsPaymentProcessing(false);
                return;
            }

            // check env
            const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!key) {
                alert("Error: VITE_RAZORPAY_KEY_ID is missing. Please restart the frontend server.");
                setIsPaymentProcessing(false);
                return;
            }

            // 2. Create Order
            // alert("Creating order..."); 
            const order = await paymentApi.createOrder({
                amount: option.amount * 100, // Convert to paise
                currency: "INR",
                payment_type: "booking",
                payer_name: "Guest User", // Capture actual user details if auth is implemented
                payer_email: "guest@example.com",
                payer_phone: "9999999999"
            });

            // 3. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "MakeMyStay",
                description: `Booking Fee - ${option.label}`,
                image: "https://makemystay.ai/logo.png", // Add logo if available
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        await paymentApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Success!
                        alert("Payment Successful! Your booking is confirmed.");
                        // Redirect to success page or show success modal
                    } catch (error) {
                        console.error("Payment Verification Failed", error);
                        alert("Payment verification failed. Please contact support.");
                    } finally {
                        setIsPaymentProcessing(false);
                    }
                },
                prefill: {
                    name: "Guest User",
                    email: "guest@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#0f172a"
                },
                modal: {
                    ondismiss: function () {
                        setIsPaymentProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(`Payment Failed: ${response.error.description}`);
                setIsPaymentProcessing(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error("Payment Error:", error);
            // Show more detailed error
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
                            <Link to="/properties">
                                <Button variant="primary">Back to Listings</Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Determine hero image - use main image if images array is empty
    const heroImage = (property.images && property.images.length > 0) ? property.images[0] : property.image;

    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            <Navbar />

            <main id="main-content" className="pb-20 flex-grow">
                {/* Hero Gallery */}
                <div className="h-[50vh] md:h-[70vh] relative group overflow-hidden bg-slate-200">
                    {heroImage ? (
                        <img
                            src={heroImage}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <div className="text-center text-slate-400">
                                <div className="text-6xl mb-2">🏠</div>
                                <p className="text-sm font-medium">No image available</p>
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="absolute top-24 left-4 z-20 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 hover:scale-110 transition-all shadow-lg cursor-pointer"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-7xl mx-auto">
                        <div className="animate-fade-in-up">
                            <div className="flex items-center space-x-2 text-white/90 mb-2 font-medium">
                                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold">{property.tag}</span>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Stats Bar */}
                        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">{property.title}</h1>
                                    <div className="text-slate-500 text-sm md:text-base mt-1">{property.type} • {property.location}</div>
                                </div>
                            </div>
                            <div className="flex space-x-3 items-center">
                                {copied && <span className="text-emerald-600 text-sm font-medium animate-fade-in">Link copied!</span>}
                                <button
                                    onClick={handleShare}
                                    className="p-3 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
                                    title="Share property"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`p-3 rounded-full border transition-colors cursor-pointer ${wishlisted
                                        ? 'border-brand-red bg-red-50 text-brand-red'
                                        : 'border-slate-200 hover:bg-red-50 hover:text-brand-red text-slate-600'
                                        }`}
                                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-brand-red' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {/* Description */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">About this home</h3>

                            <div className="text-slate-600 leading-relaxed text-lg space-y-4">
                                {(() => {
                                    // Auto-generate description if missing or too short
                                    const desc = property.description && property.description.length > 50
                                        ? property.description
                                        : `Experience premium living at **${property.title}** in the heart of **${property.location}**. This luxury ${property.type} offers a perfect blend of comfort and convenience, designed for modern professionals and students.\n\nEnjoy a hassle-free lifestyle with top-tier amenities including high-speed WiFi, nutritious food, and daily housekeeping. The property features spacious rooms with ample natural light, ensuring a pleasant stay. Located close to major tech parks and educational institutions, it provides easy access to public transport and local markets.\n\nBook your slot today and upgrade your living experience with MakeMyStay.`;

                                    return desc.split('\n').map((line: string, i: number) => {
                                        if (!line.trim()) return <br key={i} className="hidden" />;
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
                                    });
                                })()}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="text-base font-bold text-slate-900 mb-3">What this place offers</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {(() => {
                                        // Standardize amenities for PGs if features are sparse or user wants consistency
                                        let displayFeatures = property.features || [];
                                        const isPG = property.type === 'PG' || property.type === 'Hostel';

                                        // If it's a PG, ensure we show the standard premium amenities
                                        if (isPG) {
                                            const standardAmenities = [
                                                "High-Speed WiFi", "Nutritious Food", "Daily Housekeeping",
                                                "Power Backup", "24/7 Security", "Washing Machine",
                                                "Refrigerator", "RO Water Purifier"
                                            ];
                                            // Merge unique amenities
                                            const uniqueFeatures = new Set([...displayFeatures, ...standardAmenities]);
                                            displayFeatures = Array.from(uniqueFeatures);
                                        }

                                        // Deduplicate: when a more-specific label is present, drop the generic one.
                                        // Format: [generic (drop this), specific (keep this)]
                                        const duplicatePairs: [string, string][] = [
                                            ['ro water', 'ro water purifier'],
                                            ['wifi', 'high-speed wifi'],
                                            ['wifi', 'wi-fi'],
                                            ['security', '24/7 security'],
                                            ['security', 'cctv security'],
                                            ['housekeeping', 'daily housekeeping'],
                                            ['housekeeping', 'professional housekeeping'],
                                            ['tv', 'smart tv'],
                                            ['parking', 'bike parking'],
                                            ['parking', 'car parking'],
                                            ['kitchen', 'common kitchen'],
                                            ['kitchen', 'shared kitchen'],
                                            ['kitchen', 'modern kitchen'],
                                            ['kitchen', 'fully equipped kitchen'],
                                            ['water purifier', 'ro water purifier'],
                                        ];
                                        const lowerSet = new Set(displayFeatures.map((f: string) => f.toLowerCase()));
                                        const toRemove = new Set<string>();
                                        for (const [generic, specific] of duplicatePairs) {
                                            if (lowerSet.has(generic) && lowerSet.has(specific)) {
                                                toRemove.add(generic);
                                            }
                                        }
                                        if (toRemove.size > 0) {
                                            displayFeatures = displayFeatures.filter((f: string) => !toRemove.has(f.toLowerCase()));
                                        }

                                        return displayFeatures.map((feature: string, idx: number) => {
                                            const icon = amenityIconMap[feature.toLowerCase()] ?? <Check className="w-4 h-4" />;
                                            return (
                                                <div key={idx} className="flex items-center gap-2 text-slate-600 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                        {icon}
                                                    </div>
                                                    <span className="text-xs font-medium leading-tight">{feature}</span>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 mt-8">
                            <ReviewSection
                                propertyId={property.id}
                                initialReviews={property.reviews_list || []}
                                onReviewAdded={refetch}
                            />
                        </div>
                    </div>

                    {/* Booking Widget (Sticky) */}
                    <div className="relative">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-5 md:p-8 border border-slate-100 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-3">
                                    <div>
                                        <span className="text-sm text-slate-500 font-medium">Price</span>
                                        <div className="text-3xl font-bold text-slate-900">
                                            {property.price}
                                            {property.category === 'rent' && <span className="text-base font-medium text-slate-400">/mo</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-nowrap items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg">
                                        <Star className="w-4 h-4 text-emerald-500 fill-current shrink-0" />
                                        <span className="font-bold text-slate-900 leading-none whitespace-nowrap">{(property.rating ?? 0) > 0 ? (property.rating ?? 0).toFixed(1) : 'N/A'}</span>
                                        <span className="text-slate-400 leading-none">·</span>
                                        <span className="text-slate-500 text-sm underline leading-none whitespace-nowrap">{property.reviews || 0} reviews</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-sm font-medium text-slate-500">Posted on</div>
                                        <div className="font-bold text-slate-900">{property.postedDate || new Date().toLocaleDateString()}</div>
                                    </div>

                                    <Button
                                        onClick={handlePayNow}
                                        className="w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-emerald-600/20 bg-brand-red hover:bg-brand-red/90 transition-all transform hover:scale-[1.02]"
                                    >
                                        Pay Now
                                    </Button>
                                </div>
                            </div>

                            <Link to="/contact-us" className="bg-slate-900 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl hover:bg-slate-800 transition-colors group">
                                <div>
                                    <div className="font-bold text-lg">Talk to an agent</div>
                                    <div className="text-slate-400 text-sm">Get expert advice instantly</div>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Service Fee Modal */}
            <ServiceFeeModal
                isOpen={showServiceFeeModal}
                onClose={() => setShowServiceFeeModal(false)}
                onProceed={handleServiceFeeProceed}
                propertyType={property.type}
            />

            {/* Payment Processing Overlay */}
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
