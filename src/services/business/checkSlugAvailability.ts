/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface SlugCheckResult {
    available: boolean;
    message?: string;
}

export async function checkSlugAvailability(slug: string): Promise<ActionResponse<SlugCheckResult>> {
    try {
        const cleanSlug = slug?.trim();
        if (!cleanSlug) {
            throw new Error("Slug query cannot be empty.");
        }

        const response = await serverFetch.get(`/business/check-slug?q=${encodeURIComponent(cleanSlug)}`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "Failed to validate custom link parameters.");
        }

        return {
            success: true,
            data: {
                available: result.data?.available ?? false,
                message: result.data?.message
            }
        };

    } catch (error: any) {
        console.error(`[Service Error - checkSlugAvailability]:`, error);
        return {
            success: false,
            error: error.message || "Error checking link routing availability."
        };
    }
}