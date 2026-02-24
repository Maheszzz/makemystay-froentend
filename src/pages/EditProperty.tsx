import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyForm } from '@/components/modules/admin/PropertyForm';
import { api } from '@/lib/api/client';
import { RealtyProperty } from '@/types/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function EditProperty() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [property, setProperty] = useState<RealtyProperty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProperty();
        }
    }, [id]);

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const data = await api.get<RealtyProperty>(`/realty/properties/${id}`);
            setProperty(data);
        } catch (err: any) {
            console.error("Failed to fetch property", err);
            setError(err.message || "Failed to load property details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Helmet>
                <title>Edit Property | Admin Dashboard</title>
            </Helmet>

            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900">Edit Property</h1>
                    <p className="text-slate-500 mt-1">Update the information for this listing below.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-brand-red animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading property details...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
                        <Button onClick={fetchProperty}>Retry</Button>
                    </div>
                ) : property ? (
                    <div className="flex justify-center">
                        <PropertyForm
                            onClose={() => navigate('/admin')}
                            onSuccess={() => {
                                // Short delay to show success message in form then navigate
                                setTimeout(() => navigate('/admin'), 2000);
                            }}
                            initialProperty={property}
                        />
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <p className="text-slate-500 font-medium">Property not found.</p>
                        <Button onClick={() => navigate('/admin')} className="mt-4">Back to Dashboard</Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
