/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface CheckoutCalculationsParams {
    cartId?: string;
    newBookingId?: string;
    promoCode?: string;
}

export async function bookingCheckoutCalculate(params: CheckoutCalculationsParams) {
    try {
        const { cartId, newBookingId, promoCode } = params;

        if (!cartId && !newBookingId) {
            throw new Error("Either cartId or newBookingId must be provided for checkout calculations.");
        }

        const payload: Record<string, any> = {
            ...(cartId && { cartId }),
            ...(newBookingId && { newBookingId }),
            ...(promoCode ? { promoCode } : { promoCode: undefined })
        };

        const response = await serverFetch.post("/booking/calculate-checkout", {
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to compute checkout pricing values.");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - fetchCheckoutCalculations]:`, error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? error.message
                : "Failed to update booking total pricing calculations."
        };
    }
}