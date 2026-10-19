/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface BlockSlotItem {
    startTime: string;
    endTime: string;
}

interface BlockBookingPayload {
    fieldId: string;
    date: string;
    slots: BlockSlotItem[];
}

export async function blockBookingSlots(payload: BlockBookingPayload) {
    try {

        const backendPayload = {
            bookingItems: [
                {
                    fieldId: payload.fieldId,
                    date: payload.date,
                    slots: payload.slots,
                }
            ]
        };

        const response = await serverFetch.post("/booking/block", {
            body: JSON.stringify(backendPayload),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to establish schedule block.");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - blockBookingSlots]:`, error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? error.message
                : "Network error executing schedule block."
        };
    }
}