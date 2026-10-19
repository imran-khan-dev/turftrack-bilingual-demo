"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { ICreateBookingPayload } from "@/types/booking";
import { revalidateTag } from "next/cache";

export async function createBooking(payload: ICreateBookingPayload, isAuthority: boolean = false) {

    try {

        const endpoint = isAuthority
            ? "/booking/make-by-authority"
            : "/booking/create";

        const response = await serverFetch.post(endpoint, {
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });


        const result = await response.json();

        if (result.success) {

            revalidateTag('my-bookings', { expire: 0 });
        }

        return result;
    } catch (error: any) {
        console.error("Error creating booking:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to book turf",
        };
    }
}