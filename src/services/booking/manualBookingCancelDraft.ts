/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function manualBookingCancelDraft(cartId: string) {
    try {
        if (!cartId) throw new Error("Cart ID is required to cancel a draft.");

        const response = await serverFetch.post("/booking/cancel-draft", {
            body: JSON.stringify({ cartId }),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to cancel booking draft.");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - cancelBookingDraft]:`, error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? error.message
                : "Failed to release expired draft slots."
        };
    }
}