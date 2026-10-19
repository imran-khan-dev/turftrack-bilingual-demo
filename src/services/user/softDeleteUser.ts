/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function softDeleteUser(id: string): Promise<any> {
    if (!id) {
        throw new Error("User ID is required");
    }

    try {
        const res = await serverFetch.patch(`/user/${id}/soft-delete`);
        const result = await res.json();

        if (!result.success) {
            return result;
        }

        return result;
    } catch (error: any) {
        console.error("[Service Error - softDeleteUser]:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to soft delete user. Please try again.",
        };
    }
}