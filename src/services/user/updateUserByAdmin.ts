/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

type ProfileState = {
    success: boolean;
    message?: string | null;
};

export default async function updateUserByAdmin(
    prevState: ProfileState,
    formData: FormData
): Promise<ProfileState> {
    const userId = formData.get("id") as string;

    if (!userId) {
        return { success: false, message: "User ID is required" };
    }

    try {
        const newFormData = new FormData();

        const originalFullName = formData.get("_original_fullName") as string;
        const originalClubName = formData.get("_original_clubName") as string;
        const originalAddress = formData.get("_original_address") as string;
        const originalIsActive = formData.get("_original_isActive") as string;
        const originalIsVerified = formData.get("_original_isVerified") === "true";
        const originalIsPhoneVerified = formData.get("_original_isPhoneVerified") === "true";


        const newFullName = (formData.get("fullName") as string || "").trim();
        if (newFullName && newFullName !== originalFullName) {
            newFormData.append("fullName", newFullName);
        }

        const newClubName = (formData.get("clubName") as string || "").trim();
        if (newClubName && newClubName !== originalClubName) {
            newFormData.append("clubName", newClubName);
        }

        const newAddress = (formData.get("address") as string || "").trim();
        if (newAddress && newAddress !== originalAddress) {
            newFormData.append("address", newAddress);
        }

        const newIsActive = (formData.get("isActive") as string || "").trim();
        if (newIsActive && newIsActive !== originalIsActive) {
            newFormData.append("isActive", newIsActive);
        }

        const isVerifiedValues = formData.getAll("isVerified");
        const currentIsVerified = isVerifiedValues.includes("true");

        const isPhoneVerifiedValues = formData.getAll("isPhoneVerified");
        const currentIsPhoneVerified = isPhoneVerifiedValues.includes("true");


        if (currentIsVerified !== originalIsVerified) {
            newFormData.append("isVerified", String(currentIsVerified));
        }

        if (currentIsPhoneVerified !== originalIsPhoneVerified) {
            newFormData.append("isPhoneVerified", String(currentIsPhoneVerified));
        }


        const photoFile = formData.get("file");
        if (photoFile instanceof File && photoFile.size > 0) {
            newFormData.append("file", photoFile);
        }

        let hasChanges = false;
        for (const key of newFormData.keys()) {
            hasChanges = true;
            break;
        }

        if (!hasChanges) {
            return {
                success: true,
                message: "No changes detected.",
            };
        }

        const res = await serverFetch.patch(`/user/${userId}/update`, {
            body: newFormData,
        });

        const result = await res.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update user",
            };
        }

        // revalidateTag("all-users");
        // revalidateTag("my-profile");

        return {
            success: true,
            message: result.message || "User updated successfully",
        };
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
        };
    }
}