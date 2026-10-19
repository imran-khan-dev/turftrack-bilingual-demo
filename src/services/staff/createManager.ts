/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createManagerValidationSchema } from "@/zod/staff.validation";

type ManagerState = {
    success: boolean;
    message?: string;
    formData?: FormData;
};

export default async function createManager(
    prevState: ManagerState,
    formData: FormData
): Promise<any> {
    const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };


    const entries = {
        businessId: getString("businessId"),
        fullName: getString("fullName"),
        email: getString("email"),
        phone: getString("phone"),
        password: getString("password"),
        confirmPassword: getString("confirmPassword"),
        address: getString("address"),
    };

    try {
        const validationResult = zodValidator(entries, createManagerValidationSchema);

        if (validationResult.success === false) {

            return {
                ...validationResult,
                entries,
            };
        }

        type ManagerPayload = {
            fullName: string;
            address: string;
            email?: string;
            phone: string;
            password: string;
            businessId: string;
        };

        const payload = validationResult.data as ManagerPayload | undefined;
        if (!payload) {
            return {
                success: false,
                message: "Invalid payload",
                entries,
            };
        }

        const newFormData = new FormData();

        newFormData.append("fullName", payload.fullName);
        newFormData.append("address", payload.address);

        if (payload.email) {
            newFormData.append("email", payload.email);
        }
        newFormData.append("phone", payload.phone);
        newFormData.append("password", payload.password);
        newFormData.append("businessId", payload.businessId); // also missing — see note below

        const photo = formData.get("file");
        if (photo instanceof File && photo.size > 0) {
            newFormData.append("file", photo);
        }

        const res = await serverFetch.post("/user/create-manager", {
            body: newFormData,
        });

        const result = await res.json();

        if (!result.success) {
            return {
                ...result,
                entries,
            };
        }

        return result;
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Create manager runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to create manager. Please try again.",
            entries,
        };
    }
};