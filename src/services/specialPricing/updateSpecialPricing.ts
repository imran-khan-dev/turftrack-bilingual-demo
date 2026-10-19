"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { SpecialPricing, SpecialPricingInput } from "@/types/specialPricing";

export default async function updateSpecialPricing(
  id: string,
  payload: SpecialPricingInput,
): Promise<SpecialPricing | null> {

  try {
    const res = await serverFetch.patch(`/field/${id}/special-pricing`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) return null;
    const json = await res.json();

    return json.data ?? json;
  } catch (error: any) {
    console.error("Error updating special pricing:", error);
    return null;
  }
}
