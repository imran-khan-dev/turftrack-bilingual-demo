/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function markNotificationRead(notificationId: string) {
    try {
        if (!notificationId) {
            throw new Error("Notification ID is required");
        }

        const response = await serverFetch.patch(`/notifications/${notificationId}/read`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to mark notification as read");
        }

        revalidateTag("notifications-list", undefined as any);

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - markNotificationRead]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}