/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function validateReLockBooking(cartId: string): Promise<ActionResponse<any>> {
    try {
        if (!cartId) {
            throw new Error("Missing structural allocation reference (cartId).");
        }

        const response = await serverFetch.patch(`/booking/validate-re-lock/${cartId}`, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
            throw new Error(result.message || "Your booking slot session has expired or could not be re-locked.");
        }

        return {
            success: true,
            data: result
        };

    } catch (error: any) {
        console.error(`[Service Error - validateReLockBooking]:`, error);
        return {
            success: false,
            error: error.message || "Failed to renew timeslot validation boundaries."
        };
    }
}