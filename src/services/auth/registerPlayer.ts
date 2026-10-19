/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { loginUser } from "./loginUser";
import { createRegisterPlayerValidationSchema } from "@/zod/auth.validation";
import { getTranslations } from "@/i18n/server";

export const registerPlayer = async (_currentState: any, formData: any): Promise<any> => {

    const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };

    const fields = { 
        fullName: getString("fullName"),
        phone: getString("phone"),
        address: getString("address"),
        email: getString("email") || undefined,
        clubName: getString("clubName"),
    };

    try {
        const t = await getTranslations("auth.validation");
        const registerPlayerValidationZodSchema = createRegisterPlayerValidationSchema({
            validEmail: t("validEmail"),
            validPhone: t("validPhone"),
            nameRequired: t("nameRequired"),
            passwordRequired: t("passwordRequired"),
            passwordTooLong: t("passwordTooLong"),
            confirmPasswordRequired: t("confirmPasswordRequired"),
            passwordsMismatch: t("passwordsMismatch"),
        });
        const payload = {
            ...fields,
            password: getString("password"),
            confirmPassword: getString("confirmPassword"),
        };

        const validationResult = zodValidator(payload, registerPlayerValidationZodSchema);

        if (validationResult.success === false) {
            return {
                ...validationResult,
                fields, // Pass tracking values back to keep inputs filled on frontend
            };
        }

        const validatedPayload: any = validationResult.data;

        const newFormData = new FormData();
        newFormData.append("fullName", validatedPayload.fullName);
        newFormData.append("address", validatedPayload.address);
        if (validatedPayload.email) {
            newFormData.append("email", validatedPayload.email);
        }
        newFormData.append("phone", validatedPayload.phone);
        newFormData.append("clubName", validatedPayload.clubName);
        newFormData.append("password", validatedPayload.password);

        const photo = formData.get("photo");
        if (photo instanceof File && photo.size > 0) {
            newFormData.append("file", photo);
        }

        const res = await serverFetch.post("/user/create-player", {
            body: newFormData,
        });

        const result = await res.json();

        if (!result.success) {
            return {
                ...result,
                fields
            };
        }

        const loginFormData = new FormData();
        loginFormData.append("emailOrPhone", validatedPayload.phone);
        loginFormData.append("password", validatedPayload.password);
        loginFormData.append("redirect", (formData.get("redirect") as string) || "");

        await loginUser(_currentState, loginFormData);

        return result;

    } catch (error: any) {
        // Re-throw NEXT_REDIRECT errors so Next.js routing system can step in
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Registration runtime exception:", error);
        const authT = await getTranslations("auth");
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : authT("registrationFailedFallback"),
            fields
        };
    }
}
