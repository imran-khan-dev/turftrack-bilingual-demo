/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface GetNotificationsQueryParams {
    page?: string | number;
    limit?: string | number;
    [key: string]: any;
}

export async function getNotifications(queryObj?: GetNotificationsQueryParams) {
    try {
        const searchParams = new URLSearchParams();

        if (queryObj) {
            Object.entries(queryObj).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            });
        }

        const queryString = searchParams.toString();
        const endpoint = `/notifications/all${queryString ? `?${queryString}` : ""}`;

        // const page = queryObj?.page || "1";

        const response = await serverFetch.get(endpoint, {
            // next: {
            //     tags: ["notifications-list", `notifications-page-${page}`],
            // },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch notifications");
        }

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - getNotifications]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}