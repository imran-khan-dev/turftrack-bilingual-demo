/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function getBookingDetails(bookingId: string) {
    try {
        if (!bookingId) throw new Error("Booking ID is required.");

        const response = await serverFetch.get(`/booking/${bookingId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not validate original booking resource context.");
        }

        const baseBooking = result.data;
        if (!baseBooking) {
            throw new Error("Booking record parsing failure.");
        }

        // if (baseBooking.status === "CANCELLED") {
        //     throw new Error("Cancelled bookings cannot be rescheduled.");
        // }

        return {
            success: true,
            data: baseBooking
        };

    } catch (error: any) {
        console.error(`[Service Error - getBookingDetails]:`, error);
        return {
            success: false,
            message: error.message || "Failed to retrieve booking information."
        };
    }
}