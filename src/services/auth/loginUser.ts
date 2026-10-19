/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { getDefaultDashboardRoute, isValidRedirectForRole } from "@/lib/auth-utils";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createLoginValidationSchema } from "@/zod/auth.validation";
import { getTranslations } from "@/i18n/server";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandlers";
import { UserRole } from "@/types/user";
import { getUserInfo } from "./getUserFromToken";


export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const t = await getTranslations("auth.validation");
        const loginValidationZodSchema = createLoginValidationSchema({
            validEmail: t("validEmail"),
            validPhone: t("validPhone"),
            nameRequired: t("nameRequired"),
            passwordRequired: t("passwordRequired"),
            passwordTooLong: t("passwordTooLong"),
            confirmPasswordRequired: t("confirmPasswordRequired"),
            passwordsMismatch: t("passwordsMismatch"),
        });
        const redirectTo = formData.get('redirect') || null;
        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;
        const payload = {
            emailOrPhone: formData.get('emailOrPhone'),
            password: formData.get('password'),
        }

        if (zodValidator(payload, loginValidationZodSchema).success === false) {
            return zodValidator(payload, loginValidationZodSchema);
        }

        const validatedPayload = zodValidator(payload, loginValidationZodSchema).data;

        const res = await serverFetch.post("/auth/login", {
            body: JSON.stringify(validatedPayload),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
            throw new Error(result.message || "Failed to login.");
        }

        const setCookieHeaders = res.headers.getSetCookie();

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {
                const parsedCookie = parse(cookie);

                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie;
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie;
                }
            })
        } else {
            throw new Error("Tokens not found in cookies");
        }

        if (!accessTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        if (!refreshTokenObject) {
            throw new Error("Tokens not found in cookies");
        }


        await setCookie("accessToken", accessTokenObject.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60,
            path: accessTokenObject.Path || "/",
            sameSite: accessTokenObject['SameSite'] || "none",
        });

        await setCookie("refreshToken", refreshTokenObject.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 90,
            path: refreshTokenObject.Path || "/",
            sameSite: refreshTokenObject['SameSite'] || "none",
        });
        const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObject.accessToken, process.env.JWT_SECRET as string);

        if (typeof verifiedToken === "string") {
            throw new Error("Invalid token");

        }

        const userRole: UserRole = verifiedToken.role;

        if (!result.success) {
            throw new Error(result.message || "Login failed");
        }

        const resultUser = await getUserInfo();

        const user =
            resultUser.status !== "error" && resultUser.status !== "unauthenticated"
                ? resultUser.user
                : null;

        if (!user) {
            throw new Error("User not found");
        }

        const requestedPath = redirectTo !== null ? redirectTo.toString() : "";

        if (user.isVerified === false && userRole === "PLAYER") {
            redirect(`/player/verify?redirect=${requestedPath}`);
        }

        if (redirectTo && result.data.needPasswordChange) {

            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`/reset-password?redirect=${requestedPath}`);
            } else {
                redirect("/reset-password");
            }
        }

        if (result.data.needPasswordChange) {
            redirect("/reset-password");
        }

        if (redirectTo) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`${requestedPath}?loggedIn=true`);
            } else {
                redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
            }
        } else if (user.isVerified === true) {
            redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
        }
        return { success: true };

    } catch (error: any) {
        // Re-throw NEXT_REDIRECT errors so Next.js can handle them
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        const t = await getTranslations("auth");
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ?
                error.message : t("loginFailedFallback")}`
        };
    }
}
