/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updatePromoValidationZodSchema } from "@/zod/discount.validation";

export const updatePromo = async (
    promoId: string,
    _currentState: any,
    formData: FormData,
): Promise<any> => {
    const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };

    // Only include a key if the user actually filled it in — an empty string
    // means "left blank", not "set to empty", so it's dropped rather than
    // sent through as "".
    const rawFields: Record<string, string> = {
        discountType: getString("discountType"),
        discountValue: getString("discountValue"),
        validFrom: getString("validFrom"),
        validUntil: getString("validUntil"),
        maxUsage: getString("maxUsage"),
        maxUsagePerUser: getString("maxUsagePerUser"),
    };

    const fields = Object.fromEntries(
        Object.entries(rawFields).filter(([, value]) => value !== ""),
    );

    try {
        const validationResult = zodValidator(fields, updatePromoValidationZodSchema);

        if (validationResult.success === false) {
            return {
                ...validationResult,
                fields,
            };
        }

        const payload = validationResult.data;

        // Backend expects a JSON body, not multipart form data
        const res = await serverFetch.patch(`/discount/promo-code/${promoId}`, {
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (!result.success) {
            return {
                ...result,
                fields,
            };
        }

        return result;
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Update promo runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to update promo code. Please try again.",
            fields,
        };
    }
};
