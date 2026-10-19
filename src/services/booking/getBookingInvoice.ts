/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function getBookingInvoice(bookingId: string) {
    try {
        if (!bookingId) {
            throw new Error("Booking ID is required to fetch the invoice.");
        }

        const response = await serverFetch.get(`/booking/${bookingId}/invoice`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch invoice data");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - getBookingInvoice]:`, error);
        return {
            success: false,
            message: error.message || "Something went wrong while retrieving the invoice."
        };
    }
}