/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function releaseBookingSlot(id: string) {
    try {
        const response = await serverFetch.delete(`/booking/${id}/release`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to release the requested slot.");
        }

        // clear cached lists instantly across the app
        revalidateTag("bookings-list", undefined as any);

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - releaseBookingSlot]:`, error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? error.message
                : "An error occurred during slot resource release."
        };
    }
}