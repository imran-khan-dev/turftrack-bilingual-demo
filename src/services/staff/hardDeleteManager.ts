/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function hardDeleteManager(
    id: string,
) {
    try {
        if (!id) {
            throw new Error("Staff ID is required");
        }

        const response = await serverFetch.delete(`/staff/${id}/hard-delete`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete manager");
        }

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - hardDeleteManager]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}