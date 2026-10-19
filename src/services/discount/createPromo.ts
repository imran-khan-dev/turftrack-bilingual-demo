/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { promoCodeValidationZodSchema } from "@/zod/discount.validation";

export default async function createPromo(
    _currentState: any,
    formData: FormData,
): Promise<any> {
    const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };

    const fields = {
        businessId: getString("businessId"),
        fieldId: getString("fieldId"),
        discountType: getString("discountType"),
        discountValue: getString("discountValue"),
        validFrom: getString("validFrom"),
        validUntil: getString("validUntil"),
        maxUsage: getString("maxUsage"),
        maxUsagePerUser: getString("maxUsagePerUser"),
    };

    try {
        const validationResult = zodValidator(fields, promoCodeValidationZodSchema);

        if (validationResult.success === false) {
            return {
                ...validationResult,
                fields,
            };
        }

        const payload = validationResult.data;

        const res = await serverFetch.post("/discount/promo-code", {
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
        console.error("Create promo runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to create promo code. Please try again.",
            fields,
        };
    }
};