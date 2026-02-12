import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MapPin, Check, Star, Share2, Heart, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '@/hooks';

export default function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { property, loading, error, refetch } = useProperty(id || '');

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/properties');
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen font-sans">
                <Navbar />
                <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                    <LoadingSpinner message="Loading property details..." />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="bg-slate-50 min-h-screen font-sans">
                <Navbar />
                <main className="py-32 text-center max-w-7xl mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        <ErrorMessage
                            message={error?.message || "Property Not Found"}
                            detail={error?.detail || "The property you're looking for doesn't exist or there was an error loading it."}
                            onRetry={refetch}
                        />
                        <div className="mt-8">
                            <Link to="/properties">
                                <Button>Back to Listings</Button>
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
        <div className="bg-slate-50 min-h-screen font-sans">
            <Navbar />

            <main className="pb-20">
                {/* Hero Gallery */}
                <div className="h-[50vh] md:h-[70vh] relative group overflow-hidden">
                    <img
                        src={heroImage}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
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
                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {property.location}</span>
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
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url(https://randomuser.me/api/portraits/men/${i + 20}.jpg)`, backgroundSize: 'cover' }}></div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold">+24</div>
                                </div>
                                <div className="text-sm">
                                    <div className="font-bold text-slate-900">Highly Rated</div>
                                    <div className="text-slate-500">Popular among families</div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"><Share2 className="w-5 h-5" /></button>
                                <button className="p-3 rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-500 transition-colors text-slate-600"><Heart className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">About this home</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">{property.description}</p>

                            {property.features && property.features.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h4 className="text-lg font-bold text-slate-900 mb-6">What this place offers</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                        {property.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center text-slate-600 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 shrink-0">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                        <span className="font-bold text-slate-900 leading-none whitespace-nowrap">{property.rating || 4.5}</span>
                                        <span className="text-slate-400 leading-none">·</span>
                                        <span className="text-slate-500 text-sm underline leading-none whitespace-nowrap">{property.reviews || 0} reviews</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-sm font-medium text-slate-500">Posted on</div>
                                        <div className="font-bold text-slate-900">{property.postedDate || new Date().toLocaleDateString()}</div>
                                    </div>

                                    <Button className="w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-emerald-600/20 bg-brand-red hover:bg-brand-red/90 transition-all transform hover:scale-[1.02]">
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
        </div>
    );
}
