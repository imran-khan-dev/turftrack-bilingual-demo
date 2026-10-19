/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface GetUsersQueryParams {
    page?: string | number;
    searchTerm?: string;
    limit?: string | number;
    role?: string;
    isActive?: string | boolean;
    sortBy?: string;
    sortOrder?: string;
    [key: string]: any;
}

export async function getUsers(queryObj?: GetUsersQueryParams) {
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
        const endpoint = `/user/all${queryString ? `?${queryString}` : ""}`;

        const page = queryObj?.page || "1";
        const searchTerm = queryObj?.searchTerm || "all";

        const response = await serverFetch.get(endpoint, {
            next: {
                tags: [
                    "users-list",
                    `users-page-${page}`,
                    `users-search-${searchTerm}`,
                ],
                // Cache data on the Next.js server for 3 minutes (180s)
                // revalidate: 180, 
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch users data");
        }

        return {
            success: true,
            data: result
        };

    } catch (error: any) {
        console.error("[Service Error - getUsers]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}