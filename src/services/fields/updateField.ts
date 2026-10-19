/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateFieldValidationZodSchema } from "@/zod/field.validation";

export default async function updateField(
    _currentState: any,
    formData: FormData,
): Promise<any> {

    const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };

    const fieldId = getString("fieldId");

    const field = {
        name: getString("name"),
        description: getString("description"),
        fieldType: getString("fieldType"),
        pricePerSlot: getString("pricePerSlot"),
        slotBreak: getString("slotBreak"),
        isActive: getString("isActive"),
        addAmenities: formData.getAll("addAmenities[]") as string[],
        removeAmenities: formData.getAll("removeAmenities[]") as string[],
        inputPricing: getString("inputPricing"),
    };

    try {
        if (!fieldId) {

            return {
                success: false,
                message: "Missing field id.",
                field,
            };
        }

        const validationResult = zodValidator(
            field,
            updateFieldValidationZodSchema,
        );

        if (validationResult.success === false) {

            return {
                ...validationResult,
                field,
            };
        }

        const payload = validationResult.data;

        const res = await serverFetch.patch(`/field/${fieldId}`, {
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (!result.success) {
            return {
                ...result,
                field,
            };
        }

        return result;
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Update field runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to update field. Please try again.",
            field,
        };
    }
}