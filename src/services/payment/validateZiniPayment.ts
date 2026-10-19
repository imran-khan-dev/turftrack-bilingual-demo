/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function validateZiniPay(
    invoiceId: string
): Promise<ActionResponse<any>> {

    try {
        if (!invoiceId) {
            throw new Error("ZiniPay invoice ID is required.");
        }

        const response = await serverFetch.post(
            `/zinipay/validate-payment/${invoiceId}`,
            {}
        );

        const result = await response.json();

        console.log("ZiniPay validation result:", result);

        if (!response.ok) {
            throw new Error(
                result.message || "Payment validation failed."
            );
        }

        return {
            success: true,
            data: result,
        };

    } catch (error: any) {
        console.error(
            `[Service Error - validateZiniPay]:`,
            error
        );

        return {
            success: false,
            error: error.message || "Payment validation failed.",
        };
    }
}