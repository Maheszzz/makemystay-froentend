import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

/** Public site hostnames that serve this SPA (www vs apex are different browser origins). */
const SAME_BRAND_SITE_HOSTS = new Set(['makemystay.ai', 'www.makemystay.ai']);

/**
 * Resolve API base URL.
 * On makemystay.ai / www we always use relative `/api/v1` so requests stay same-origin even if
 * an old build baked in `https://www...` vs apex — cross-origin + CORS caused pending requests
 * and "Provisional headers" in DevTools. Other hosts still use env / fallbacks.
 */
function resolveApiBaseUrl(): string {
    const raw = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
    if (import.meta.env.DEV) {
        return raw || 'http://localhost:8000/api/v1';
    }
    if (typeof window !== 'undefined') {
        const pageHost = window.location.hostname;
        if (SAME_BRAND_SITE_HOSTS.has(pageHost)) {
            return '/api/v1';
        }
    }
    if (!raw) {
        return typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1';
    }
    const normalized = raw.replace(/\/+$/, '');
    if (typeof window === 'undefined') return normalized;
    try {
        const envUrl = normalized.startsWith('http')
            ? new URL(normalized)
            : new URL(normalized, window.location.origin);
        const pageHost = new URL(window.location.origin).hostname;
        if (envUrl.origin === window.location.origin) return normalized;
        if (
            SAME_BRAND_SITE_HOSTS.has(envUrl.hostname) &&
            SAME_BRAND_SITE_HOSTS.has(pageHost)
        ) {
            return `${window.location.origin}/api/v1`;
        }
        return normalized;
    } catch {
        return normalized;
    }
}

/** Prefer VITE_API_BASE_URL; VITE_API_URL kept for older .env / README compatibility. */
export const API_BASE_URL = resolveApiBaseUrl();

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL || undefined,
    headers: {
        'Content-Type': 'application/json',
    },
    // Payment + DB calls can take a moment on cold start.
    // Keep this long enough to avoid classifying slow backend as "no response".
    timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth tokens if needed in the future
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        const apiError: ApiError = {
            message: 'An error occurred',
            status: error.response?.status || 500,
            detail: error.message,
        };

        if (error.response) {
            // Server responded with error status
            const data = error.response.data as any;

            // Extract a clean string message, handling FastAPI's 422 array of validation details
            let parsedDetail = data?.detail || error.message;
            if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
                parsedDetail = data.detail[0].msg;
            } else if (Array.isArray(data?.message) && data.message[0]?.msg) {
                parsedDetail = data.message[0].msg;
            }

            apiError.message = typeof data?.message === 'string' ? data.message : parsedDetail;
            apiError.detail = parsedDetail;
        } else if (error.request) {
            // Request made but no response received (or we hit a timeout)
            if (error.code === 'ECONNABORTED') {
                apiError.message = 'Request timed out while waiting for backend.';
                apiError.detail =
                    'Backend may be slow or blocked (often due to DB connectivity). Check backend logs.';
            } else {
                apiError.message = 'No response from server. Please check if the backend is running.';
                apiError.detail = 'Network error or server is not responding';
            }
        }

        console.error('API Error:', apiError);
        return Promise.reject(apiError);
    }
);

// Generic API request wrapper with type safety
export async function apiRequest<T>(
    config: AxiosRequestConfig
): Promise<T> {
    const response = await apiClient.request<T>(config);
    return response.data;
}

// Convenience methods
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'GET', url }),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'POST', url, data }),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'PUT', url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'DELETE', url }),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'PATCH', url, data }),
};

export default apiClient;
