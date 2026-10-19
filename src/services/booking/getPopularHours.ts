/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface PopularHoursParams {
    from: string;
    to: string;
    selectedBusiness?: string;
}

export async function getPopularHours({
    from,
    to,
    selectedBusiness,
}: PopularHoursParams): Promise<ActionResponse<any>> {
    try {
        // Enforce the 90-day execution limits on the server layer
        const daysDiff = (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > 90) {
            throw new Error("Range exceeds backend 90-day execution limits.");
        }

        // Build search parameters dynamically
        const filterParams = new URLSearchParams({ from, to });
        if (selectedBusiness && selectedBusiness !== "all") {
            filterParams.append("businessId", selectedBusiness);
        }

        const response = await serverFetch.get(`/dashboard/popular-hours?${filterParams.toString()}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Backend rejected popular hours calculation.");
        }

        // Standardize the extraction layer cleanly matching your array checks
        const extractedData = Array.isArray(result) 
            ? result 
            : (result && Array.isArray(result.data) ? result.data : []);

        return {
            success: true,
            data: extractedData
        };

    } catch (error: any) {
        console.error(`[Service Error - getPopularHours]:`, error);
        return {
            success: false,
            error: process.env.NODE_ENV === "development"
                ? error.message
                : "Failed to extract operational traffic density profiles."
        };
    }
}