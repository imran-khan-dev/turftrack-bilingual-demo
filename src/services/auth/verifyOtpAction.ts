/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { parse } from "cookie";
import { setCookie } from "./tokenHandlers";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface VerifyOtpParams {
    purpose: string;
    code: string;
    businessId?: string;
    activeNumber?: string | number;
}

export async function verifyOtpAction({
    purpose,
    code,
    businessId,
    activeNumber,
}: VerifyOtpParams): Promise<ActionResponse<any>> {
    try {
        const payload: Record<string, any> = {
            purpose,
            code,
        };

        if (purpose !== "USER_VERIFICATION" && purpose !== "PASSWORD_RESET") {
            if (!businessId) throw new Error("Business context reference missing.");
            if (!activeNumber) throw new Error("Target verification phone parameter missing.");

            payload.businessId = businessId;
            payload.identifier = String(activeNumber).trim();
        }

        // 1. Call the Express backend from the Next Server Action container
        const response = await serverFetch.post("/auth/verify-otp", {
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false || result.error) {
            throw new Error(result.message || "Incorrect verification code. Please try again.");
        }

        // 2. Extract Set-Cookie headers returned from Express
        const setCookieHeaders = response.headers.getSetCookie();

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            for (const cookieStr of setCookieHeaders) {
                const parsedCookie = parse(cookieStr);

                // Extract keys dynamically
                const cookieName = Object.keys(parsedCookie).find(
                    key => key === "accessToken" || key === "refreshToken"
                );

                if (cookieName) {
                    const cookieValue = parsedCookie[cookieName];
                    if (!cookieValue) continue;

                    const maxAge = parseInt(parsedCookie["Max-Age"] || parsedCookie["max-age"] || "0");
                    const path = parsedCookie["Path"] || parsedCookie["path"] || "/";
                    const sameSite = (parsedCookie["SameSite"] || parsedCookie["samesite"] || "none").toLowerCase();

                    // 3. Explicitly overwrite Next.js client environment cookies
                    await setCookie(cookieName, cookieValue, {
                        secure: true,
                        httpOnly: true,
                        maxAge: maxAge || 1000 * 60 * 60,
                        path: path,
                        sameSite: sameSite as "none" | "lax" | "strict",
                    });
                }
            }
        } else {
            console.warn("[verifyOtpAction Warn]: No authentication cookies found in backend execution response.");
        }

        return {
            success: true,
            data: result
        };

    } catch (error: any) {
        console.error(`[Service Error - verifyOtpAction]:`, error);
        return {
            success: false,
            error: error.message || "Connection link error."
        };
    }
}