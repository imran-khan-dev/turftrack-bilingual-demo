"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { SpecialPricingInput } from "@/types/specialPricing";

export default async function addSpecialPricing(
    fieldId: string,
    payload: SpecialPricingInput,
) {

    try {
        const res = await serverFetch.post(
            `/field/${fieldId}/special-pricing`, {
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        },
        );

        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? json;
    } catch (error: any) {
        console.error("Error adding special pricing:", error);
        return null;
    }
}
