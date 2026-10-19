/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function bookPayLater(cartId: string): Promise<ActionResponse<any>> {
    try {
        if (!cartId) {
            throw new Error("Missing structural booking allocation target reference (cartId).");
        }

        const response = await serverFetch.post(`/booking/${cartId}/book-pay-later`, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
            throw new Error(result.message || "Failed to process deferred checkout request.");
        }

        return {
            success: true,
            data: result
        };

    } catch (error: any) {
        console.error(`[Service Error - bookPayLater]:`, error);
        return {
            success: false,
            error: error.message || "Network layer exception committing payment confirmation state."
        };
    }
}