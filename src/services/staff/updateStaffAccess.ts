/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface UpdateStaffAccessPayload {
    isRemoved: boolean;
}

export async function updateStaffAccess(
    staffId: string,
    payload: UpdateStaffAccessPayload
) {
    try {
        if (!staffId) {
            throw new Error("Staff ID is required");
        }

        const response = await serverFetch.patch(`/staff/${staffId}/update-access`, {
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update staff access");
        }

        // revalidateTag("users-list");
        // revalidateTag("managers-list");

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - updateStaffAccess]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}