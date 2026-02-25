import React, { useState, useRef } from 'react';
import {
    X, Upload, Trash2, Loader2, AlertCircle,
    CheckCircle2, MapPin, Phone, Home, Info,
    Zap, Wifi, Coffee, Utensils,
    Dumbbell, Waves, Wind, ArrowUpDown, SquareParking, Bike,
    ShieldCheck, Cctv, Tv, AirVent, Thermometer,
    WashingMachine, Shirt, BookOpen, Laptop, Archive, Armchair,
    Mountain, Wrench, Sparkles, Trees, Heart, Users, ChefHat
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api/client';
// Imports updated

import { RealtyProperty } from '@/types/api';

interface PropertyFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialProperty?: RealtyProperty;
    pageMode?: boolean;
}

const AMENITY_GROUPS = [
    {
        group: 'Connectivity',
        items: [
            { id: 'wifi', label: 'WiFi', icon: Wifi },
            { id: 'power_backup', label: 'Power Backup', icon: Zap },
        ],
    },
    {
        group: 'Food',
        items: [
            { id: 'food', label: 'Food Included', icon: Utensils },
            { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
            { id: 'in-house cafeteria', label: 'Cafeteria', icon: Coffee },
        ],
    },
    {
        group: 'Safety & Security',
        items: [
            { id: 'cctv', label: 'CCTV', icon: Cctv },
            { id: 'security', label: '24/7 Security', icon: ShieldCheck },
            { id: 'fingerprint', label: 'Biometric Access', icon: ShieldCheck },
        ],
    },
    {
        group: 'Appliances',
        items: [
            { id: 'ac', label: 'Air Conditioning', icon: AirVent },
            { id: 'geyser', label: 'Geyser', icon: Thermometer },
            { id: 'tv', label: 'TV', icon: Tv },
            { id: 'refrigerator', label: 'Fridge', icon: Info },
            { id: 'washing machine', label: 'Washing Machine', icon: WashingMachine },
        ],
    },
    {
        group: 'Laundry',
        items: [
            { id: 'laundry', label: 'Laundry Service', icon: Shirt },
        ],
    },
    {
        group: 'Parking',
        items: [
            { id: 'parking', label: 'Car Parking', icon: SquareParking },
            { id: 'bike parking', label: 'Bike Parking', icon: Bike },
        ],
    },
    {
        group: 'Fitness & Recreation',
        items: [
            { id: 'gym', label: 'Gym', icon: Dumbbell },
            { id: 'pool', label: 'Swimming Pool', icon: Waves },
        ],
    },
    {
        group: 'Common Areas',
        items: [
            { id: 'lounge', label: 'Lounge', icon: Coffee },
            { id: 'garden', label: 'Garden', icon: Trees },
            { id: 'balcony', label: 'Balcony', icon: Wind },
            { id: 'terrace', label: 'Terrace', icon: Mountain },
            { id: 'lift', label: 'Lift', icon: ArrowUpDown },
            { id: 'common kitchen', label: 'Common Kitchen', icon: ChefHat },
        ],
    },
    {
        group: 'Room Features',
        items: [
            { id: 'attached bathroom', label: 'Attached Bathroom', icon: Home },
            { id: 'cupboards', label: 'Cupboards', icon: Archive },
            { id: 'furniture', label: 'Furnished', icon: Armchair },
        ],
    },
    {
        group: 'Study & Work',
        items: [
            { id: 'study table', label: 'Study Table', icon: BookOpen },
            { id: 'work desk', label: 'Work Desk', icon: Laptop },
        ],
    },
    {
        group: 'Extras',
        items: [
            { id: 'couple friendly', label: 'Couple Friendly', icon: Heart },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'community', label: 'Community Events', icon: Users },
        ],
    },
];


export const PropertyForm: React.FC<PropertyFormProps> = ({ onClose, onSuccess, initialProperty, pageMode = false }) => {
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
    // Store existing images with their DB id so we can delete them from the server
    const [uploadedImages, setUploadedImages] = useState<{ url: string, key: string, id?: number }[]>(
        initialProperty?.images?.map(img => ({ url: img.image_url, key: '', id: img.id })) || []
    );
    // Track which existing DB image IDs the user has removed
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
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
                const { upload_url, file_key, public_url } = await api.post<any>('/uploads/presigned-url', {
                    filename: file.name,
                    content_type: file.type
                });

                // 2. Upload to S3
                await fetch(upload_url, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type }
                });

                // 3. Track uploaded image using the public URL returned by the backend
                console.log("Backend returned presigned URL details:", { upload_url, file_key, public_url });
                setUploadedImages(prev => [...prev, { url: public_url, key: file_key }]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const img = uploadedImages[index];
        // If this image has a DB id, queue it for deletion on submit
        if (img.id) {
            setDeletedImageIds(prev => [...prev, img.id!]);
        }
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let propertyId = initialProperty?.id;

            let cleanedPhone = formData.phone;
            if (cleanedPhone && cleanedPhone.length === 9) {
                cleanedPhone = '0' + cleanedPhone;
            }

            const cleanPayload = {
                ...formData,
                phone: cleanedPhone || null,
                description: formData.description || null,
                private_price: formData.private_price !== '' ? parseFloat(formData.private_price) : null,
                single_price: formData.single_price !== '' ? parseFloat(formData.single_price) : null,
                double_price: formData.double_price !== '' ? parseFloat(formData.double_price) : null,
                triple_price: formData.triple_price !== '' ? parseFloat(formData.triple_price) : null,
                starting_price: formData.starting_price !== '' ? parseFloat(formData.starting_price) : null,
            };

            if (isEdit && propertyId) {
                // 1. Update property fields
                await api.put(`/realty/properties/${propertyId}`, cleanPayload);

                // 2. Delete images the user removed
                for (const imgId of deletedImageIds) {
                    try {
                        await api.delete(`/realty/images/${imgId}`);
                    } catch (e) {
                        console.warn(`Failed to delete image ${imgId}`, e);
                    }
                }
                // Clear the deleted list after processing
                setDeletedImageIds([]);
            } else {
                // 1. Create Property
                const property = await api.post<any>('/realty/properties', cleanPayload);
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
            console.error(err);

            let errorMessage = 'Failed to save property';
            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                if (typeof detail === 'string') {
                    errorMessage = detail;
                } else if (Array.isArray(detail)) {
                    errorMessage = detail[0]?.msg || 'Validation error, please try again.';
                } else {
                    errorMessage = 'Validation error, please try again.';
                }
            } else if (err.message) {
                if (typeof err.message === 'string') {
                    errorMessage = err.message;
                } else if (Array.isArray(err.message)) {
                    errorMessage = err.message[0]?.msg || 'Validation failed. Please check inputs.';
                }
            } else if (err.detail) {
                if (typeof err.detail === 'string') {
                    errorMessage = err.detail;
                } else if (Array.isArray(err.detail)) {
                    errorMessage = err.detail[0]?.msg || 'Validation failed. Please check inputs.';
                }
            }

            // Absolute catch-all to prevent React component crashing from objects as children
            if (typeof errorMessage !== 'string') {
                try {
                    errorMessage = JSON.stringify(errorMessage);
                } catch (e) {
                    errorMessage = 'An unknown validation error occurred.';
                }
            }

            // Absolute catch-all to prevent React component crashing from objects as children
            if (typeof errorMessage !== 'string') {
                try {
                    errorMessage = JSON.stringify(errorMessage);
                } catch (e) {
                    errorMessage = 'An unknown validation error occurred.';
                }
            }

            setError(errorMessage);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={pageMode ? 'w-full' : 'bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative z-10'}>
            {/* Header — only rendered in modal mode */}
            {!pageMode && (
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
                        <p className="text-sm text-slate-500">{isEdit ? 'Update details for this property' : 'Fill in the details to list a new property'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className={pageMode ? 'space-y-8' : 'flex-grow overflow-y-auto p-8 space-y-8'}>
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
                                minLength={10}
                                maxLength={15}
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

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Amenities / Features</label>
                        <div className="space-y-4">
                            {AMENITY_GROUPS.map((group) => (
                                <div key={group.group}>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{group.group}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((amenity) => (
                                            <button
                                                key={amenity.id}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity.id)}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${formData.features.includes(amenity.id)
                                                    ? 'bg-brand-red/10 border-brand-red text-brand-red shadow-sm'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                                    }`}
                                            >
                                                <amenity.icon className="w-3.5 h-3.5" /> {amenity.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
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

                {/* Submit */}
                <div className={pageMode ? 'pt-4' : 'sticky bottom-0 bg-white pt-4 pb-2'}>
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
