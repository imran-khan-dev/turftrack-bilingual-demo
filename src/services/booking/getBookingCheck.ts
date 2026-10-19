"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";

export async function getBookingCheck(cartId: string) {
    try {

        const response = await serverFetch.get(`/booking/${cartId}/check`);
        const result = await response.json();
        return result.data;
    } catch (error: any) {
        console.error("Error fetching booking status:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to fetch booking status",
        };
    }
}