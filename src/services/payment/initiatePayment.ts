/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface PaymentResult {
    GatewayPageURL?: string;
    payment_url?: string;
    [key: string]: any;
}

interface InitiatePaymentParams {
    cartId: string;
    chosenAmount: number | string;
}

export async function initiatePayment({
    cartId,
    chosenAmount,
}: InitiatePaymentParams): Promise<ActionResponse<PaymentResult>> {
    try {
        if (!cartId) {
            throw new Error(
                "Missing transaction context reference identifier (cartId)."
            );
        }

        const numericAmount = Number(chosenAmount);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new Error(
                "Please enter a valid numeric checkout amount."
            );
        }

        const paymentMethod =
            process.env.PAYMENT_METHOD || "ziniPay";

        const response = await serverFetch.post(
            `/payment/make-payment/${cartId}?method=${paymentMethod}`,
            {
                body: JSON.stringify({
                    chosenAmount: numericAmount,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
            throw new Error(
                result.message ||
                "Failed to initialize secured payment processing."
            );
        }

        return {
            success: true,
            data: result.data || result,
        };
    } catch (error: any) {
        console.error(
            "[Service Error - initiatePayment]:",
            error
        );

        return {
            success: false,
            error:
                error.message ||
                "Network exception negotiating connection to banking gateway hooks.",
        };
    }
}