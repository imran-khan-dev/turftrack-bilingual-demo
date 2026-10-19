/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface UtilizationParams {
    from: string;
    to: string;
    selectedBusiness?: string;
}

export async function getUtilizationMetrics({
    from,
    to,
    selectedBusiness,
}: UtilizationParams): Promise<ActionResponse<any>> {
    try {
        // 90-day calculation protection layer
        const daysDiff = (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > 90) {
            throw new Error("API Execution Terminated: Window selection spans over 90 days.");
        }

        const params = new URLSearchParams({ from, to });
        if (selectedBusiness && selectedBusiness !== "all") {
            params.append("businessId", selectedBusiness);
        }

        const response = await serverFetch.get(`/dashboard/utilization?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Backend rejected utilization analytics compilation.");
        }

        // Standardize the metric statistics target path extraction
        let extractedStats = null;
        if (result && result.stats) {
            extractedStats = result.stats;
        } else if (result && result.data?.stats) {
            extractedStats = result.data.stats;
        }

        return {
            success: true,
            data: extractedStats
        };

    } catch (error: any) {
        console.error(`[Service Error - getUtilizationMetrics]:`, error);
        return {
            success: false,
            error: process.env.NODE_ENV === "development"
                ? error.message
                : "Failed to load capacity utilization tracking matrix statistics."
        };
    }
}