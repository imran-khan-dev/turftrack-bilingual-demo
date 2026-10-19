/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface GetPlatformEarningsQueryParams {
    from?: string;
    to?: string;
    page?: string | number;
    limit?: string | number;
    businessId?: string;
    [key: string]: any;
}

export async function getAllWallets(queryObj?: GetPlatformEarningsQueryParams) {
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

        const endpoint = `/finance/all-wallets${queryString ? `?${queryString}` : ""}`;

        const response = await serverFetch.get(endpoint);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch all wallets data");
        }

        return {
            success: true,
            data: result.data || result
        };

    } catch (error: any) {
        console.error("[Service Error - getAllWallets]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}