/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { serverFetch } from "@/lib/server-fetch";


export async function getPromoById(id: string) {

    try {
        if (!id) {
            throw new Error("Promo ID is required to fetch the Promo Code.");
        }

        const response = await serverFetch.get(`/discount/${id}/promo-code`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch promo data");
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error: any) {
        console.error(`[Service Error - getPromoById]:`, error);
        return {
            success: false,
            message: error.message || "Something went wrong while retrieving the promo."
        };
    }
}