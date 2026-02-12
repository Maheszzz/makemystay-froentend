import axios from 'axios';
import { api } from './client';

export interface UploadResponse {
    upload_url: string;
    file_key: string;
}

/**
 * Request a presigned URL from the backend
 */
export const getPresignedUrl = async (file: File): Promise<UploadResponse> => {
    return api.post<UploadResponse>('/uploads/presigned-url', {
        filename: file.name,
        content_type: file.type,
    });
};

/**
 * Upload the file directly to S3 using the presigned URL
 */
export const uploadToS3 = async (uploadUrl: string, file: File): Promise<void> => {
    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};
