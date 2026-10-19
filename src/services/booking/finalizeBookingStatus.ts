/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function finalizeBookingStatus(id: string, targetStatus: "COMPLETED" | "NO_SHOW") {
    try {
        if (!id) throw new Error("Booking ID identifier is required.");

        const response = await serverFetch.patch(`/booking/${id}/finalize`, {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingStatus: targetStatus }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to finalize database record.");
        }

        revalidateTag("bookings-list", undefined as any);

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - finalizeBookingStatus]:`, error);
        return {
            success: false,
            message: error.message || "Failed to process database mutation transaction."
        };
    }
}