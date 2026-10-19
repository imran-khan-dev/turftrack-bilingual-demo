/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}


export async function pendingBookingDelete(bookingId: string): Promise<ActionResponse<any>> {
    try {
        if (!bookingId) {
            throw new Error("Missing structural cancellation target reference (bookingId).");
        }

        const response = await serverFetch.delete(`/booking/${bookingId}/pending-delete`, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "Failed to terminate pending booking delete.");
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