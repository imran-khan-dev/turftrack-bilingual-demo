/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function togglePromoStatus(id: string): Promise<ActionResponse<any>> {
    try {
        if (!id) {
            throw new Error("Missing promo code reference (id).");
        }

        const response = await serverFetch.patch(`/discount/toggle-promo-code/${id}`, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
            throw new Error(result.message || "Failed to toggle discount status.");
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