/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { z } from "zod";
import { TogglePlayerSpecialPayload, togglePlayerSpecialSchema } from "@/zod/user.validation";


export async function makePlayerSpecial(payload: TogglePlayerSpecialPayload) {
    try {
        // 1. Validate payload with Zod
        const validatedData = togglePlayerSpecialSchema.parse(payload);
        const { businessId, id, phone, isManual } = validatedData;

        const endpoint = `/user/${businessId}/toggle-special-status`;
        const json = JSON.stringify({
            ...(id ? { playerId: id } : {}),
            ...(phone ? { phone } : {}),
            isNewPlayer: isManual,
        });

        const response = await serverFetch.patch(endpoint, {
            body: json,
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (!response.ok) {
            // Preserve backend Zod/validation error structure if present
            return {
                success: false,
                message: result.message || "Failed to update special status",
                errorSources: result.errorSources || [
                    { path: "phone", message: result.message || "Failed to update special status" }
                ],
            };
        }

        // revalidateTag("users-list");

        return {
            success: true,
            data: result.data || result,
        };

    } catch (error: any) {
        console.error("[Service Error - makePlayerSpecial]:", error);

        // 2. Handle Zod validation errors on the frontend/server action side
        if (error instanceof z.ZodError) {
            const errorSources = error.issues.map((issue) => ({
                path: issue.path[issue.path.length - 1] || "phone",
                message: issue.message,
            }));

            return {
                success: false,
                message: error.issues[0]?.message || "Validation Error",
                errorSources,
            };
        }

        // 3. Fallback for generic errors
        return {
            success: false,
            message: error.message || "Something went wrong",
            errorSources: [{ path: "", message: error.message || "Something went wrong" }],
        };
    }
}