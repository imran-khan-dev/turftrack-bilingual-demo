/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function hardDeleteUser(
    id: string,
) {
    try {
        if (!id) {
            throw new Error("User ID is required");
        }

        const response = await serverFetch.delete(`/user/${id}`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete user");
        }

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - hardDeleteUser]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}