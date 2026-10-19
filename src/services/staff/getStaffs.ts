/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface GetStaffsQueryParams {
    page?: string | number;
    searchTerm?: string;
    limit?: string | number;
    businessId?: string;
    isActive?: string;
    isRemoved?: string | boolean;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
    [key: string]: any;
}

export async function getStaffs(queryObj?: GetStaffsQueryParams) {
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
        const endpoint = `/staff/all${queryString ? `?${queryString}` : ""}`;

        // const page = queryObj?.page || "1";
        // const searchTerm = queryObj?.searchTerm || "all";
        // const businessId = queryObj?.businessId || "all";

        const response = await serverFetch.get(endpoint, {
            next: {
                // tags: [
                //     "staffs-list",
                //     `staffs-page-${page}`,
                //     `staffs-search-${searchTerm}`,
                //     `staffs-business-${businessId}`,
                // ],
                // Cache data on the Next.js server for 3 minutes (180s)
                // revalidate: 180, 
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch staffs data");
        }

        return {
            success: true,
            data: result.data || result
        };

    } catch (error: any) {
        console.error("[Service Error - getStaffs]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}