/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { deleteCookie } from "./tokenHandlers";

export const deleteUnverifiedUser = async (userId: string): Promise<any> => {
    try {


        if (!userId) {
            throw new Error("No active unverified user session context was found.");
        }

        const response = await serverFetch.delete(`/user/${userId}/unverified`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
            throw new Error(data.message || "Failed to cancel your verification session.");
        }

        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");

        return { success: true };

    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        console.error("[Service Error - handleAbortAction]:", error);
        return {
            success: false,
            message: error.message || "Something went wrong. Please try again."
        };
    }
};