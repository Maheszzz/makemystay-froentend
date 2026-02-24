import React, { useState, useRef } from 'react';
import {
    X, Upload, Trash2, Loader2, AlertCircle,
    CheckCircle2, MapPin, Phone, Home, Info,
    Zap, Wifi, Shield, Coffee, Utensils
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api/client';
// Imports updated

import { RealtyProperty } from '@/types/api';

interface PropertyFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialProperty?: RealtyProperty;
}

const AMENITIES = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'power_backup', label: 'Backup', icon: Zap },
    { id: 'housekeeping', label: 'Service', icon: Coffee },
    { id: 'gym', label: 'Gym', icon: Info },
    { id: 'pool', label: 'Pool', icon: Info },
    { id: 'cctv', label: 'Security', icon: Shield },
    { id: 'food', label: 'Food', icon: Utensils },
];

export const PropertyForm: React.FC<PropertyFormProps> = ({ onClose, onSuccess, initialProperty }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const isEdit = !!initialProperty;

    // Form fields
    const [formData, setFormData] = useState({
        property_name: initialProperty?.property_name || '',
        location: initialProperty?.location || '',
        phone: initialProperty?.phone || '',
        property_type: initialProperty?.property_type || '1BHK',
        listing_type: initialProperty?.listing_type || 'rent',
        furnishing: initialProperty?.furnishing || 'semi_furnished',
        description: initialProperty?.description || '',
        private_price: initialProperty?.private_price?.toString() || '',
        single_price: initialProperty?.single_price?.toString() || '',
        double_price: initialProperty?.double_price?.toString() || '',
        triple_price: initialProperty?.triple_price?.toString() || '',
        starting_price: initialProperty?.starting_price?.toString() || '',
        is_available: initialProperty?.is_available ?? true,
        features: initialProperty?.features || [] as string[],
    });

    // Image upload state
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<{ url: string, key: string }[]>(
        initialProperty?.images?.map(img => ({ url: img.image_url, key: '' })) || []
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const toggleAmenity = (id: string) => {
        setFormData(prev => {
            const features = prev.features.includes(id)
                ? prev.features.filter(f => f !== id)
                : [...prev.features, id];
            return { ...prev, features };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // 1. Get presigned URL
                const { upload_url, file_key } = await api.post<any>('/uploads/presigned-url', {
                    filename: file.name,
                    content_type: file.type
                });

                // 2. Upload to S3
                await fetch(upload_url, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type }
                });

                // 3. Track uploaded image (using public URL if possible, otherwise key)
                // For now we'll store the key and assume backend handles signing or public access
                const publicUrl = `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.amazonaws.com/${file_key}`;
                setUploadedImages(prev => [...prev, { url: publicUrl, key: file_key }]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let propertyId = initialProperty?.id;

            if (isEdit && propertyId) {
                // 1. Update Property
                await api.put(`/realty/properties/${propertyId}`, {
                    ...formData,
                    private_price: formData.private_price !== '' ? parseFloat(formData.private_price) : null,
                    single_price: formData.single_price !== '' ? parseFloat(formData.single_price) : null,
                    double_price: formData.double_price !== '' ? parseFloat(formData.double_price) : null,
                    triple_price: formData.triple_price !== '' ? parseFloat(formData.triple_price) : null,
                    starting_price: formData.starting_price !== '' ? parseFloat(formData.starting_price) : null,
                });

                // Note: Image management is complex. For now, we only add new ones or rely on the fact
                // that they are already in the uploadedImages state.
                // A better implementation would sync the images table with uploadedImages.
            } else {
                // 1. Create Property
                const property = await api.post<any>('/realty/properties', {
                    ...formData,
                    private_price: formData.private_price !== '' ? parseFloat(formData.private_price) : null,
                    single_price: formData.single_price !== '' ? parseFloat(formData.single_price) : null,
                    double_price: formData.double_price !== '' ? parseFloat(formData.double_price) : null,
                    triple_price: formData.triple_price !== '' ? parseFloat(formData.triple_price) : null,
                    starting_price: formData.starting_price !== '' ? parseFloat(formData.starting_price) : null,
                });
                propertyId = property.id;
            }

            // 2. Add Images (only new ones for edit, all for create)
            // For simplicity, we'll only add images that have a 'key' (meaning they were just uploaded)
            for (let i = 0; i < uploadedImages.length; i++) {
                if (uploadedImages[i].key) {
                    await api.post(`/realty/properties/${propertyId}/images`, {
                        image_url: uploadedImages[i].url,
                        is_primary: i === 0 && !isEdit, // Only set primary if it's new
                        sort_order: i
                    });
                }
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative z-10">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
                    <p className="text-sm text-slate-500">{isEdit ? 'Update details for this property' : 'Fill in the details to list a new property'}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-600">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <p className="text-sm">Property {isEdit ? 'updated' : 'created'} successfully!</p>
                    </div>
                )}

                {/* Basic Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Property Name / Title</label>
                        <div className="relative">
                            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                name="property_name"
                                value={formData.property_name}
                                onChange={handleInputChange}
                                placeholder="e.g. Luxury 1BHK in HSR Layout"
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Location / Area</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g. Sector 2, HSR Layout"
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Contact Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 81500 99911"
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Types Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Property Type</label>
                        <select
                            name="property_type"
                            value={formData.property_type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-brand-red/20"
                        >
                            <option value="PG">PG / Hostel</option>
                            <option value="1RK">1 RK</option>
                            <option value="1BHK">1 BHK</option>
                            <option value="2BHK">2 BHK</option>
                            <option value="3BHK">3 BHK</option>
                            <option value="Villa">Villa</option>
                            <option value="Plot">Plot</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
                        <select
                            name="listing_type"
                            value={formData.listing_type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-brand-red/20"
                        >
                            <option value="rent">For Rent</option>
                            <option value="buy">For Buy / Sale</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Furnishing</label>
                        <select
                            name="furnishing"
                            value={formData.furnishing}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-brand-red/20"
                        >
                            <option value="semi_furnished">Semi Furnished</option>
                            <option value="fully_furnished">Fully Furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                        </select>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-red pl-4">Pricing Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Private (for 1BHK/ Villa)</label>
                            <input name="private_price" type="number" value={formData.private_price} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Single Sharing</label>
                            <input name="single_price" type="number" value={formData.single_price} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Double Sharing</label>
                            <input name="double_price" type="number" value={formData.double_price} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Base/Starting Price</label>
                            <input name="starting_price" type="number" value={formData.starting_price} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50" />
                        </div>
                    </div>
                </div>

                {/* Description & Features */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Tell users more about this property..."
                            className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Amenities / Features</label>
                        <div className="flex flex-wrap gap-2">
                            {AMENITIES.map((amenity) => (
                                <button
                                    key={amenity.id}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${formData.features.includes(amenity.id)
                                        ? 'bg-brand-red/10 border-brand-red text-brand-red'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    <amenity.icon className="w-4 h-4" /> {amenity.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-red pl-4">Property Images</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {idx === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-brand-red text-white text-[10px] font-bold py-1 text-center">
                                        PRIMARY
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-brand-red/40 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            {uploading ? (
                                <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload</span>
                                </>
                            )}
                        </button>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    <p className="text-[10px] text-slate-400 text-center italic">First image will be used as the main cover photo.</p>
                </div>

                {/* Sticky Footer for Form */}
                <div className="sticky bottom-0 bg-white pt-4 pb-2">
                    <Button
                        type="submit"
                        className="w-full py-4 rounded-2xl text-base font-bold shadow-glow"
                        disabled={loading || uploading || !formData.property_name || uploadedImages.length === 0}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" /> {isEdit ? 'Updating...' : 'Saving...'}
                            </span>
                        ) : (isEdit ? "Update Listing" : "Publish Listing")}
                    </Button>
                </div>
            </form>
        </div>
    );
};
