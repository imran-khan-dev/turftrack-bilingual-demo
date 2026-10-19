/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface RescheduleBookingParams {
    businessId: string;
    fieldId: string;
    bookingId: string;
    date: string;
    slot: { startTime: string; endTime: string };
    manualPlayerPhone?: string;
    manualPlayerName?: string;
}

export async function createBookingReschedule(params: RescheduleBookingParams) {
    try {
        const { businessId, fieldId, bookingId, date, slot, manualPlayerPhone, manualPlayerName } = params;

        if (!businessId || !fieldId || !bookingId) {
            throw new Error("Missing required path routing identifiers.");
        }

        const bodyPayload: Record<string, any> = {
            date,
            slot,
            ...(manualPlayerPhone && { manualPlayerPhone }),
            ...(manualPlayerName && { manualPlayerName }),
        };

        const response = await serverFetch.post(
            `/booking/${businessId}/fields/${fieldId}/bookings/${bookingId}/reschedule`,
            {
                body: JSON.stringify(bodyPayload),
                headers: { "Content-Type": "application/json" }
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Target time segment became unavailable.");
        }

        return {
            success: true,
            data: result.data?.result || result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - createBookingReschedule]:`, error);
        return {
            success: false,
            message: error.message || "Processing sequence transaction error."
        };
    }
}