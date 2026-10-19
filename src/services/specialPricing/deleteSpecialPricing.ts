"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";

export default async function deleteSpecialPricing(id: string): Promise<boolean> {
  try {
    const res = await serverFetch.delete(`/field/${id}/special-pricing`);

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update staff access");
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting special pricing:", error);
    return false;
  }
}