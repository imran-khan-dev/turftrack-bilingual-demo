/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    result?: any
    
}

interface UpdatePhoneParams {
    purpose: string;
    number: string;
}

export async function updatePendingPhone({
    purpose,
    number,
}: UpdatePhoneParams): Promise<ActionResponse<any>> {
    try {
        const cleanNumber = number.trim();

        if (!cleanNumber || cleanNumber.length < 11) {
            throw new Error("Please enter a valid phone number.");
        }

        const payload: Record<string, any> = { purpose, number: cleanNumber };


        const response = await serverFetch.patch("/auth/update-pending-phones", {
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "Failed to update number.");
        }

        return {
            success: true,
            data: response,
            result: result
        };

    } catch (error: any) {
        console.error(`[Service Error - updatePendingPhone]:`, error);
        return {
            success: false,
            error: error.message || "Something went wrong. Please try again."
        };
    }
}