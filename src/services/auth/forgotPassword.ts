/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from "@/lib/server-fetch";

interface forgotPasswordPayload {
    phone: string;
    newPassword: string;
}

export async function forgotPassword(payload: forgotPasswordPayload) {

    try {
        const response = await serverFetch.patch("/auth/forgot-password", {
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to initiate password change");
        }

        return {
            success: true,
            message: result.message,
            data: result.data,
        };

    } catch (error: any) {
        console.error("[Service Error - forgotPassword]:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        };
    }
}