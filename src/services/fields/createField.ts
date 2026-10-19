/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createFieldValidationZodSchema } from "@/zod/field.validation";

export default async function createField(
    _currentState: any,
    formData: FormData,
): Promise<any> {

    const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };

    const businessId = getString("businessId");

    const fields = {
        name: getString("name"),
        description: getString("description"),
        fieldType: getString("fieldType"),
        pricePerSlot: getString("pricePerSlot"),
        slotBreak: getString("slotBreak"),
        amenities: formData.getAll("amenities[]") as string[],
        inputPricing: getString("inputPricing"),
    };

    try {
        if (!businessId) {
            return {
                success: false,
                message: "Please select a business.",
                fields,
            };
        }

        const validationResult = zodValidator(
            fields,
            createFieldValidationZodSchema,
        );

        if (validationResult.success === false) {
            return {
                ...validationResult,
                fields,
            };
        }

        const payload = validationResult.data;

        const res = await serverFetch.post(`/field/${businessId}/create`, {
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
        console.error("Create field runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to create field. Please try again.",
            fields,
        };
    }
}