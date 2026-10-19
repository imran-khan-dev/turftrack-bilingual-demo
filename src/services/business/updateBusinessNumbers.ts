/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface UpdateBusinessNumbersParams {
    businessId: string;
    purpose: string;
    number: string;
}

export async function updateBusinessNumbers({
    businessId,
    purpose,
    number,
}: UpdateBusinessNumbersParams): Promise<ActionResponse<any>> {
    try {
        const cleanNumber = number?.trim();

        if (!cleanNumber || cleanNumber.length < 11) {
            return {
                success: false,
                error: "Please enter a valid phone number.",
            };
        }

        if (!businessId || !purpose || !cleanNumber) {
            return {
                success: false,
                error: "Missing required business parameters.",
            };
        }

        const payload = { purpose, number: cleanNumber };

        const response = await serverFetch.patch(`/auth/${businessId}/update-business-numbers`, {
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        // If API returned HTTP 4xx/5xx OR result.success is explicitly false
        if (!response.ok || result.success === false) {
            return {
                success: false,
                error: result?.message || "Failed to update business number.",
                data: result,
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error: any) {
        console.error(`[Service Error - updateBusinessNumbers]:`, error);
        return {
            success: false,
            error: error.message || "Something went wrong. Please try again.",
        };
    }
}