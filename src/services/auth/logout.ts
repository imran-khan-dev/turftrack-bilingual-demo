"use server";

import { serverFetch } from "@/lib/server-fetch";
import { deleteCookie } from "./tokenHandlers";
import { redirect } from "next/navigation";

export async function logoutUser() {
    try {
        // Backend logout
        await serverFetch.post("/auth/logout", {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Backend logout failed:", error);
    }

    // clear frontend cookies
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    redirect("/login?loggedOut=true");
}

export async function logoutUnverifed() {

    try {
        // Backend logout
        await serverFetch.post("/auth/logout", {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Backend logout failed:", error);
    }

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
}