/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}


export async function cancelPendingBooking(cartId: string): Promise<ActionResponse<any>> {
    try {
        if (!cartId) {
            throw new Error("Missing structural cancellation target reference (cartId).");
        }

        const response = await serverFetch.patch(`/booking/${cartId}/cancel-pending`, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "Failed to terminate pending booking allocation.");
        }

        return {
            success: true,
            data: result
        };

    } catch (error: any) {
        console.error(`[Service Error - cancelPendingBooking]:`, error);
        return {
            success: false,
            error: error.message || "Network threshold timeout modifying reservation states."
        };
    }
}