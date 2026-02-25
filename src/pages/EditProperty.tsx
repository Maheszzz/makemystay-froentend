import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyForm } from '@/components/modules/admin/PropertyForm';
import { api } from '@/lib/api/client';
import { RealtyProperty } from '@/types/api';
import { Loader2, ArrowLeft, Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditProperty() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [property, setProperty] = useState<RealtyProperty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const data = await api.get<RealtyProperty>(`/realty/properties/${id}`);
            setProperty(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load property details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)' }}>
            <Helmet><title>{property ? `Edit — ${property.property_name}` : 'Edit Property'} | Admin</title></Helmet>
            <Navbar />

            <main className="flex-grow pt-28 pb-20">
                {/* Page Header Banner */}
                <div className="bg-white border-b border-slate-100 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
                        <button
                            onClick={() => navigate('/admin')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-red transition-colors mb-5 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Dashboard
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center shadow-lg shadow-brand-red/25 flex-shrink-0">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Edit Property</h1>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    {property ? property.property_name : 'Loading property details…'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
                    {loading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-28 gap-4">
                            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
                            </div>
                            <p className="text-slate-500 font-medium">Loading property details…</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-red-100 shadow-sm p-12 text-center">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-400" />
                            </div>
                            <p className="text-slate-800 font-bold text-lg mb-2">Failed to load property</p>
                            <p className="text-slate-400 text-sm mb-6">{error}</p>
                            <button onClick={fetchProperty}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-all">
                                Try Again
                            </button>
                        </motion.div>
                    ) : property ? (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
                            <PropertyForm
                                pageMode
                                onClose={() => navigate('/admin')}
                                onSuccess={() => setTimeout(() => navigate('/admin'), 2000)}
                                initialProperty={property}
                            />
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
                            <p className="text-slate-500 font-medium">Property not found.</p>
                            <button onClick={() => navigate('/admin')}
                                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all">
                                Back to Dashboard
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
