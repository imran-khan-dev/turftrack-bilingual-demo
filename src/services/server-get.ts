/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

export async function serverGet(path: string, params?: Record<string, string>) {
    try {
        const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
        const response = await serverFetch.get(`${path}${qs}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Request failed: ${path}`);
        }

        return { success: true, data: result.data ?? result };
    } catch (error: any) {
        console.error(`[Service Error - serverGet ${path}]:`, error);
        return {
            success: false,
            message: error.message || "Something went wrong.",
        };
    }
}