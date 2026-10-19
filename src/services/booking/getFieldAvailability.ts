/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface GetFieldAvailabilityParams {
    fieldId: string;
    date: string;
}

export async function getFieldAvailability({ fieldId, date }: GetFieldAvailabilityParams) {

    try {
        if (!fieldId) throw new Error("Field ID is required to fetch availability.");

        const endpoint = `/field/${fieldId}/availability?date=${encodeURIComponent(date)}`;

        const response = await serverFetch.get(endpoint, {
            // next: {
            //     // Cache availability temporarily
            //     revalidate: 30,
            //     tags: [`field-availability-${fieldId}`, `field-availability-${fieldId}-${date}`]
            // }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to retrieve slot availability details.");
        }

        return {
            success: true,
            data: result.data?.slots || []
        };

    } catch (error: any) {
        console.error(`[Service Error - getFieldAvailability]:`, error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? error.message
                : "Failed to parse slot availability."
        };
    }
}