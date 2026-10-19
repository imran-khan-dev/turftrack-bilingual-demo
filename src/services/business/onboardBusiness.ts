"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { businessOnboardingSchema } from "@/zod/business.validation";
import { loginUser } from "../auth/loginUser";


export const onboardBusiness = async (_currentState: any, formData: FormData): Promise<any> => {

    const fields: Record<string, any> = {};
    formData.forEach((value, key) => {
        if (!(value instanceof File) && value !== null && value !== undefined) {
            fields[key] = value;
        }
    });

    try {
        const rawDataObject: Record<string, any> = {};

        formData.forEach((value, key) => {
            rawDataObject[key] = value;
        });

        if (!rawDataObject.discountPriority) {
            rawDataObject.discountPriority = "HIGHEST_ONLY";
        }

        try {
            if (typeof rawDataObject.features === "string") {
                rawDataObject.features = JSON.parse(rawDataObject.features);
            }

            if (typeof rawDataObject.businessTerms === "string") {
                rawDataObject.businessTerms = JSON.parse(rawDataObject.businessTerms);
            }
        } catch (error) {
            console.error(error);
            throw new Error("Invalid JSON format in form data");
        }

        const validation = zodValidator(rawDataObject, businessOnboardingSchema);

        if (validation.success === false) {
            return {
                ...validation,
                fields,
            };
        }

        const apiPayload = new FormData();

        Object.entries(validation.data || {}).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            if (key === "businessTerms" || key === "features") {
                apiPayload.append(key, JSON.stringify(value));
            }

            else if (Array.isArray(value)) {
                value.forEach((element) => {
                    apiPayload.append(key, String(element));
                });
            }

            else {
                apiPayload.append(key, String(value));
            }
        });

        const ownerPhoto = formData.get("ownerPhoto");
        if (ownerPhoto instanceof File && ownerPhoto.size > 0) {
            apiPayload.append("ownerPhoto", ownerPhoto);
        }

        const logo = formData.get("logo");
        if (logo instanceof File && logo.size > 0) {
            apiPayload.append("logo", logo);
        }

        const res = await serverFetch.post("/business/onboarding", {
            body: apiPayload,
        });

        const result = await res.json();

        // Normalize API errors before returning to frontend state
        if (!result.success) {
            const formattedErrors: Record<string, string[]> = {};

            // If backend passed errorSources array down, clean it up for InputFieldError
            if (result.errorSources && Array.isArray(result.errorSources)) {
                result.errorSources.forEach((source: { path: string; message: string }) => {
                    if (source.path) {
                        formattedErrors[source.path] = [source.message];
                    }
                });
            }

            return {
                ...result,
                errors: Object.keys(formattedErrors).length > 0 ? formattedErrors : undefined,
                fields,
            };
        }

        const loginFormData = new FormData();
        const validatedPayload = validation.data as any;
        loginFormData.append("emailOrPhone", String(validatedPayload.phone));
        loginFormData.append("password", String(validatedPayload.password));

        await loginUser(_currentState, loginFormData);

        return { success: true };

    } catch (error: any) {
        if (
            error.message?.includes("NEXT_REDIRECT") ||
            error.digest?.includes("NEXT_REDIRECT")
        ) {
            throw error;
        }

        console.error("Critical onboarding action exception encountered:", error);

        // Fallback catch if core fetch client itself crashes/throws
        if (error.errorSources && Array.isArray(error.errorSources)) {
            const formattedErrors: Record<string, string[]> = {};

            error.errorSources.forEach((source: { path: string; message: string }) => {
                if (source.path) {
                    formattedErrors[source.path] = [source.message];
                }
            });

            return {
                success: false,
                message: error.message || "Database validation failed.",
                errors: formattedErrors,
                fields,
            };
        }

        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Onboarding failed securely.",
            errors: error.flatten ? error.flatten().fieldErrors : undefined,
            fields,
        };
    }
};