import { useState } from 'react';
import { getPresignedUrl, uploadToS3 } from '@/lib/api/upload';

interface UseImageUploadResult {
    uploading: boolean;
    error: string | null;
    uploadImage: (file: File) => Promise<string | null>; // Returns file_key on success
}

export const useImageUpload = (): UseImageUploadResult => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File): Promise<string | null> => {
        setUploading(true);
        setError(null);

        try {
            // 1. Get Presigned URL
            const { upload_url, file_key } = await getPresignedUrl(file);

            // 2. Upload to S3
            await uploadToS3(upload_url, file);

            return file_key;
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.message || "Failed to upload image");
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploading, error, uploadImage };
};
