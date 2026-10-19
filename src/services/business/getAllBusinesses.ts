"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";


interface GetBusinessQueryParams {
    page?: string | number;
    searchTerm?: string;
    limit?: string | number;
    status?: string;
    [key: string]: any;
}

export async function getAllBusinesses(queryObj?: GetBusinessQueryParams) {
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
        const endpoint = `/business/all${queryString ? `?${queryString}` : ""}`;

        const res = await serverFetch.get(endpoint);

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Failed to fetch bookings data");
        }

        return {
            success: true,
            data: result.data || result
        };

    } catch (error: any) {
        console.error("[Service Error - getAllBusinesses]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
};