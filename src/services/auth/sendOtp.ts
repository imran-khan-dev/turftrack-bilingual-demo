/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface SendOtpParams {
    purpose: string;
    businessId?: string;
    activeNumber?: string | number;
}

export async function sendOtp({
    purpose,
    businessId,
    activeNumber,
}: SendOtpParams): Promise<ActionResponse<any>> {
    try {
        const payload: Record<string, any> = { purpose };

        // PASSWORD_RESET requires phone identifier, but NO businessId
        if (purpose === "PASSWORD_RESET") {
            if (!activeNumber) {
                throw new Error("A valid target telephone number parameter must be provided.");
            }
            payload.identifier = String(activeNumber).trim();
        }
        // Other business-scoped operations require BOTH businessId & activeNumber
        else if (purpose !== "USER_VERIFICATION") {
            if (!businessId) {
                throw new Error("Business context reference missing.");
            }
            if (!activeNumber) {
                throw new Error("A valid target telephone number parameter must be provided.");
            }
            payload.businessId = businessId;
            payload.identifier = String(activeNumber).trim();
        }

        const response = await serverFetch.post("/auth/send-otp", {
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "Failed to deliver security code. Try again.");
        }

        return {
            success: true,
            data: {
                secondsRemaining: result.secondsRemaining || 300,
            },
        };
    } catch (error: any) {
        console.error(`[Service Error - sendOtp]:`, error);
        return {
            success: false,
            error: error.message || "Network routing threshold failure.",
        };
    }
}