/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function getPlayerDashboardStats() {

    try {

        const endpoint = `/dashboard/player-dashboard`;

        const response = await serverFetch.get(endpoint);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to retrieve slot availability details.");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - playerDashboard]:`, error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? error.message
                : "Failed to retrieve player dashboard stats."
        };
    }
}