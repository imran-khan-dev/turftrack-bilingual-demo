
"use server";

import { serverFetch } from "@/lib/server-fetch";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandlers";
import { IAuthUser } from "@/types/user";

export type GetUserInfoResult =
    | { status: "ok"; user: IAuthUser }
    | { status: "unauthenticated" }
    | { status: "error" };

export const getUserInfo = async (): Promise<GetUserInfoResult> => {
    try {
        const accessToken = await getCookie("accessToken");

        if (!accessToken) {
            // No token at all — this is a normal "not logged in" case
            return { status: "unauthenticated" };
        }

        const response = await serverFetch.get("/auth/me", {
            // next: { tags: ["user"], revalidate: 180 },
        });

        if (response.status === 401 || response.status === 403) {
            return { status: "unauthenticated" };
        }

        if (!response.ok) {
            console.error(
                `Failed to get user info: ${response.status} ${response.statusText}`
            );
            return { status: "error" };
        }

        const result = await response.json();

        if (!result.success || !result.data) {
            console.error("Failed to get user info:", result);
            return { status: "error" };
        }

        let verifiedToken: JwtPayload;
        try {
            verifiedToken = jwt.verify(
                accessToken,
                process.env.JWT_SECRET as string
            ) as JwtPayload;
        } catch (jwtError) {
            console.error("Invalid token:", jwtError);
            return { status: "unauthenticated" };
        }

        const user: IAuthUser = {
            ...result.data,
            name: result.data.name || verifiedToken.name || "Unknown User",
            email: result.data.email ?? verifiedToken.email,
            role: result.data.role ?? verifiedToken.role,
        };

        return { status: "ok", user };
    } catch (error) {
        // Network failure, DNS error, serverFetch throwing, etc.
        if (error instanceof TypeError && error.message === "fetch failed") {
            console.warn("getUserInfo: Backend API is unavailable.");
        } else {
            console.error("Unexpected error in getUserInfo:", error);
        }
        return { status: "error" };
    }
};