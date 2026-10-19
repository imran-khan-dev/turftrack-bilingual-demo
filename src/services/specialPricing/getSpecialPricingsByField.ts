"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { SpecialPricing } from "@/types/specialPricing";
import { cache } from "react";

export const getSpecialPricingsByField = cache(
    async (fieldId: string): Promise<SpecialPricing[] | null> => {
        try {
            const res = await serverFetch.get(`/field/${fieldId}/special-pricing`, {
                // next: { tags: [`special-pricings-${fieldId}`] },
            });

            if (!res.ok) return null;
            const json = await res.json();

            return json.data ?? json;
        } catch (error: any) {
            console.error("Error fetching special pricings:", error);
            return null;
        }
    },
);

export default getSpecialPricingsByField;