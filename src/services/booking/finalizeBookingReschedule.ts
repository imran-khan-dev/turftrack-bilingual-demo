/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

interface FinalizeRescheduleParams {
    newBookingId: string;
    cartId: string;
    shouldBypassPayment: boolean;
}

export async function finalizeBookingReschedule(params: FinalizeRescheduleParams) {
    try {
        const { newBookingId, cartId, shouldBypassPayment } = params;

        let response;

        if (shouldBypassPayment) {
            // Path 1: Free, Authority, or Pay Later Bypass
            if (!newBookingId) throw new Error("Missing newBookingId for reschedule bypass confirmation.");
            response = await serverFetch.patch(`/booking/reschedule/${newBookingId}`, {
                headers: { "Content-Type": "application/json" }
            });
        } else {
            // Path 2: Direct Payment Gateway Initialization
            if (!cartId) throw new Error("Missing cartId for payment gate forward route initialization.");
            response = await serverFetch.post(`/make-payment/${cartId}`, {
                headers: { "Content-Type": "application/json" }
            });
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to secure scheduling modifications.");
        }

        revalidateTag("bookings-list", undefined as any);

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - finalizeBookingReschedule]:`, error);
        return {
            success: false,
            message: error.message || "Failed to finalize reschedule operations."
        };
    }
}