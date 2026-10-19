/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function deleteNotification(notificationId: string) {
    try {
        if (!notificationId) {
            throw new Error("Notification ID is required");
        }

        const response = await serverFetch.delete(`/notifications/${notificationId}/delete`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete notification");
        }

        revalidateTag("notifications-list", undefined as any);

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - deleteNotification]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}