/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateProfileValidationSchema } from "@/zod/user.validation";
import { revalidateTag } from "next/cache";

type ProfileState = {
    success: boolean;
    message?: string;
    entries?: any;
};

export default async function updateMyProfile(
    prevState: ProfileState,
    formData: FormData
): Promise<any> {
    const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };

    const entries = {
        fullName: getString("fullName"),
        address: getString("address"),
        clubName: getString("clubName"),
    };

    try {
        const validationResult = zodValidator(entries, updateProfileValidationSchema);

        if (validationResult.success === false) {
            return {
                ...validationResult,
                entries,
            };
        }

        const payload = validationResult.data as typeof entries | undefined;
        if (!payload) {
            return {
                success: false,
                message: "Invalid payload",
                entries,
            };
        }

        const newFormData = new FormData();

        if (payload.fullName) newFormData.append("fullName", payload.fullName);
        if (payload.address) newFormData.append("address", payload.address);
        if (payload.clubName) newFormData.append("clubName", payload.clubName);

        const photo = formData.get("file");

        if (photo instanceof File && photo.size > 0) {
            newFormData.append("file", photo);
        }

        const res = await serverFetch.patch("/user/update-profile", {
            body: newFormData,
        });

        const result = await res.json();

        if (!result.success) {
            return {
                ...result,
                entries,
            };
        }

        revalidateTag("my-profile", { expire: 0 });

        return result;
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Update profile runtime exception:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to update profile. Please try again.",
            entries,
        };
    }
}