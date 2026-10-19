"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { cache } from "react";

export interface BusinessDashboardData {
    result: any;
    isOwner: boolean;
    isManager: boolean;
}

export const getBusinessData = cache(async (
    slug: string,
    params?: { mode?: "dashboard" },
) => {
    try {

        if (!slug) return null;


        const query = params?.mode ? `?mode=${params.mode}` : "";

        const res = await serverFetch.get(`/business/${slug}${query}`, {
            // next: { tags: [`business-${slug}`], revalidate: 180,  },

            // Later it will only be revalidated when business details are updated, for now I keep it simple

        });

        if (!res.ok) return null;
        const json = await res.json();

        return json.data;

    } catch (error: any) {
        console.error("Error fetching business data:", error);
        return null;
    }
});