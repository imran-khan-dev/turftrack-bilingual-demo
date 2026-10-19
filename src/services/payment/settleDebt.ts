/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function settleDebt(businessId: string): Promise<ActionResponse<any>> {

    try {
        if (!businessId) {
            throw new Error("Business context reference missing.");
        }
        const paymentMethod =
            process.env.PAYMENT_METHOD || "ziniPay";


        const response = await serverFetch.post(`/payment/${businessId}/settle-owner-debt?method=${paymentMethod}`, {});
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Backend rejected operation.");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - settleDebt]:`, error);
        return {
            success: false,
            error: process.env.NODE_ENV === "development"
                ? error.message
                : "Failed to generate debt settlement payment link."
        };
    }
}