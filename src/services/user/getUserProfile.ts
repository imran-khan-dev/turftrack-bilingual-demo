/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";


export async function getUserProfile(id: string) {
    try {

        if (!id) {
            throw new Error("User ID is required to fetch the user profile.");
        }

        const endpoint = `/user/${id}/profile`;

        const response = await serverFetch.get(endpoint);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch user profile");
        }

        return {
            success: true,
            data: result
        };

    } catch (error: any) {
        console.error("[Service Error - getUserProfile]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}