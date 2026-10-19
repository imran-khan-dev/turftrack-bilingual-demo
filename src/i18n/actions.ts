"use server";

import { cookies } from "next/headers";
import { isLocale, type Locale } from "./locales";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) throw new Error("Unsupported locale");
  (await cookies()).set("NEXT_LOCALE", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
