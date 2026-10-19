/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function settleOverpaidRefund(bookingId: string): Promise<ActionResponse<any>> {

    try {
        const response = await serverFetch.patch(`/booking/${bookingId}/settle-overpaid-refund`, {});
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Backend rejected operation.");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - settleOverpaidRefund]:`, error);
        return {
            success: false,
            error: process.env.NODE_ENV === "development"
                ? error.message
                : "Failed to finalize overpayment settlement."
        };
    }
}