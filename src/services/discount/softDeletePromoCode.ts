/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function softDeletePromoCode(promoId: string): Promise<any> {
    if (!promoId) {
        return { success: false, message: "Missing promo id." };
    }

    try {
        const res = await serverFetch.patch(`/discount/${promoId}`);
        const result = await res.json();

        if (!result.success) {
            return result;
        }

        return result;
    } catch (error: any) {
        console.error("Soft delete promo runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to delete promo code. Please try again.",
        };
    }
}