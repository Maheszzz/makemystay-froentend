import React, { useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Upload, X, Check, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    onUploadComplete?: (url: string) => void;
    className?: string;
}

export function ImageUploader({ onUploadComplete, className = '' }: ImageUploaderProps) {
    const { uploadImage, uploading, error } = useImageUpload();
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedKey, setUploadedKey] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploadedKey(null);

        // Upload
        const key = await uploadImage(file);

        if (key) {
            setUploadedKey(key);
            // Construct the public URL (assuming the bucket is public or you have a CloudFront/proxy)
            // For private buckets, you'd typically need a signed GET url, but for now let's just pass the key
            if (onUploadComplete) {
                onUploadComplete(key);
            }
        }
    };

    const clearImage = () => {
        setPreview(null);
        setUploadedKey(null);
    };

    return (
        <div className={`w-full max-w-sm ${className}`}>
            <label className={`
                relative flex flex-col items-center justify-center w-full h-64 
                border-2 border-dashed rounded-xl cursor-pointer 
                transition-all duration-300
                ${error ? 'border-red-500 bg-red-50/5' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}
            `}>
                {preview ? (
                    <div className="relative w-full h-full p-2">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={(e) => { e.preventDefault(); clearImage(); }}
                            className="absolute top-3 right-3 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        {/* Status Indicator */}
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm flex items-center gap-2">
                            {uploading ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : uploadedKey ? (
                                <>
                                    <Check size={12} className="text-green-400" />
                                    Uploaded
                                </>
                            ) : (
                                <span>Pending...</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-4 rounded-full bg-slate-700/50 mb-4 text-slate-400">
                            <Upload className="w-8 h-8" />
                        </div>
                        <p className="mb-2 text-sm text-slate-300">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                    </div>
                )}

                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>

            {error && (
                <p className="mt-2 text-sm text-red-400 text-center">
                    {error}
                </p>
            )}
        </div>
    );
}
