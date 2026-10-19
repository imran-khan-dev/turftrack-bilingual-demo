/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateBusinessSchema } from "@/zod/business.validation";

const BUSINESS_FIELDS = [
    "businessName",
    "slug",
    "location",
    "businessEmail",
    "aboutDesc",
    "facebookLink",
    "instagramLink",
    "whatsappLink",
    "googleMapLink",
    "accountName",
    "accountNumber",
    "bankName",
    "branchName",
    "cancelWindowHours",
    "rescheduleWindowHours",
    "allowPlayerCancel",
    "allowPlayerReschedule",
    "refundAllowed",
    "refundPercent",
    "minDepositPercent",
    "maxDepositPercent",
    "maxSlotsPerBooking",
    "maxBookingsPerDay",
    "bookingHorizonDays",
    "features",
    "businessTerms",
    // Super Admin fields
    "isActive",
    "noAppFeeWindow",
    "customFeeRate",
    "platformFeeType",
    "outstandingDebtLimit",
    "marketingLimitCount",
    "marketingLimitWindowHours",
] as const;

export async function updateBusiness(
    _currentState: any,
    formData: FormData,
): Promise<any> {

    const businessId = (formData.get("businessId") as string || "").trim();

    if (!businessId) {
        return {
            success: false,
            message: "Business ID is required.",
        };
    }

    try {
        const originalRaw = (formData.get("_original") as string) || "{}";
        let original: Record<string, string> = {};
        try {
            original = JSON.parse(originalRaw);
        } catch {
            original = {};
        }

        const changedFields: Record<string, string> = {};

        for (const fieldKey of BUSINESS_FIELDS) {
            if (!(fieldKey in original)) continue;

            const newValue = (formData.get(fieldKey) as string || "").trim();
            const originalValue = (original[fieldKey] ?? "").toString().trim();

            if (newValue !== originalValue) {
                changedFields[fieldKey] = newValue;
            }
        }

        const logoFile = formData.get("logo");
        const hasLogoFile = logoFile instanceof File && logoFile.size > 0;

        const hasChanges = Object.keys(changedFields).length > 0 || hasLogoFile;

        if (!hasChanges && !hasLogoFile) {
            return {
                success: true,
                message: "No changes detected.",
            };
        }

        const validationResult = zodValidator(
            changedFields,
            updateBusinessSchema,
        );

        if (validationResult.success === false) {
            return {
                ...validationResult,
                business: changedFields,
            };
        }

        const payload = validationResult.data;

        const multipartBody = new FormData();

        Object.entries(payload as Record<string, any>).forEach(([key, value]) => {
            if (value === undefined) return;
            multipartBody.append(
                key,
                typeof value === "object" ? JSON.stringify(value) : String(value),
            );
        });

        if (hasLogoFile) {
            multipartBody.append("logo", logoFile as File);
        }

        const res = await serverFetch.patch(`/business/${businessId}/update`, {
            body: multipartBody,
        });

        const result = await res.json();

        if (!result.success) {
            return {
                ...result,
                business: changedFields,
            };
        }

        return result;
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Update business runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to update business. Please try again.",
        };
    }
}