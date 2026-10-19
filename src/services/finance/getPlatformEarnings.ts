/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface GetPlatformEarningsQueryParams {
    from?: string;
    to?: string;
}

export async function getPlatformEarnings(queryObj?: GetPlatformEarningsQueryParams) {
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

        const endpoint = `/finance/platform-earnings${queryString ? `?${queryString}` : ""}`;

        const response = await serverFetch.get(endpoint);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch platform earnings data");
        }

        return {
            success: true,
            data: result.data || result
        };

    } catch (error: any) {
        console.error("[Service Error - getPlatformEarnings]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}