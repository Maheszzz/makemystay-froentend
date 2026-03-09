import { api } from './client';

export interface CreateOrderRequest {
    amount: number;
    currency?: string;
    payment_type?: string;
    payer_name?: string;
    payer_email?: string;
    payer_phone?: string;
}

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: any[];
    created_at: number;
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export const paymentApi = {
    createOrder: async (data: CreateOrderRequest): Promise<RazorpayOrder> => {
        return await api.post<RazorpayOrder>('/payments/create-order', data);
    },

    verifyPayment: async (data: VerifyPaymentRequest): Promise<{ status: string; payment_id: string }> => {
        return await api.post<{ status: string; payment_id: string }>('/payments/verify', data);
    },

    getReceiptUrl: (paymentId: string): string => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
        return `${baseUrl}/payments/receipt/${paymentId}`;
    }
};
