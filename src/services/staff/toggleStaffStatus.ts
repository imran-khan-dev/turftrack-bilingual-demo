/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function toggleStaffStatus(
    staffId: string
) {
    try {
        if (!staffId) {
            throw new Error("Staff ID is required");
        }

        const response = await serverFetch.patch(
            `/staff/${staffId}/active-deactive`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update staff status");
        }

        // Revalidate cached lists so the UI reflects the new status immediately
        // revalidateTag("users-list");
        // revalidateTag("managers-list");

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - toggleStaffStatus]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}