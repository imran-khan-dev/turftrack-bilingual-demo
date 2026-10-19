/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function markAllNotificationsRead() {
    try {
        const response = await serverFetch.patch(`/notifications/read-all`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to mark all notifications as read");
        }

        revalidateTag("notifications-list", undefined as any);

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - markAllNotificationsRead]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}