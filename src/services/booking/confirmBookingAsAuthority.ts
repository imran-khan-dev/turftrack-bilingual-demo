/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function confirmBookingAsAuthority(cartId: string) {
    try {
        if (!cartId) {
            throw new Error("Active Cart ID is required for authority confirmation.");
        }

        const response = await serverFetch.patch(`/booking/${cartId}/confirm-as-authority`, {
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Booking confirmation failed.");
        }

        revalidateTag("bookings-list", undefined as any);

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - confirmBookingAsAuthority]:`, error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' 
                ? error.message 
                : "An error occurred during confirmation."
        };
    }
}