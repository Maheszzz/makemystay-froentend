import { useState, FormEvent } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { contactApi } from '@/lib/api';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        location: '',
        property_type: '',
        units: '',
        current_occupancy: '',
        monthly_revenue: '',
        uses_brokers: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (formData.phone.length < 10) {
            setError('Phone number must be at least 10 digits');
            setLoading(false);
            return;
        }

        try {
            // Submit to backend API
            const submissionData = {
                ...formData
            };
            await contactApi.submitContactForm(submissionData);

            // Fire Google Ads conversion event for "Submit lead form"
            if (typeof (window as any).gtag_report_conversion === 'function') {
                (window as any).gtag_report_conversion();
            }

            // Success!
            setSuccess(true);
            setFormData({ name: '', phone: '', email: '', location: '', property_type: '', units: '', current_occupancy: '', monthly_revenue: '', uses_brokers: '', message: '' });

            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Navbar />

            <main>
                {/* Hero Section */}
                <div className="pt-28 md:pt-32 pb-16 md:pb-20 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-b from-emerald-50/50 to-transparent blur-3xl opacity-50" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/8 text-brand-red text-sm font-medium mb-6 border border-brand-red/15">
                            <span className="flex h-2 w-2 rounded-full bg-brand-red animate-pulse"></span>
                            <span>Growth Team Available Now</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Let's Grow Your<br className="hidden sm:block" /> Rental Business
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Tell us about your property — we'll show you exactly how to increase occupancy and cut broker dependency.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-5 md:space-y-6">
                            <div className="bg-white p-7 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(177,18,38,0.08)' }}>
                                    <Phone className="w-6 h-6" style={{ color: '#B11226' }} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Talk to Growth Team</h3>
                                <p className="text-slate-500 text-sm mb-4">Available 7 days a week, Mon–Sun</p>
                                <a href="tel:+919844594800" className="text-base font-semibold hover:underline" style={{ color: '#B11226' }}>+91 98445 94800</a>
                            </div>

                            <div className="bg-white p-7 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Business Inquiries</h3>
                                <p className="text-slate-500 text-sm mb-4">We respond within 4 business hours.</p>
                                <a href="mailto:connect@makemystay.ai" className="text-base font-semibold text-blue-600 hover:text-blue-700 block">connect@makemystay.ai</a>
                            </div>

                            <div className="bg-white p-7 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-5">
                                    <MapPin className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Bangalore HQ</h3>
                                <p className="text-slate-500 text-sm mb-4">Come meet the team in person.</p>
                                <a
                                    href="https://www.google.com/maps/search/1142,+6th+Main+Rd,+7th+Sector,+HSR+Layout,+Bengaluru,+Karnataka+560102"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors block"
                                >
                                    1142, 6th Main Rd, 7th Sector, <br />
                                    HSR Layout, Bengaluru,<br />
                                    Karnataka 560102
                                </a>
                                <span className="inline-flex items-center gap-1 mt-2 text-xs text-slate-400">
                                    <MapPin className="w-3 h-3" /> Opens in Google Maps
                                </span>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Get Your Growth Plan</h2>
                                <p className="text-slate-500 text-sm mb-7">Fill in a few details — our team builds a custom occupancy strategy for you.</p>

                                {/* Success Message */}
                                {success && (
                                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-emerald-900">Submitted! We'll reach out within 4 hours.</p>
                                            <p className="text-sm text-emerald-700 mt-1">Your growth plan is being prepared.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-red-900">Failed to send message</p>
                                            <p className="text-sm text-red-700 mt-1">{error}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Row 1: Name + Phone */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="name" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
                                            <input type="text" id="name" value={formData.name} onChange={handleChange} required
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none"
                                                placeholder="Your name" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Phone Number</label>
                                            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none"
                                                placeholder="+91 XXXXX XXXXX" />
                                        </div>
                                    </div>

                                    {/* Row 2: Email */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Business Email</label>
                                        <input type="email" id="email" value={formData.email} onChange={handleChange} required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none"
                                            placeholder="you@company.com" />
                                    </div>

                                    {/* Row 3: Location + Property Type */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="location" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Property Location</label>
                                            <select id="location" value={formData.location} onChange={handleChange} required
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                                                <option value="" disabled>Select Area</option>
                                                <option value="Aecs layout">Aecs Layout</option>
                                                <option value="Bellandur">Bellandur</option>
                                                <option value="Bommasandra">Bommasandra</option>
                                                <option value="Brookfield">Brookfield</option>
                                                <option value="BTM">BTM</option>
                                                <option value="Doddanekkundi">Doddanekkundi</option>
                                                <option value="Hsr layout">HSR Layout</option>
                                                <option value="Indiranagar">Indiranagar</option>
                                                <option value="Kadubeesanahalli">Kadubeesanahalli</option>
                                                <option value="Koramangala">Koramangala</option>
                                                <option value="Kundalahalli">Kundalahalli</option>
                                                <option value="Mahadevapura">Mahadevapura</option>
                                                <option value="Marathahalli">Marathahalli</option>
                                                <option value="Munnekollal">Munnekollal</option>
                                                <option value="Sarjapur">Sarjapur</option>
                                                <option value="Thubarahalli">Thubarahalli</option>
                                                <option value="Whitefield">Whitefield</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="property_type" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Property Type</label>
                                            <select id="property_type" value={formData.property_type} onChange={handleChange} required
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                                                <option value="" disabled>Select Type</option>
                                                <option value="PG">PG / Hostel</option>
                                                <option value="1RK">1RK</option>
                                                <option value="1BHK">1BHK</option>
                                                <option value="2BHK">2BHK</option>
                                                <option value="3BHK">3BHK</option>
                                                <option value="4BHK">4BHK</option>
                                                <option value="Villa">Villa / Bungalow</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Qualification Fields */}
                                    <div className="pt-2 pb-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Property Details (Helps us tailor your plan)</p>
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label htmlFor="units" className="text-xs font-bold text-slate-600 uppercase tracking-wide">No. of Beds / Units</label>
                                                <select id="units" value={formData.units} onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                                                    <option value="">Select range</option>
                                                    <option value="1-10">1 – 10 beds</option>
                                                    <option value="11-30">11 – 30 beds</option>
                                                    <option value="31-80">31 – 80 beds</option>
                                                    <option value="80+">80+ beds</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="current_occupancy" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Current Occupancy %</label>
                                                <select id="current_occupancy" value={formData.current_occupancy} onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                                                    <option value="">Select range</option>
                                                    <option value="below-60">Below 60%</option>
                                                    <option value="60-80">60 – 80%</option>
                                                    <option value="80-95">80 – 95%</option>
                                                    <option value="above-95">Above 95%</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="monthly_revenue" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Monthly Revenue Range</label>
                                                <select id="monthly_revenue" value={formData.monthly_revenue} onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                                                    <option value="">Select range</option>
                                                    <option value="below-1L">Below ₹1 Lakh</option>
                                                    <option value="1-3L">₹1 – 3 Lakhs</option>
                                                    <option value="3-10L">₹3 – 10 Lakhs</option>
                                                    <option value="10L+">Above ₹10 Lakhs</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="uses_brokers" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Currently Using Brokers?</label>
                                                <select id="uses_brokers" value={formData.uses_brokers} onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                                                    <option value="">Select</option>
                                                    <option value="yes">Yes, heavily dependent</option>
                                                    <option value="partially">Partially</option>
                                                    <option value="no">No, self-managed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="message" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Anything else? (Optional)</label>
                                        <textarea id="message" rows={4} value={formData.message} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none resize-none"
                                            placeholder="Share your biggest challenge as a property operator..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 text-base font-bold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70"
                                        style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)', boxShadow: '0 4px 20px rgba(177,18,38,0.3)' }}
                                    >
                                        {loading ? 'Submitting...' : 'Get My Growth Plan'}
                                        <Send className="w-4 h-4" />
                                    </button>
                                    <p className="text-center text-xs text-slate-400">We'll respond within 4 hours. No spam, ever.</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
