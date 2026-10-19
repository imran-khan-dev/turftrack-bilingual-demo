/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface WeeklyPaymentPayload {
    amount: number;
    transactionRef: string;
    note?: string;
}

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function weeklyPayment(
    businessId: string,
    payload: WeeklyPaymentPayload,
): Promise<ActionResponse<any>> {

    try {
        if (!businessId) {
            throw new Error("Business context reference missing.");
        }

        if (!payload?.transactionRef?.trim()) {
            throw new Error("Transaction reference is required.");
        }

        if (!payload?.amount || payload.amount <= 0) {
            throw new Error("Amount must be greater than 0.");
        }

        const response = await serverFetch.post(`/finance/${businessId}/weekly-payment`, {
            body: JSON.stringify({
                amount: payload.amount,
                transactionRef: payload.transactionRef.trim(),
                note: payload.note?.trim() || undefined,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Backend rejected operation.");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - weeklyPayment]:`, error);
        return {
            success: false,
            error: process.env.NODE_ENV === "development"
                ? error.message
                : "Failed to settle weekly payment."
        };
    }
}