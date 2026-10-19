/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

enum Method {
    CASH = "CASH",
    BKASH = "BKASH",
    NAGAD = "NAGAD",
    ROCKET = "ROCKET",
    BANK_TRANSFER = "BANK_TRANSFER"
}


interface SettleAppFeePayload {
    netAmount: number;
    amount: number;
    method: Method;
    reference: string;
    note?: string;
}

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function settleAppFee(
    businessId: string,
    payload: SettleAppFeePayload,
): Promise<ActionResponse<any>> {

    try {
        if (!businessId) {
            throw new Error("Business context reference missing.");
        }

        if (!payload?.reference?.trim()) {
            throw new Error("Transaction reference is required.");
        }

        if (!payload?.amount || payload.amount <= 0) {
            throw new Error("Amount must be greater than 0.");
        }

        if (!payload?.netAmount || payload.netAmount <= 0) {
            throw new Error("Net Amount must be greater than 0.");
        }

        const response = await serverFetch.patch(`/finance/${businessId}/manual-settle-fee`, {
            body: JSON.stringify({
                amount: payload.amount,
                netAmount: payload.netAmount,
                method: payload.method.toUpperCase(),
                reference: payload.reference.trim(),
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

        console.error(`[Service Error - settleAppFee]:`, error);

        return {
            success: false,
            error: process.env.NODE_ENV === "development"
                ? error.message
                : "Failed to settle weekly payment."
        };
    }
}